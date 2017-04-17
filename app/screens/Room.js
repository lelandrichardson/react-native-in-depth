import React, { PropTypes } from 'react';
import {
  StyleSheet,
  View,
  LayoutAnimation,
} from 'react-native';
import FlatList from 'react-native-flat-list';
import Navigator from 'native-navigation';
import { compose, gql, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import Screen from '../components/Screen';
import Message from '../components/Message';
import RoomHeader from '../components/RoomHeader';
import MessageInput from '../components/MessageInput';
import withKeyboardHeight from '../components/withKeyboardHeight';
import Invert from '../components/Invert';
import Loader from '../components/Loader';
import realtime from '../utils/realtime';
import oneAtATime from '../utils/oneAtATime';
import { SETTINGS } from '../routes';

const createMessageMutation = gql`
  mutation (
    $roomId: ID,
    $senderName: String!,
    $senderImage: String,
    $text: String!
  ) {
    createMessage(
      roomId: $roomId
      senderName: $senderName
      senderImage: $senderImage
      text: $text
    ) {
      id
      senderName
      senderImage
      text
      createdAt
    }
  }
`;

const MessagesQuery = gql`
  query MessageQuery ($roomId: ID, $pageSize: Int) {
    allMessages(
      first: $pageSize,
      filter: {
        room: {
          id: $roomId
        }
      },
      orderBy: createdAt_DESC
    ) {
      id
      senderName
      senderImage
      text
      createdAt
    }
  }
`;

const MoreMessagesQuery = gql`
  query MessageQuery ($roomId: ID, $pageSize: Int, $after: String) {
    allMessages(
      first: $pageSize,
      after: $after,
      filter: {
        room: {
          id: $roomId
        }
      },
      orderBy: createdAt_DESC
    ) {
      id
      senderName
      senderImage
      text
      createdAt
    }
  }
`;

const SubscriptionQuery = gql`
  subscription newMessages($roomId: ID) {
    Message(filter: {
      node: {
        room: {
          id: $roomId
        }
      },
      mutation_in: [CREATED]
    }) {
      node {
        id
        senderName
        senderImage
        text
        createdAt
      }
    }
  }
`;

const propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string,

  // provided by redux
  user: PropTypes.shape({
    name: PropTypes.string,
    image: PropTypes.string,
  }).isRequired,

  // provided by apollo
  messages: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    allMessages: PropTypes.array,
    error: PropTypes.any,
  }).isRequired,
  loadMore: PropTypes.func.isRequired,
  createMessage: PropTypes.func.isRequired,
};

class Room extends React.Component {
  constructor(props) {
    super(props);
    this.handleCreateMessage = this.handleCreateMessage.bind(this);
  }
  handleCreateMessage(message) {
    const { createMessage, id, user } = this.props;
    if (!message || !message.trim()) {
      return;
    }
    const now = (new Date()).toISOString();
    const variables = {
      roomId: id,
      senderName: user.name,
      senderImage: user.image,
      text: message,
    };
    const optimisticResponse = {
      __typename: 'Mutation',
      createMessage: {
        __typename: 'Message',
        id: null,
        senderName: user.name,
        senderImage: user.image,
        text: message,
        createdAt: now,
      },
    };
    const updateQueries = {
      MessageQuery: (messages, { mutationResult }) => {
        const sent = mutationResult.data.createMessage;
        return {
          ...messages,
          allMessages: [
            { ...sent },
            ...messages.allMessages.filter(m => m.id !== sent.id),
          ],
        };
      },
    };

    createMessage({ variables, optimisticResponse, updateQueries });
      // .then(({ data: { createMessage: message }}) => this.setState({ messageId: message.id }));
  }
  componentWillReceiveProps(nextProps) {
    const a = nextProps.messages.allMessages;
    const b = this.props.messages.allMessages;
    if (a && b && a[0] !== b[0]) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    }
  }
  render() {
    const { messages, title, user, loadMore } = this.props;
    const { allMessages, loading, refetch } = messages;

    const content = loading ? (
      <Loader />
    ) : (
      <Invert style={{ flex: 1 }}>
        <FlatList
          style={{ paddingTop: 8 }}
          removeClippedSubviews
          onEndReached={loadMore}
          onEndReachedThreshold={500}
          ListFooterComponent={() => (
            <RoomHeader
              title={title}
              loading={loading}
              messages={allMessages}
            />
          )}
          data={allMessages}
          refreshing={loading}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <Invert><Message {...item} /></Invert>}
        />
      </Invert>
    );

    return (
      <Screen
        title={title}
        rightImage={require('../icons/refresh.png')}
        onRightPress={refetch}
      >
        <View style={StyleSheet.absoluteFill}>
          {content}
          <MessageInput
            senderName={user.name}
            senderImage={user.image}
            onAvatarPress={() => Navigator.present(SETTINGS)}
            onSend={this.handleCreateMessage}
          />
        </View>
      </Screen>
    );
  }
}

Room.propTypes = propTypes;

const PAGE_SIZE = 20;

module.exports = compose(
  connect(state => ({ user: state.user })),
  graphql(createMessageMutation, { name: 'createMessage' }),
  realtime(MessagesQuery, SubscriptionQuery, {
    name: 'messages',
    queryName: 'allMessages',
    subscriptionName: 'Message',
    append: (nodes, newNode) => [{ ...newNode }, ...nodes],
    options: props => ({
      variables: { roomId: props.id, pageSize: PAGE_SIZE },
    }),
    props: props => ({
      ...props.ownProps,
      messages: props.messages,
      loadMore: oneAtATime((done) => {
        const { allMessages } = props.messages;
        props.messages.fetchMore({
          query: MoreMessagesQuery,
          variables: {
            roomId: props.ownProps.id,
            pageSize: PAGE_SIZE,
            after: allMessages[allMessages.length - 1].id,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            done();
            if (!fetchMoreResult) {
              return prev;
            }
            return {
              ...prev,
              allMessages: [
                ...prev.allMessages,
                ...fetchMoreResult.allMessages,
              ],
            };
          },
        });
      }),
    }),
  }),
  withKeyboardHeight(),
)(Room);

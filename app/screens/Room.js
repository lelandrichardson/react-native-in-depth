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
import realtime from '../utils/realtime';
import { SETTINGS } from '../routes';
import theme from '../theme';

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
    }
  }
`;

const MessagesQuery = gql`
  query ($roomId: ID) {
    allMessages(
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
  }).isRequired,
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
    const variables = {
      roomId: id,
      senderName: user.name,
      senderImage: user.image,
      text: message,
    };
    createMessage({ variables });
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
    const { messages, title, user } = this.props;
    const { allMessages, loading } = messages;

    return (
      <Screen title={title}>
        <View style={StyleSheet.absoluteFill}>
          <View
            style={[theme.styles.invert, { flex: 1 }]}
          >
            <FlatList
              style={{ paddingTop: 8 }}
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
              renderItem={({ item }) => <Message {...item} />}
            />
          </View>
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

// TODO: pagination / infinite load / optimistic updates
module.exports = compose(
  connect(state => ({ user: state.user })),
  realtime(MessagesQuery, SubscriptionQuery, {
    name: 'messages',
    queryName: 'allMessages',
    subscriptionName: 'Message',
    append: (nodes, newNode) => [{ ...newNode }, ...nodes],
    options: props => ({
      variables: { roomId: props.id },
    }),
  }),
  graphql(createMessageMutation, { name: 'createMessage' }),
  withKeyboardHeight(),
)(Room);

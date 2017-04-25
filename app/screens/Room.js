import React, { PropTypes } from 'react';
import {
  StyleSheet,
  View,
  LayoutAnimation,
} from 'react-native';
import FlatList from 'react-native-flat-list';
import Navigator from 'native-navigation';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import Screen from '../components/Screen';
import Message from '../components/Message';
import RoomHeader from '../components/RoomHeader';
import MessageInput from '../components/MessageInput';
import withKeyboardHeight from '../components/withKeyboardHeight';
import Invert from '../components/Invert';
import LottieLoader from '../components/LottieLoader';
import realtime from '../utils/realtime';
import {
  fetchMessagesQuery,
  fetchMoreMessagesQuery,
  newMessagesSubscription,
  createMessageMutation,
} from '../queries';
import Analytics from '../analytics';

import { SETTINGS } from '../routes';

const propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string,

  // provided by redux
  user: PropTypes.shape({
    name: PropTypes.string,
    image: PropTypes.string,
  }).isRequired,
  logView: PropTypes.func.isRequired,

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
    Analytics.trackEvent('messaging', 'message_send');
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
  componentDidMount() {
    this.props.logView(this.props.id);
  }
  render() {
    const { messages, title, user, loadMore } = this.props;
    const { allMessages, loading, refetch } = messages;

    const content = loading ? (
      <LottieLoader />
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

module.exports = compose(
  graphql(createMessageMutation, { name: 'createMessage' }),
  realtime({
    loadQuery: fetchMessagesQuery,
    loadMoreQuery: fetchMoreMessagesQuery,
    subscriptionQuery: newMessagesSubscription,
    pageSize: 20,
    name: 'messages',
    queryName: 'allMessages',
    subscriptionName: 'Message',
    mergeSubscription: (nodes, newNode) => [{ ...newNode }, ...nodes],
    mergeMore: (nodes, older) => [...nodes, ...older],
    options: props => ({
      variables: { roomId: props.id, pageSize: 20 },
    }),
  }),
  connect(
    (state) => ({ user: state.user }),
    (dispatch) => ({ logView: id => dispatch({ type: 'ROOM_VIEWED', payload: id }) }),
  ),
  withKeyboardHeight(),
)(Room);

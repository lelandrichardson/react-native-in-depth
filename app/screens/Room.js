import React, { PropTypes } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
} from 'react-native';
import Navigator from 'native-navigation';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import Screen from '../components/Screen';
import MessageInput from '../components/MessageInput';
import Loader from '../components/Loader';
import realtime from '../utils/realtime';
import {
  fetchMessagesQuery,
  fetchMoreMessagesQuery,
  newMessagesSubscription,
  createMessageMutation,
} from '../queries';

import { SETTINGS } from '../routes';

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

    // create the message, and optimistically update the UI
    createMessage({ variables, optimisticResponse, updateQueries });
  }
  render() {
    const { messages, title, user, loadMore } = this.props;
    const { allMessages, loading, refetch } = messages;

    // Exercises:
    // 1. Pass in the name of the room from the `Rooms` screen and use it to render a title in the
    //    Navigation bar
    // 2. Make a `<Message />` component that looks good!
    // 3. How to make the messages hug the bottom? Check out 'react-native-invertible-scroll-view'!
    // 4. Add a button to refresh the UI using `refetch`

    return (
      <Screen>
        <View style={StyleSheet.absoluteFill}>
          <ScrollView>
            <Navigator.Spacer />
            {loading ? (
              <Loader />
            ) : (
              allMessages.map(m => (
                <View key={m.id}>
                  <Text style={{ fontWeight: 'bold', marginTop: 8 }}>
                    {m.senderName}
                  </Text>
                  <Text>{m.text}</Text>
                </View>
              ))
            )}
          </ScrollView>
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
  connect(state => ({ user: state.user })),
)(Room);

import React, { PropTypes } from 'react';
import {
  View,
  Text,
  ScrollView,
} from 'react-native';
import Navigator from 'native-navigation';
import { compose, graphql } from 'react-apollo';
import Screen from '../components/Screen';
import Loader from '../components/Loader';
import { SETTINGS, ROOM, ADD_ROOM } from '../routes';
import {
  fetchRoomsQuery,
  fetchMoreRoomsQuery,
  newRoomsSubscription,
  createRoomMutation,
} from '../queries';
import realtime from '../utils/realtime';

const propTypes = {
  // provided by apollo
  rooms: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    allRooms: PropTypes.array,
  }).isRequired,
  loadMore: PropTypes.func.isRequired,
  createRoom: PropTypes.func.isRequired,
};

const BUTTONS = [
  {
    image: require('../icons/settings.png'),
    onPress: () => Navigator.present(SETTINGS),
  },
  {
    image: require('../icons/add.png'),
    onPress: () => Navigator.present(ADD_ROOM),
  },
];

class Rooms extends React.Component {
  render() {
    const { rooms, loadMore } = this.props;
    const { loading, allRooms } = rooms;
    return (
      <Screen
        title="Rooms"
        rightButtons={BUTTONS}
        onRightPress={(i) => BUTTONS[i].onPress()}
      >
        <ScrollView>
          <Navigator.Spacer />
          {loading ? (
            <Loader />
          ) : (
            allRooms.map(r => (
              <View key={r.id}>
                <Text onPress={() => Navigator.push(ROOM, { id: r.id })}>
                  {r.name}
                </Text>
              </View>
            ))
          )}
        </ScrollView>
      </Screen>
    );
  }
}

Rooms.propTypes = propTypes;

module.exports = compose(
  realtime({
    loadQuery: fetchRoomsQuery,
    loadMoreQuery: fetchMoreRoomsQuery,
    subscriptionQuery: newRoomsSubscription,
    pageSize: 5,
    name: 'rooms',
    queryName: 'allRooms',
    subscriptionName: 'Room',
    mergeSubscription: (nodes, newNode) => [{ ...newNode }, ...nodes],
    mergeMore: (nodes, older) => [...nodes, ...older],
  }),
  graphql(createRoomMutation, { name: 'createRoom' }),
)(Rooms);

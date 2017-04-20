import React, { PropTypes } from 'react';
import {
  Platform,
  ScrollView,
} from 'react-native';
import Navigator from 'native-navigation';
import { compose } from 'react-apollo';
import Screen from '../components/Screen';
import RoomRow from '../components/RoomRow';
import Loader from '../components/Loader';
import { SETTINGS, ROOM, ADD_ROOM } from '../routes';
import {
  fetchRoomsQuery,
  fetchMoreRoomsQuery,
  newRoomsSubscription,
} from '../queries';
import realtime from '../utils/realtime';

const propTypes = {
  // provided by apollo
  rooms: PropTypes.shape({
    loading: PropTypes.bool.isRequired,
    allRooms: PropTypes.array,
  }).isRequired,
  loadMore: PropTypes.func.isRequired,
};

const BUTTONS = [
  {
    image: require('../icons/settings.png'),
    title: Platform.select({ android: 'Settings' }),
    route: SETTINGS,
    onPress: () => Navigator.present(SETTINGS),
  },
  {
    image: require('../icons/add.png'),
    title: Platform.select({ android: 'Add Room' }),
    route: ADD_ROOM,
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
              <RoomRow
                key={r.id}
                title={r.name}
                onPress={() => Navigator.push(ROOM, { id: r.id, title: r.name })}
              />
            ))
          )}
        </ScrollView>
      </Screen>
    );
  }
}

Rooms.propTypes = propTypes;

// Exercise:
// Add a reducer that keeps tracks of the dates we viewed the Room screen for a particular room,
// and then render that into the room list as part of the room row.
// Additionally, sort the rooms rows by date last viewed in addition to whether or not it is
// favorited.
// Hint: the solution for this looks a lot like the code for the `isFavorited` solution.

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
)(Rooms);

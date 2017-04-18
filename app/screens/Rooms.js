import React, { PropTypes } from 'react';
import {
  Platform,
} from 'react-native';
import Navigator from 'native-navigation';
import { compose, graphql } from 'react-apollo';
import FlatList from 'react-native-flat-list';
import Screen from '../components/Screen';
import Row from '../components/Row';
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
        {loading ? (
          <Loader />
        ) : (
          <FlatList
            removeClippedSubviews
            onEndReached={loadMore}
            onEndReachedThreshold={500}
            initialNumToRender={15}
            ListHeaderComponent={() => <Navigator.Spacer />}
            data={allRooms}
            refreshing={loading}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <Row
                key={item.id}
                title={item.name}
                onPress={() => Navigator.push(ROOM, { id: item.id, title: item.name })}
              />
            )}
          />
        )}
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

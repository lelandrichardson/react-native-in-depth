import React, { PropTypes } from 'react';
import {
  Platform,
  ScrollView,
} from 'react-native';
import Navigator from 'native-navigation';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import Screen from '../components/Screen';
import RoomRow from '../components/RoomRow';
import LottieLoader from '../components/LottieLoader';
import { SETTINGS, ROOM, ADD_ROOM, SEARCH } from '../routes';
import {
  fetchRoomsQuery,
  fetchMoreRoomsQuery,
  newRoomsSubscription,
} from '../queries';
import realtime from '../utils/realtime';

const propTypes = {
  // provided by redux
  favorite: PropTypes.func.isRequired,
  decoratedRooms: PropTypes.array,

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

// EXERCISE:
// This screen renders a bunch of RoomRow components in a scrollview. The RoomRows that are
// offscreen should ideally not be attached to the view hierarchy when they are offscreen.
// Use the "Perf Monitor" in the ios simulator to see the # of views attached vs. the # of
// react component instances.

// EXERCISE:
// If the numbers seem higher than they should be, use the `__findOffscreenViews()` devtool to
// locate the views which you could optimize by setting `removeClippedSubviews` to true

// EXERCISE:
// Use `__Perf.start()` and `__Perf.stop()` and `__Perf.printExclusive()` or `__Perf.printWasted()`
// to find some components that are unnecessarily updating. Consider also using `__logLifecycle()`
// to pinpoint what components are updating and when. Use this information to potentially change
// some components into pure components or by implementing their `shouldComponentUpdate` method

// EXERCISE:
// Try refactoring this screen to use `FlatList` instead of `ScrollView`.

class Rooms extends React.Component {
  render() {
    const { decoratedRooms, rooms, loadMore, favorite } = this.props;
    const { loading, allRooms } = rooms;
    return (
      <Screen
        title="Rooms"
        leftImage={require('../icons/alarm.png')}
        onLeftPress={() => Navigator.present(SEARCH)}
        rightButtons={BUTTONS}
        onRightPress={(i) => BUTTONS[i].onPress()}
      >
        <ScrollView>
          <Navigator.Spacer />
          {loading ? (
            <LottieLoader />
          ) : (
            decoratedRooms.map(item => (
              <RoomRow
                key={item.id}
                title={item.name}
                lastViewed={item.lastViewed}
                favorited={item.isFavorited}
                onFavoritePress={() => favorite(item.id)}
                onPress={() => Navigator.push(ROOM, { id: item.id, title: item.name })}
              />
            ))
          )}
        </ScrollView>
      </Screen>
    );
  }
}

Rooms.propTypes = propTypes;

const compareRoom = (a, b) => {
  if (a.isFavorited === b.isFavorited) {
    return b.lastViewed - a.lastViewed;
  }
  return b.isFavorited - a.isFavorited;
};

const decoratedRooms = createSelector(
  (state) => state.roomFavorites,
  (state) => state.roomViews,
  (state, props) => props.rooms.allRooms,
  (favorites, lastViews, allRooms) => {
    if (!allRooms || allRooms.length === 0) return [];
    return allRooms.map(room => ({
      ...room,
      isFavorited: favorites.get(room.id, false),
      lastViewed: lastViews.get(room.id, 0),
    }))
    .sort(compareRoom);
  }
);

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
  connect(
    (state, props) => ({ decoratedRooms: decoratedRooms(state, props) }),
    (dispatch) => ({ favorite: id => dispatch({ type: 'ROOM_FAVORITE_TOGGLED', payload: id }) }),
  ),
)(Rooms);

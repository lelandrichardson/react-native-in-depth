import React, { PropTypes } from 'react';
import {
  Platform,
} from 'react-native';
import Navigator from 'native-navigation';
import { compose, gql, graphql } from 'react-apollo';
import FlatList from 'react-native-flat-list';
import Screen from '../components/Screen';
import Row from '../components/Row';
import Loader from '../components/Loader';
import { SETTINGS, ROOM, ADD_ROOM } from '../routes';
import realtime from '../utils/realtime';
import oneAtATime from '../utils/oneAtATime';

const createRoomMutation = gql`
  mutation ($name: String!) {
    createRoom(
      name: $name
    ) {
      id
    }
  }
`;

const RoomsQuery = gql`
  query ($pageSize: Int) {
    allRooms(
      first: $pageSize,
      orderBy: createdAt_DESC
    ) {
      id
      name
    }
  }
`;

const MoreRoomsQuery = gql`
  query ($pageSize: Int, $after: String) {
    allRooms(
      first: $pageSize,
      after: $after,
      orderBy: createdAt_DESC
    ) {
      id
      name
    }
  }
`;

const SubscriptionQuery = gql`
  subscription newRooms {
    Room(filter: {
      mutation_in: [CREATED]
    }) {
      node {
        id
        name
      }
    }
  }
`;

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

const PAGE_SIZE = 5;

module.exports = compose(
  realtime(RoomsQuery, SubscriptionQuery, {
    name: 'rooms',
    queryName: 'allRooms',
    subscriptionName: 'Room',
    append: (nodes, newNode) => [...nodes, { ...newNode }],
    props: props => ({
      ...props.ownProps,
      rooms: props.rooms,
      loadMore: oneAtATime((done) => {
        const { allRooms } = props.rooms;
        props.rooms.fetchMore({
          query: MoreRoomsQuery,
          variables: {
            pageSize: PAGE_SIZE,
            after: allRooms[allRooms.length - 1].id,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            done();
            if (!fetchMoreResult) {
              return prev;
            }
            return {
              ...prev,
              allRooms: [
                ...prev.allRooms,
                ...fetchMoreResult.allRooms,
              ],
            };
          },
        });
      }),
    }),
  }),
  graphql(createRoomMutation, { name: 'createRoom' }),
)(Rooms);

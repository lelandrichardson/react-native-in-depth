import React, { PropTypes } from 'react';
import {
  Text,
  Platform,
} from 'react-native';
import Navigator from 'native-navigation';
import { compose, gql, graphql } from 'react-apollo';
import ScrollScreen from '../components/ScrollScreen';
import Row from '../components/Row';
import { SETTINGS, ROOM, ADD_ROOM } from '../routes';
import realtime from '../utils/realtime';

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
  query {
    allRooms(
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
    const { rooms } = this.props;
    return (
      <ScrollScreen
        title="Rooms"
        rightButtons={BUTTONS}
        onRightPress={(i) => BUTTONS[i].onPress()}
      >
        {rooms.loading && <Text>Loading...</Text>}
        {!rooms.loading && rooms.allRooms.map(room => (
          <Row
            key={room.id}
            title={room.name}
            onPress={() => Navigator.push(ROOM, { id: room.id, title: room.name })}
          />
        ))}
      </ScrollScreen>
    );
  }
}

Rooms.propTypes = propTypes;

module.exports = compose(
  realtime(RoomsQuery, SubscriptionQuery, {
    name: 'rooms',
    queryName: 'allRooms',
    subscriptionName: 'Room',
    append: (nodes, newNode) => [...nodes, { ...newNode }],
  }),
  graphql(createRoomMutation, { name: 'createRoom' }),
)(Rooms);

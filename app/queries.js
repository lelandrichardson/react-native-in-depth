import { gql } from 'react-apollo';

export const createRoomMutation = gql`
  mutation (
    $name: String!,
  ) {
    createRoom(
      name: $name
    ) {
      id
    }
  }
`;

export const fetchRoomsQuery = gql`
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

export const fetchMoreRoomsQuery = gql`
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

export const newRoomsSubscription = gql`
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

export const createMessageMutation = gql`
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

export const fetchMessagesQuery = gql`
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

export const fetchMoreMessagesQuery = gql`
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
export const newMessagesSubscription = gql`
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

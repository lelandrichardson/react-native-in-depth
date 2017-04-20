import { Map } from 'immutable';

const initialState = Map(); // Map<roomId, timestamp>

function roomViewsReducer(state = initialState, action) {
  switch (action.type) {
    case 'ROOM_VIEWED':
      return state.set(action.payload, Date.now());
    default:
      return state;
  }
}

module.exports = roomViewsReducer;

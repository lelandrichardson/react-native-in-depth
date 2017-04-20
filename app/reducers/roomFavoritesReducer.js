import { Map } from 'immutable';

const initialState = Map(); // Map<roomId, haveFavorited>

function roomFavoritesReducer(state = initialState, action) {
  switch (action.type) {
    case 'ROOM_FAVORITE_TOGGLED':
      return state.update(action.payload, fav => !fav, false);
    default:
      return state;
  }
}

module.exports = roomFavoritesReducer;

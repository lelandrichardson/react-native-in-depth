import { combineReducers } from 'redux';
import client from '../client';

module.exports = combineReducers({
  user: require('./userReducer'),
  roomFavorites: require('./roomFavoritesReducer'),
  apollo: client.reducer(),
});

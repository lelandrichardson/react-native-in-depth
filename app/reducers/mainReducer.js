import { combineReducers } from 'redux';
import client from '../client';

module.exports = combineReducers({
  user: require('./userReducer'),
  apollo: client.reducer(),
});

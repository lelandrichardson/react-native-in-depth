import UserService from '../services/UserService';

const initialState = {
  ...UserService.createDefaultUser(),
};

function userReducer(state = initialState, action) {
  switch (action.type) {
    case UserService.INITIALIZE_ACTION:
      return {
        ...state,
        ...action.payload,
      };
    case 'USER_CHANGED':
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
}

module.exports = userReducer;

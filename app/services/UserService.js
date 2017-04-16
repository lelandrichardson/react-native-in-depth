import { AsyncStorage } from 'react-native';

const KEY = 'RN_CHAT_USER_INFO';
const INITIALIZE_ACTION = 'USER_INIT';

const createDefaultUser = () => {
  return clean({
    name: `Anonymous ${Math.round(Math.random() * 1000)}`,
    image: null,
    email: null,
  });
};

const stringOrNull = val => (val == null ? null : String(val));
const clean = user => ({
  name: stringOrNull(user.name),
  image: stringOrNull(user.image),
  email: stringOrNull(user.email),
});

const get = () => AsyncStorage
  .getItem(KEY)
  .then(val => (val ? JSON.parse(val) : createDefaultUser()))
  .then(clean)
  .catch(() => createDefaultUser());

const set = (user) => AsyncStorage.setItem(KEY, JSON.stringify(clean(user)));

const initialize = (store, getUser) => {
  let last = null;

  get().then(user => {
    last = user;
    store.dispatch({
      type: INITIALIZE_ACTION,
      payload: user,
    });
  });

  store.subscribe(() => {
    const user = getUser(store.getState());
    if (user !== last) {
      last = user;
      set(user);
    }
  });
};

const UserService = {
  INITIALIZE_ACTION,
  createDefaultUser,
  get,
  set,
  initialize,
};

module.exports = UserService;

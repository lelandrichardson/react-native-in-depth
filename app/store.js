/* flow */
/* eslint-disable global-require */
import {
  Platform,
} from 'react-native';
import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import pack from 'redux-pack';
import unwrapDefaultExport from './utils/unwrapDefaultExport';

const middlewares = [
  thunk,
  pack.middleware,
];

if (__DEV__) {
  if (__DEBUGGING_REMOTELY__) {
    // eslint-disable-next-line import/newline-after-import
    middlewares.push(require('redux-logger').createLogger({ collapsed: true, duration: true }));
  }
}

let devTools = () => next => (...args) => next(...args);

if (__DEV__ && !__TESTENV__) {
  // eslint-disable-next-line no-underscore-dangle
  if (global.__REDUX_DEVTOOLS_EXTENSION__) {
    // For the standalone "React Native Debugger" desktop app.
    // eslint-disable-next-line no-underscore-dangle
    devTools = global.__REDUX_DEVTOOLS_EXTENSION__;
  }
}

const enhancer = compose(
  applyMiddleware(...middlewares),
  devTools(),
);

// Generate our Redux store
const store = createStore(
  unwrapDefaultExport(require('./reducers/mainReducer')),
  undefined, // initial state
  undefined,
);

if (__DEV__) {
  if (module && module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept(() => {
      store.replaceReducer(unwrapDefaultExport(require('./reducers/mainReducer')));
    });
  }
}

export default store;

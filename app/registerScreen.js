import React from 'react';
import { Provider } from 'react-redux';
import Navigator from 'native-navigation';
import unwrapDefaultExport from './utils/unwrapDefaultExport';
import store from './store';


function wrapComponent(screenName, ScreenThunk, options) {
  class Wrapper extends React.Component {
    constructor(props, context) {
      super(props, context);
      this.Component = unwrapDefaultExport(ScreenThunk());
      this.screenName = screenName;
    }
    render() {
      const { Component } = this;
      let connectedScreen = (
        <Provider store={store}>
          <Component {...this.props} />
        </Provider>
      );
      /*if (options.theme) {
        connectedScreen = (
          <ThemeProvider theme={options.theme}>
            {connectedScreen}
          </ThemeProvider>
        );
      }*/
      return connectedScreen;
    }
  }

  return Wrapper;
}


export default function registerConnectedScreen(id, ScreenThunk, options = {}) {
  const Wrapper = wrapComponent(id, ScreenThunk, options);
  Navigator.registerScreen(id, () => Wrapper, options);
}

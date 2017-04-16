import React from 'react';
import { Provider } from 'react-redux';
import { ApolloProvider } from 'react-apollo';
import { Platform } from 'react-native';
import Navigator from 'native-navigation';
import KeyboardContainer from './components/KeyboardContainer';
import unwrapDefaultExport from './utils/unwrapDefaultExport';
import store from './store';
import client from './client';

function wrapComponent(screenName, ScreenThunk) {
  class Wrapper extends React.Component {
    render() {
      const Component = unwrapDefaultExport(ScreenThunk());
      let screen = <Component {...this.props} />;

      if (Platform.OS === 'ios') {
        screen = (
          <KeyboardContainer>
            {screen}
          </KeyboardContainer>
        );
      }

      screen = (
        <Provider store={store}>
          {screen}
        </Provider>
      );
      screen = (
        <ApolloProvider store={store} client={client}>
          {screen}
        </ApolloProvider>
      );
      return screen;
    }
  }

  return Wrapper;
}


export default function registerConnectedScreen(id, ScreenThunk, options = {}) {
  const Wrapper = wrapComponent(id, ScreenThunk, options);
  Navigator.registerScreen(id, () => Wrapper, options);
}

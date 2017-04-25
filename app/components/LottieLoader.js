import SafeModule from 'react-native-safe-module';
import React from 'react';
import { View } from 'react-native';
import Loader from './Loader';

const NativeLottieLoader = SafeModule.component({
  viewName: 'LottieLoader',
  mockComponent: () => console.log('using mock!') || <Loader />,
});

module.exports = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <NativeLottieLoader
      style={{ width: 100, height: 100 }}
      sourceName="juggle"
    />
  </View>
);

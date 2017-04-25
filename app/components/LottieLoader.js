import SafeModule from 'react-native-safe-module';
import React from 'react';
import Loader from './Loader';

const LottieLoader = SafeModule.component({
  viewName: 'LottieLoader',
  mockComponent: () => console.log('using mock!') || <Loader />,
});

module.exports = LottieLoader;

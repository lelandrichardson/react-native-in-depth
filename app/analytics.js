import SafeModule from 'react-native-safe-module';

const Analytics = SafeModule.module({
  moduleName: 'GoogleAnalyticsBridge',
  mock: {
    trackEvent: () => {},
    screenView: () => {},
    setUser: () => {},
  },
});

module.exports = Analytics;

import SafeModule from 'react-native-safe-module';

const AnalyticsBridge = SafeModule.module({
  moduleName: 'GoogleAnalyticsBridge',
  mock: {
    trackEvent: (category, action, optionalValues) => {},
    screenView: (screenName) => {},
    setUser: (userName) => {},
  },
});

module.exports = {
  trackEvent(category, action, optionalValues = {}) {
    AnalyticsBridge.trackEvent(category, action, optionalValues);
  },
  screenView(screenName) {
    AnalyticsBridge.screenView(screenName);
  },
  setUser(userName) {
    AnalyticsBridge.setUser(userName);
  },
};

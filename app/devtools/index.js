/* eslint-disable global-require, import/no-extraneous-dependencies, no-underscore-dangle */

// IMPORTANT USAGE NOTE:
// To use these global variables when using chrome dev tools or the react native debugger, you
// will want to make sure that your console has the `RNDebuggerWorker.js` context selected at the
// top of the console, instead of `top`.

if (__DEV__ && __DEBUGGING_REMOTELY__) {
  // React perf tools: https://facebook.github.io/react/docs/perf.html
  // To use, in console:
  // __Perf.start(); // starts measuring
  // __Perf.stop(); // stops measuring
  // __Perf.printWasted();
  // __Perf.printExclusive();
  // __Perf.printInclusive();
  global.__Perf = require('ReactPerf');

  // React Native perf tools. Very similar to __Perf.
  // To use, in console:
  // __RNPerf.start(); // starts measuring
  // __RNPerf.stop(); // stops measuring, and prints out info
  global.__RNPerf = require('RCTRenderingPerf');

  // Use this method to wrap any react component and log each lifecycle method out to the console
  // whenever it gets invoked.
  // To use:
  // __logLifecycle(MyComponent);
  //
  // This will log all lifecycle methods, including the ones that aren't implemented, and log it
  // to the console in purple.
  // __logLifecycle(MyComponent, true, 'purple');
  global.__logLifecycle = require('./logLifecycle');

  // RN Bridge Debugger.
  // this toggles on or off some "spying" of the JS to Native bridge, where every message between
  // the two realms is logged to the console. This can be a bit noisy, so if you want to tweak
  // which messages get logged or ignored, you can go to the imported file and tweak the filters.
  global.__bridgeDebugger = require('./bridgeDebugger');

  // helper function to test whether a given function is "pure" in that it returns an object that
  // is at least shallowly equal with the object it returns when provided the same exact inputs.
  // To test this, this function will end up running the function it wraps twice for every time
  // it is invoked. This is really handy for ensuring that `mapStateToProps` functions are not
  // causing a bunch of unnecessary re-renders
  global.__ensureShallowPurity = require('./ensureShallowPurity');

  // This helper function will analyze the current react view hierarchy and find views that are
  // not in the visible viewport, but are still attached to the view hierarchy. If you see large
  // collections of views that fall into this category, it's often a good indication that one of
  // your views should be using `removeClippedSubviews`. This is a great and easy way to improve
  // scroll performance of your screen.
  global.__findOffscreenViews = require('./findOffscreenViews');
}

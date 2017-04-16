// This file allows us to inspect the traffic going over the Native <-> JS bridge, and can be
// helpful for debugging. This can be toggled on or off from the command line at any time, but
// if you want it to happen from bridge startup time, you can set this parameter to true.
// Setting this to true should never be committed to git
const ENABLE_BRIDGE_DEBUGGER = false; // <-- THIS SHOULD NOT BE TRUE IN MASTER!!!!

// if true, function arguments will get pretty printed
const PRETTY_PRINT = false;

// enable this if you want to ignore EVERY event, except for the ones that match the `FOCUSED_*`
// constants. If true, you configure what you want to see. If false, you configure what you DONT
// want to see.
const ENABLE_FOCUSED_LOGGING = true;

// don't log anything from these modules at all
const DISABLED_MODULES = toSet([
  'Timing',
  // 'UIManager',
  // 'NativeAnimatedModule',
  // 'Networking',
  // 'RCTEventEmitter',
  // 'WebSocketModule',
]);

// ignore any of these specific calls
const DISABLED_CALLS = toSet([
  'JSTimersExecution.callTimers',
  'JSTimersExecution.callIdleCallbacks',
  'WebSocketModule.send',
  'RCTEventEmitter.receiveTouches',
  // 'RCTEventEmitter.receiveEvent',
  // 'UIManager.createView',
  // 'UIManager.updateView',
  // 'UIManager.setChildren',
  // 'RCTDeviceEventEmitter.emit',
]);

// events to ignore that are coming through the RCTDeviceEventEmitter
const DISABLED_DEVICE_EVENTS = toSet([
  'websocketMessage',
  'didReceiveNetworkData',
  'didReceiveNetworkResponse',
  'didCompleteNetworkResponse',
  'didSendNetworkData',
]);

// events to ignore that are coming through the RCTEventEmitter
const DISABLED_VIEW_EVENTS = toSet([
  'topLoadEnd',
]);

// UIManger components that we want to ignore events from
const IGNORED_UIMANAGER_COMPONENTS = toSet([
  'ARTShape',
  'RCTView',
  'UIView',
]);

// If a module is included here, ALL commands sent to it will get logged
const FOCUSED_MODULES = toSet([
  // 'Timing',
  // 'UIManager',
  // 'NativeAnimatedModule',
  // 'Networking',
  // 'RCTEventEmitter',
  // 'WebSocketModule',
]);

// if a call is included here, ALL of those calls will get logged, and everything else ignored
const FOCUSED_CALLS = toSet([
  // 'JSTimersExecution.callTimers',
  // 'JSTimersExecution.callIdleCallbacks',
  // 'WebSocketModule.send',
  // 'RCTEventEmitter.receiveTouches',
  // 'RCTEventEmitter.receiveEvent',
  'UIManager.createView',
  'UIManager.updateView',
  // 'UIManager.setChildren',
  // 'RCTDeviceEventEmitter.emit',
]);

// if included here, these events will get logged.
const FOCUSED_DEVICE_EVENTS = toSet([
  // 'websocketMessage',
  // 'didReceiveNetworkData',
  // 'didReceiveNetworkResponse',
  // 'didCompleteNetworkResponse',
  // 'didSendNetworkData',
]);

// events to ignore that are coming through the RCTEventEmitter
const FOCUSED_VIEW_EVENTS = toSet([
  // 'topLoadEnd',
]);


// if included here, only uimanager events for these views will show up
const FOCUSED_UIMANAGER_COMPONENTS = toSet([
  // 'ARTShape',
  // 'RCTView',
  // 'UIView',
]);

// eslint-disable-next-line no-inner-declarations
function toSet(array) {
  return array.reduce((res, el) => {
    // eslint-disable-next-line no-param-reassign
    res[el] = true;
    return res;
  }, {});
}

const shouldIgnore = (module, call, args) => {
  if (DISABLED_MODULES[module]) {
    return true;
  }

  if (DISABLED_CALLS[call]) {
    return true;
  }
  switch (call) {
    case 'RCTDeviceEventEmitter.emit':
      if (DISABLED_DEVICE_EVENTS[args[0]]) {
        return true;
      }
      break;
    case 'RCTEventEmitter.receiveEvent':
      if (DISABLED_VIEW_EVENTS[args[1]]) {
        return true;
      }
      break;
    case 'UIManager.updateView':
    case 'UIManager.createView':
      if (IGNORED_UIMANAGER_COMPONENTS[args[1]]) {
        return true;
      }
      break;
    default:
      break;
  }
  return false;
};

const shouldFocus = (module, call, args) => {
  if (FOCUSED_MODULES[module]) {
    return true;
  }

  if (FOCUSED_CALLS[call]) {
    return true;
  }
  switch (call) {
    case 'RCTDeviceEventEmitter.emit':
      if (FOCUSED_DEVICE_EVENTS[args[0]]) {
        return true;
      }
      break;
    case 'RCTEventEmitter.receiveEvent':
      if (FOCUSED_VIEW_EVENTS[args[1]]) {
        return true;
      }
      break;
    case 'UIManager.updateView':
    case 'UIManager.createView':
      if (FOCUSED_UIMANAGER_COMPONENTS[args[1]]) {
        return true;
      }
      break;
    default:
      break;
  }
  return false;
};

/* eslint global-require: 0 import/no-extraneous-dependencies: 0 */
const MessageQueue = require('MessageQueue');

const succinctFormat = args => {
  const argArray = Array.isArray(args) ? args : [args];
  return argArray.map(x => JSON.stringify(x)).join(', ');
};

const longFormat = args => {
  const argArray = Array.isArray(args) ? args : [args];
  return argArray.map(x => JSON.stringify(x, null, 2)).join(',\n');
};

const format = PRETTY_PRINT ? longFormat : succinctFormat;

function logger(info) {
  const call = (info.module ? (`${info.module}.`) : '') + info.method;

  const ignore = ENABLE_FOCUSED_LOGGING
    ? !shouldFocus(info.module, call, info.args)
    : shouldIgnore(info.module, call, info.args);

  if (ignore) {
    return;
  }

  const direction = info.type === 0 ? 'NV->JS' : 'JS->NV';
  console.log(`${direction} : ${call}(${format(info.args)})`);
}

let currentlyEnabled = ENABLE_BRIDGE_DEBUGGER;

function spyOrClear() {
  MessageQueue.spy(currentlyEnabled ? logger : null);
}

function toggle() {
  currentlyEnabled = !currentlyEnabled;
  spyOrClear();
}

module.exports = toggle;

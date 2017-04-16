if (__DEV__) {
  // eslint-disable-next-line import/no-extraneous-dependencies
  const ExceptionsManager = require('ExceptionsManager');

  ExceptionsManager.installConsoleErrorReporter();

  // List of error prefixes that we choose to ignore because they are red herrings or not
  // actionable. Error message needs only to start with one of these strings to be ignored
  const IGNORED_ERRORS = [
    'Attempted to transition from state `RESPONDER_INACTIVE_PRESS_IN`',
  ];

  // Uncommenting this line turns off redbox entirely
  // console.reportErrorsAsExceptions = false;

  // wrap console.error so that it look at our list of ignored errors and swallows if they match
  const original = console.error;
  console.error = function consoleError(err) {
    if (typeof err === 'string') {
      const shouldIgnore = IGNORED_ERRORS.some(prefix => err.startsWith(prefix));
      if (shouldIgnore) {
        console.log('IGNORING ERROR~!');
        return;
      }
    }
    // eslint-disable-next-line prefer-rest-params
    original.apply(console, arguments);
  };
}

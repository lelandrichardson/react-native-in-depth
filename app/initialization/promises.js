/* eslint-disable import/no-extraneous-dependencies */
import RejectionTracking from 'promise/setimmediate/rejection-tracking';

RejectionTracking.enable({
  allRejections: true,
  onUnhandled: (id, error) => {
    // When a promise rejection goes unhandled, this should essentially be considered a crash
    // in most cases.
    if (__DEV__) {
      // in development, we want to just trigger a RedBox
      console.error(error);
    } else {
      // In production we crash the app
      throw error;
    }
  },
  onHandled: () => {},
});

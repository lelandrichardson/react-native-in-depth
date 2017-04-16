import { connect } from 'react-redux';
import ensureShallowPurity from './ensureShallowPurity';

function purityWarningReduxConnect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
  options,
  ) {
  return connect(
    mapStateToProps ? ensureShallowPurity(mapStateToProps) : null,
    mapDispatchToProps,
    mergeProps,
    options,
  );
}

module.exports = purityWarningReduxConnect;

/* eslint react/prop-types: 0 */
import React from 'react';
import {
  ColorPropType,
  TouchableOpacity,
} from 'react-native';
import {
  createPlatformTouchableComponent,
  touchablePropTypes,
} from './platformTouchable';

const propTypes = {
  ...touchablePropTypes,
  color: ColorPropType,
};

export default createPlatformTouchableComponent({
  displayName: 'PlatformTouchableOpacity',
  renderDefaultTouchable(props) {
    return (
      <TouchableOpacity
        activeOpacity={props.activeOpacity}
        disabled={props.disabled}
        onPress={props.onPress}
        style={props.style}
      >
        {props.children}
      </TouchableOpacity>
    );
  },
  propTypes,
  warnUntestedRipple: true,
  needsViewWrap: true,
});

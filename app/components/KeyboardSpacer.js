import React, { Component, PropTypes } from 'react';
import {
  LayoutAnimation,
  View,
  Platform,
} from 'react-native';
import withKeyboardHeight from './withKeyboardHeight';

// From: https://medium.com/man-moon/writing-modern-react-native-ui-e317ff956f02
const defaultAnimation = {
  duration: 500,
  create: {
    duration: 300,
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
  update: {
    type: LayoutAnimation.Types.spring,
    springDamping: 200,
  },
};

class KeyboardSpacer extends Component {
  static propTypes = {
    keyboardHeight: PropTypes.number,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.keyboardHeight !== this.props.keyboardHeight) {
      let animationConfig = defaultAnimation;
      if (Platform.OS === 'ios') {
        animationConfig = LayoutAnimation.create(
          250,
          LayoutAnimation.Types.keyboard,
          LayoutAnimation.Properties.opacity,
        );
      }
      LayoutAnimation.configureNext(animationConfig);
    }
  }

  render() {
    return (
      <View
        style={{
          left: 0,
          right: 0,
          height: this.props.keyboardHeight + 258 + 8,
        }}
      />
    );
  }
}

module.exports = withKeyboardHeight()(KeyboardSpacer);

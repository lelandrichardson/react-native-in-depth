import React from 'react';
import {
  Keyboard,
  Dimensions,
  Platform,
} from 'react-native';

const withKeyboardHeight = () => Component => class KeyboardHeight extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      keyboardHeight: 0,
    };
    this.listeners = null;
    this.updateKeyboardHeight = this.updateKeyboardHeight.bind(this);
    this.resetKeyboardHeight = this.resetKeyboardHeight.bind(this);
  }

  componentDidMount() {
    const updateListener = Platform.OS === 'android' ? 'keyboardDidShow' : 'keyboardWillShow';
    const resetListener = Platform.OS === 'android' ? 'keyboardDidHide' : 'keyboardWillHide';
    this.listeners = [
      Keyboard.addListener(updateListener, this.updateKeyboardHeight),
      Keyboard.addListener(resetListener, this.resetKeyboardHeight),
    ];
  }

  componentWillUnmount() {
    this.listeners.forEach(listener => listener.remove());
  }

  updateKeyboardHeight(event) {
    if (!event.endCoordinates) {
      return;
    }

    const screenHeight = Dimensions.get('window').height;
    const keyboardHeight = +(screenHeight - event.endCoordinates.screenY);
    this.setState({ keyboardHeight });
  }

  resetKeyboardHeight() {
    this.setState({ keyboardHeight: 0 });
  }

  render() {
    return (
      <Component {...this.props} keyboardHeight={this.state.keyboardHeight} />
    );
  }
};

module.exports = withKeyboardHeight;

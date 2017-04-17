import React, { PropTypes } from 'react';
import {
  ScrollView,
  StyleSheet,
  Dimensions,
} from 'react-native';
import Navigator from 'native-navigation';
import Screen from './Screen';

const propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  onPress: PropTypes.func,
};

const defaultProps = {
};

class ScrollScreen extends React.Component {
  render() {
    return (
      <Screen {...this.props}>
        <ScrollView
          style={StyleSheet.absoluteFill}
          contentContainerStyle={{ minHeight: Dimensions.get('window').height }}
        >
          <Navigator.Spacer animated />
          {this.props.children}
        </ScrollView>
      </Screen>
    );
  }
}

ScrollScreen.defaultProps = defaultProps;
ScrollScreen.propTypes = propTypes;

export default ScrollScreen;

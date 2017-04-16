import React from 'react';
import {
  View,
  StyleSheet,
} from 'react-native';

const propTypes = {
  ...View.propTypes,
};

class Invert extends React.Component {
  render() {
    return (
      <View {...this.props} style={[this.props.style, styles.invert]} />
    );
  }
}

Invert.propTypes = propTypes;

const styles = StyleSheet.create({
  invert: {
    transform: [{ scaleY: -1 }],
  },
});

export default Invert;

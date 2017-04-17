import React from 'react';
import {
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

class Loader extends React.Component {
  render() {
    return (
      <ActivityIndicator style={styles.container} />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Loader;

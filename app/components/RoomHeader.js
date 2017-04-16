import React, { PropTypes } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Navigator from 'native-navigation';
import theme from '../theme';

const propTypes = {
  // title: PropTypes.string.isRequired,
  loading: PropTypes.bool.isRequired,
  messages: PropTypes.array,
};

const defaultProps = {
};

class RoomHeader extends React.Component {
  render() {
    const {
      // title,
      loading,
      messages,
    } = this.props;

    const hasMessages = messages && messages.length > 0;

    // TODO: better loading state...
    // TODO: better zero messages state...
    // TODO: "load more" button?

    return (
      <View style={[theme.styles.invert, styles.container]}>
        <Navigator.Spacer animated />
        <View style={styles.header}>
          {loading && (
            <ActivityIndicator />
          )}
          {!loading && !hasMessages && (
            <Text style={styles.text}>
              Nothing here...
            </Text>
          )}
        </View>
      </View>
    );
  }
}

RoomHeader.defaultProps = defaultProps;
RoomHeader.propTypes = propTypes;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
  },
  header: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  text: {
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default RoomHeader;

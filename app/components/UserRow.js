import React, { PropTypes } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Avatar from './Avatar';
import sleep from '../utils/sleep';

const propTypes = {
  image: PropTypes.string,
  name: PropTypes.string,
};

class UserRow extends React.Component {
  render() {
    const { image, name } = this.props;
    sleep(3);
    return (
      <View style={styles.container}>
        <Avatar name={name} image={image} />
        <View style={styles.textContainer}>
          <Text style={styles.text}>{name}</Text>
        </View>
      </View>
    );
  }
}

UserRow.propTypes = propTypes;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 8,
    borderBottomColor: '#dedede',
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  textContainer: {
    marginLeft: 8,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default UserRow;

import React, { PropTypes } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
} from 'react-native';
import PlatformTouchableOpacity from './PlatformTouchableOpacity';

const propTypes = {
  name: PropTypes.string,
  image: PropTypes.string,
  onPress: PropTypes.func,
  onLongPress: PropTypes.func,
};

const defaultProps = {
  name: '',
  image: null,
  onPress: () => {},
  onLongPress: () => {},
};

function getInitials(userName) {
  const name = userName.toUpperCase().split(' ').filter(s => s.trim());
  if (name.length === 1) {
    return `${name[0].charAt(0)}`;
  } else if (name.length > 1) {
    return `${name[0].charAt(0)}${name[name.length - 1].charAt(0)}`;
  }
  return '';
}

function getColor(name) {
  let sumChars = 0;
  for (let i = 0; i < name.length; i += 1) {
    sumChars += name.charCodeAt(i);
  }

  // inspired by https://github.com/wbinnssmith/react-user-avatar
  // colors from https://flatuicolors.com/
  const colors = [
    '#e67e22', // carrot
    '#2ecc71', // emerald
    '#3498db', // peter river
    '#8e44ad', // wisteria
    '#e74c3c', // alizarin
    '#1abc9c', // turquoise
    '#2c3e50', // midnight blue
  ];

  return colors[sumChars % colors.length];
}

export default class Avatar extends React.Component {
  render() {
    const {
      name,
      image,
      onPress,
      onLongPress,
    } = this.props;

    const inner = image ? (
      <Image
        style={styles.avatar}
        source={{ uri: image }}
      />
    ) : (
      <View style={[styles.avatar, { backgroundColor: getColor(name) }]}>
        <Text style={styles.initials}>
          {getInitials(name)}
        </Text>
      </View>
    );

    return (
      <PlatformTouchableOpacity onPress={onPress} onLongPress={onLongPress}>
        {inner}
      </PlatformTouchableOpacity>
    );
  }
}

Avatar.defaultProps = defaultProps;
Avatar.propTypes = propTypes;

const SIZE = 36;
const RADIUS = 8;

const styles = StyleSheet.create({
  avatar: {
    width: SIZE,
    height: SIZE,
    borderRadius: RADIUS,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    color: 'white',
    fontSize: 18,
    lineHeight: 24,
    fontWeight: 'bold',
  },
});

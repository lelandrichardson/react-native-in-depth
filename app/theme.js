import { StyleSheet } from 'react-native';

const size = {
  horizontalPadding: 24,
  verticalPadding: 16,
};

const color = {
  lightText: '#999999',
  darkText: '#484848',
  image: '#484848',
  lightGray: '#f7f7f7',
};

const font = {
  title: {
    color: color.darkText,
    fontSize: 32,
    lineHeight: 36,
    fontWeight: 'bold',
  },
  large: {
    color: color.darkText,
    fontSize: 19,
    lineHeight: 24,
  },
  small: {
    color: color.darkText,
    fontSize: 15,
    lineHeight: 18,
  },
  tiny: {
    color: color.darkText,
    fontSize: 13,
    lineHeight: 16,
  },
};

const styles = StyleSheet.create({
  invert: {
    transform: [{ scaleY: -1 }],
  },
});

module.exports = {
  size,
  font,
  color,
  styles,
  aspectRatio: 1 / 1.6,
};

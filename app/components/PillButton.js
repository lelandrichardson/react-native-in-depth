import React, {
  PropTypes,
} from 'react';
import {
  View,
  Text,
  ColorPropType,
  StyleSheet,
} from 'react-native';

import PlatformTouchableOpacity from './PlatformTouchableOpacity';
import theme from '../theme';

const propTypes = {
  onPress: PropTypes.func,
  title: PropTypes.string,
  color: ColorPropType,
  borderColor: ColorPropType,
  small: PropTypes.bool,
  loading: PropTypes.bool,
  sizeToFit: PropTypes.bool,
};

const defaultProps = {
  onPress() {},
  color: theme.color.white,
  small: false,
  loading: false,
  sizeToFit: true,
};

class PillButton extends React.PureComponent {
  render() {
    const { borderColor, color, small, sizeToFit, title } = this.props;
    return (
      <PlatformTouchableOpacity
        onPress={this.props.onPress}
        activeOpacity={0.5}
        testedAndroidRipple
      >
        <View
          style={[
            styles.container,
            { borderColor: borderColor || color },
            sizeToFit && styles.sizeToFit,
          ]}
        >
          <Text
            style={[
              styles.text,
              small && styles.smallText,
              { color },
            ]}
          >
            {title}
          </Text>
        </View>
      </PlatformTouchableOpacity>
    );
  }
}

PillButton.defaultProps = defaultProps;
PillButton.propTypes = propTypes;

const { bp, font } = theme;
const HEIGHT = 7 * bp;
const BORDER_WIDTH = 2;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 0,
    borderWidth: BORDER_WIDTH,
    // NOTE(lmr): rgba doesn't work in android
    borderColor: '#ffffff',
    borderRadius: HEIGHT / 2,
  },
  sizeToFit: {
    alignSelf: 'flex-start',
  },
  text: {
    ...font.large,
    color: '#ffffff',
    flexDirection: 'column',
    flex: 0,
    marginVertical: 1.25 * bp,
    marginHorizontal: 2.5 * bp,
    backgroundColor: 'transparent',
  },
  smallText: {
    ...font.small,
    color: '#ffffff',
    marginVertical: 0.75 * bp,
    marginHorizontal: 2.25 * bp,
  },
  textLoading: {
    opacity: 0,
  },
});

export default PillButton;

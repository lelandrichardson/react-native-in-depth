import React, { PropTypes } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';

import BaseRow from './BaseRow';
import LiveDate from './LiveDate';
import theme from '../theme';

const propTypes = {
  title: PropTypes.string.isRequired,
  lastViewed: PropTypes.number,
  subtitle: PropTypes.string,
  onPress: PropTypes.func,
};

const defaultProps = {
};

class RoomRow extends React.Component {
  render() {
    const {
      title,
      subtitle,
      lastViewed,
      onPress,
    } = this.props;

    return (
      <BaseRow onPress={onPress}>
        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <View>
              <Text style={styles.title}>
                {title}
              </Text>
              {!!lastViewed && (
                <LiveDate date={lastViewed} />
              )}
            </View>
          </View>
          {onPress && (
            <Image
              source={require('../icons/chevron_right.png')}
              style={{
                width: 24,
                height: 24,
                opacity: 0.5,
              }}
            />
          )}
        </View>
      </BaseRow>
    );
  }
}

RoomRow.defaultProps = defaultProps;
RoomRow.propTypes = propTypes;

const styles = StyleSheet.create({
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginVertical: 8,
  },
  contentTween: {
    marginVertical: 24,
  },
  loadingContainer: {
    flex: 0,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  title: theme.font.large,
  subtitle: {
    ...theme.font.small,
    marginTop: 4,
  },
  icon: {
    marginTop: 0.4 * 8,
  },
});

export default RoomRow;

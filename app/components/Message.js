import React, { PropTypes } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import PlatformTouchableOpacity from './PlatformTouchableOpacity';
import Avatar from './Avatar';
import LiveDate from './LiveDate';

const propTypes = {
  text: PropTypes.string.isRequired,
  senderName: PropTypes.string.isRequired,
  senderImage: PropTypes.string,
  createdAt: PropTypes.string,
};

const defaultProps = {
};

class Message extends React.Component {
  render() {
    const {
      text,
      senderName,
      senderImage,
      createdAt,
    } = this.props;

    return (
      <View style={styles.container}>
        <Avatar
          name={senderName}
          image={senderImage}
        />
        <PlatformTouchableOpacity
          style={{ flex: 1 }}
          onPress={() => console.log('press')}
        >
          <View style={styles.bubble}>
            <View style={styles.topContainer}>
              <Text style={styles.sender}>
                {senderName}
              </Text>
              <LiveDate style={styles.date} date={createdAt} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.text}>
                {text}
              </Text>
            </View>
          </View>
        </PlatformTouchableOpacity>
      </View>
    );
  }
}

Message.defaultProps = defaultProps;
Message.propTypes = propTypes;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 8,
    marginTop: 8,
  },
  bubble: {
    flex: 1,
    marginLeft: 8,
  },
  topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  sender: {
    fontWeight: 'bold',
  },
  date: {
    fontSize: 12,
    fontWeight: '200',
    color: '#aaa',
  },
  textContainer: {

  },
  text: {

  },
});

export default Message;

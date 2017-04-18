import React, { PropTypes } from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';

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

    // Exercise:
    // 1. use `senderName` and `senderImage` with the `<Avatar />` component to render user's image
    // 2. give the user's name and message different font styles
    // 3. try rendering the date with `createdAt`. You can use JS's built in date formatting, or try
    //    the `<LiveDate />` component.
    // 4. How would you make thi component touchable?  what about long presses?

    return (
      <View style={styles.container}>

      </View>
    );
  }
}

Message.defaultProps = defaultProps;
Message.propTypes = propTypes;

const styles = StyleSheet.create({

});

export default Message;

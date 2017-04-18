import React, { PropTypes } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Image,
} from 'react-native';
import PlatformTouchableOpacity from './PlatformTouchableOpacity';

const propTypes = {
  senderName: PropTypes.string,
  senderImage: PropTypes.string,
  placeholder: PropTypes.string,
  onSend: PropTypes.func,
  onAvatarPress: PropTypes.func,
};

const defaultProps = {
  placeholder: null,
  onAvatarPress: () => {},
  onSend: () => {},
};

const MIN_INPUT_HEIGHT = 36;
const MAX_INPUT_HEIGHT = 89;

function getHeightFromContentHeight(contentHeight) {
  const height = contentHeight + 3.5;
  if (height > MAX_INPUT_HEIGHT) return MAX_INPUT_HEIGHT;
  if (height < MIN_INPUT_HEIGHT) return MIN_INPUT_HEIGHT;
  return height;
}

class MessageInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      buttonWidth: 0,
      inputHeight: MIN_INPUT_HEIGHT,
    };
    this.onSendPress = this.onSendPress.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onChangeText = this.onChangeText.bind(this);
  }
  onChange(e) {
    const inputHeight = getHeightFromContentHeight(e.nativeEvent.contentSize.height);

    // Exercise
    // We now have the input height. What can we do with this?
  }
  onChangeText(text) {
    this.setState({ text });
  }
  onSendPress() {
    this.props.onSend(this.state.text);
    this.setState({ text: '', inputHeight: MIN_INPUT_HEIGHT });
  }
  render() {
    const { inputHeight, text } = this.state;
    const { senderName, senderImage, placeholder, onAvatarPress } = this.props;

    // Exercise
    // 1. Try hiding the send button when there is no text for a cleaner look
    // 2. Try adding the user's avatar next to the text input for a more uniform look with the
    //    message components above it
    // 3. Give the message input a different beckground color and maybe a top border to separate it
    //    from the rest of the UI better.
    // 4. How would you make the text input grow as the text inside of it grows? Hint: look at the
    //    `onChange` handler in this file

    return (
      <View style={styles.container}>
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.textInput, { height: inputHeight }]}
            value={text}
            onChange={this.onChange}
            onChangeText={this.onChangeText}
            placeholder={'Send a message...'}
            multiline
            accessibilityLabel={placeholder}
            underlineColorAndroid="transparent"
            enablesReturnKeyAutomatically
          />
        </View>
        <View
          style={[
            styles.buttonContainer,
            { marginRight: -BUTTON_PADDING },
          ]}
        >
          <PlatformTouchableOpacity
            onPress={this.onSendPress}
          >
            <Image
              source={require('../icons/send.png')}
            />
          </PlatformTouchableOpacity>
        </View>
      </View>
    );
  }
}

MessageInput.defaultProps = defaultProps;
MessageInput.propTypes = propTypes;

const BUTTON_PADDING = 8;
const BUTTON_WIDTH = 36 + (2 * BUTTON_PADDING);

const styles = StyleSheet.create({
  container: {
    flex: 0,
    flexDirection: 'row',
  },
  textInput: {
    fontSize: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  inputContainer: {
    flex: 1,
  },
  buttonContainer: {
    width: BUTTON_WIDTH,
    alignSelf: 'flex-end',
  },
});

module.exports = MessageInput;

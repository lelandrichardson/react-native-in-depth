import React, { PropTypes } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  LayoutAnimation,
  Image,
} from 'react-native';
import Avatar from './Avatar';
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

// Exercise:
// Make MessageInput animate using LayoutAnimation in two places:
// 1. When the send button becomes visible or hides
// 2. When the height of the input changes

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
    if (this.state.inputHeight !== inputHeight) {
      this.setState({ inputHeight });
    }
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
    const showSend = !!text;
    return (
      <View style={styles.container}>
        <View style={styles.avatarContainer}>
          <Avatar
            name={senderName}
            image={senderImage}
            onPress={onAvatarPress}
          />
        </View>
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
            { marginRight: showSend ? -BUTTON_PADDING : -BUTTON_WIDTH },
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

const OUTER_PADDING = 8;

const BUTTON_PADDING = 8;
const BUTTON_WIDTH = 36 + (2 * BUTTON_PADDING);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f7f7f7',
    flex: 0,
    borderTopWidth: 1,
    borderTopColor: '#dedede',
    flexDirection: 'row',
    padding: OUTER_PADDING,
  },
  avatarContainer: {
    marginRight: OUTER_PADDING,
  },
  textInput: {
    backgroundColor: '#ffffff',
    borderColor: '#dedede',
    borderWidth: 1,
    borderRadius: 3,
    fontSize: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  inputContainer: {
    flex: 1,
  },
  buttonContainer: {
    width: BUTTON_WIDTH,
    paddingHorizontal: BUTTON_PADDING,
    alignSelf: 'flex-end',
  },
});

module.exports = MessageInput;

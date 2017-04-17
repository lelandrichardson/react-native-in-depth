import React, { PropTypes } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Text,
} from 'react-native';
import theme from '../theme';

const propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any,
  onChange: PropTypes.func,
};

const defaultProps = {
  onChange: () => {},
};

class LabeledInput extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <View>
            <Text style={styles.label}>{this.props.label}</Text>
          </View>
          <TextInput
            style={styles.input}
            value={this.props.value}
            onChangeText={this.props.onChange}
          />
        </View>
      </View>
    );
  }
}

LabeledInput.defaultProps = defaultProps;
LabeledInput.propTypes = propTypes;

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    paddingHorizontal: theme.size.horizontalPadding,
    paddingVertical: theme.size.verticalPadding,
  },
  label: {
    ...theme.font.tiny,
    color: theme.color.lightText,
  },
  row: {
    borderBottomColor: '#dedede',
    borderBottomWidth: 1,
  },
  input: {
    ...theme.font.large,
    height: 40,
  },
});

module.exports = LabeledInput;

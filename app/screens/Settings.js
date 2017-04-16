import React, { PropTypes } from 'react';
import {
  Text,
  View,
  Button,
} from 'react-native';
import Navigator from 'native-navigation';
import { connect } from 'react-redux';
import ScrollScreen from '../components/ScrollScreen';
import Avatar from '../components/Avatar';
import LabeledInput from '../components/LabeledInput';
import SegmentedView from '../components/SegmentedView';
import gravatarUrl from '../utils/gravatarUrl';

const propTypes = {
  // provided by redux
  name: PropTypes.string,
  email: PropTypes.string,
  image: PropTypes.string,
  dispatch: PropTypes.func.isRequired,
};

function isDirty(a, b) {
  return a.name !== b.name || a.email !== b.email || a.image !== b.image;
}

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name,
      email: props.email,
      image: props.image,
      index: 0,
    };
    this.save = this.save.bind(this);
    this.clear = this.clear.bind(this);
  }
  save() {
    const { name, email, image } = this.state;
    this.props.dispatch({
      type: 'USER_CHANGED',
      payload: {
        name,
        email,
        image,
      },
    });
  }
  clear() {
    const { name, email, image } = this.props;
    this.setState({ name, email, image });
  }
  render() {
    const dirty = isDirty(this.props, this.state);
    return (
      <ScrollScreen
        title="Settings"
        leftImage={require('../icons/close.png')}
        onLeftPress={() => Navigator.dismiss()}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
          <View style={{ alignItems: 'center', paddingVertical: 20 }}>
            <Text>Current:</Text>
            <Avatar
              name={this.props.name}
              image={this.props.image}
            />
          </View>
          <View style={{ alignItems: 'center', paddingVertical: 20 }}>
            <Text>Updated:</Text>
            <Avatar
              name={this.state.name}
              image={this.state.image}
            />
          </View>
        </View>
        <LabeledInput
          label="Name"
          value={this.state.name}
          onChange={name => this.setState({ name })}
        />
        <SegmentedView
          titles={['Gravatar', 'URL']}
          index={this.state.index}
          stretch
          onPress={index => this.setState({ index })}
        />
        {this.state.index === 0 && (
          <LabeledInput
            label="Email (for gravatar image)"
            value={this.state.email}
            onChange={email => this.setState({ email, image: gravatarUrl(email, 36) })}
          />
        )}
        {this.state.index === 1 && (
          <LabeledInput
            label="Image"
            value={this.state.image}
            onChange={image => this.setState({ image })}
          />
        )}
        {dirty && (
          <View>
            <Button
              title="Save"
              onPress={this.save}
            />
            <Button
              title="Clear"
              onPress={this.clear}
            />
          </View>
        )}
      </ScrollScreen>
    );
  }
}

Settings.propTypes = propTypes;

module.exports = connect(
  state => state.user,
  dispatch => ({ dispatch }),
)(Settings);

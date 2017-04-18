import React, { PropTypes } from 'react';
import {
  View,
  Button,
} from 'react-native';
import Navigator from 'native-navigation';
import { compose, gql, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import ScrollScreen from '../components/ScrollScreen';
import LabeledInput from '../components/LabeledInput';
import { ROOM } from '../routes';
import { createRoomMutation } from '../queries';

function isValidName(name) {
  return !!name && name.length > 4;
}

const propTypes = {
  createRoom: PropTypes.func.isRequired,
};

class AddRoom extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
    };
    this.save = this.save.bind(this);
  }
  save() {
    const { name } = this.state;
    const variables = { name };
    this.setState({ name: '' });
    this.props.createRoom({ variables })
      .then(r => r.data.createRoom.id)
      .then(id => {
        Navigator.dismiss();
        // super crappy hack that we need to fix in native navigation
        setTimeout(() => Navigator.push(ROOM, { id, title: name }), 800);
      })
      .catch(err => console.error(err));
  }
  render() {
    return (
      <ScrollScreen
        title="New Room"
        leftImage={require('../icons/close.png')}
        onLeftPress={() => Navigator.dismiss()}
      >
        <LabeledInput
          label="Room Name"
          value={this.state.name}
          onChange={name => this.setState({ name })}
        />
        {isValidName(this.state.name) && (
          <View>
            <Button
              title="Save"
              onPress={this.save}
            />
          </View>
        )}
      </ScrollScreen>
    );
  }
}

AddRoom.propTypes = propTypes;

module.exports = compose(
  connect(state => state.user, dispatch => ({ dispatch })),
  graphql(createRoomMutation, { name: 'createRoom' }),
)(AddRoom);

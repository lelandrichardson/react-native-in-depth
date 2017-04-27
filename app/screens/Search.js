import React, { PropTypes } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TextInput,
} from 'react-native';
import Navigator from 'native-navigation';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';
import Screen from '../components/Screen';
import UserRow from '../components/UserRow';
import now from '../utils/performanceNow';
import sleep from '../utils/sleep';
import users from '../utils/users';

const contains = prefix => user => user.name.toLowerCase().indexOf(prefix.toLowerCase()) !== -1;
const calculateFps = times => Math.round(1000 / (times.reduce((a, b) => a + b) / times.length));

const propTypes = {
};


// EXERCISE:
// This example has a screen that renders 500 users to the page, and provides
// a UI to search for the user by name. The `User` component has been made to
// emulate a much more expensive component by adding in a `sleep(3)` into the
// render function. The App is also updating very rapidly to display a
// framerate counter. Without removing the `sleep(3)` call or the framerate
// counter, try to tweak and refactor the app to be more performant, providing
// as close to a consistent 60fps as possible.

// HINT: what components are rendering, and how often? Do they need to?
// HINT: use Stacktrace to understand what is happening, and how to improve it.

// EXERCISE:
// Even if you get this screen into a state where updates are quick, initial
// render is likely still slow. Consider using `FlatList` or `Incremental`
// in order to incrementally render the rows, yielding to the JS event loop
// more often. Try to get it to the point where loading this screen feels snappy,
// even without removing the `sleep(3)` in the `UserRow` component.

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: now(),
      times: [16.66],
      filter: '',
      users,
    };
    this.updateTime = this.updateTime.bind(this);
  }
  updateTime() {
    const { time, times } = this.state;
    const newTime = now();

    const diff = newTime - time;
    if (times.length > 60) {
      times.shift();
    }
    times.push(diff);
    this.setState({
      time: newTime,
      times,
    }, () => {
      this.raf = requestAnimationFrame(this.updateTime);
    });
  }
  componentDidMount() {
    this.updateTime();
  }
  componentWillUnmount() {
    cancelAnimationFrame(this.raf);
  }
  render() {
    const { filter, time, times } = this.state;
    const fps = calculateFps(times);
    return (
      <Screen
        title="Search"
        leftImage={require('../icons/close.png')}
        onLeftPress={() => Navigator.dismiss()}
      >
        <View style={StyleSheet.absoluteFill}>
          <ScrollView removeClippedSubviews>
            <Navigator.Spacer />
            {this.state.users.filter(contains(filter)).map((user, i) => (
              <UserRow
                key={i}
                name={user.name}
                image={user.picture}
              />
            ))}
          </ScrollView>
          <View style={styles.container}>
            <TextInput
              style={styles.textInput}
              value={this.state.filter}
              onChangeText={filter => this.setState({ filter })}
              placeholder="Filter..."
              underlineColorAndroid="transparent"
            />
            <View style={styles.markContainer}>
              <Text style={styles.label}>t</Text>
              <Text style={styles.mark}>
                {`${Math.round(now())}`.slice(5)}
              </Text>
            </View>
            <View style={styles.markContainer}>
              <Text style={styles.label}>FPS</Text>
              <Text style={styles.mark}>
                {calculateFps(times)}
              </Text>
            </View>
          </View>
        </View>
      </Screen>
    );
  }
}

Search.propTypes = propTypes;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f7f7f7',
    flex: 0,
    borderTopWidth: 1,
    borderTopColor: '#dedede',
    flexDirection: 'row',
    padding: 8,
  },
  textInput: {
    backgroundColor: '#ffffff',
    borderColor: '#dedede',
    borderWidth: 1,
    borderRadius: 3,
    fontSize: 16,
    paddingHorizontal: 8,
    paddingVertical: 4,
    height: 36,
    flex: 1,
  },
  markContainer: {
    paddingHorizontal: 8,
    alignItems: 'flex-end',
    justifyContent: 'center',
    height: 36,
  },
  label: {
    lineHeight: 18,
    fontSize: 12,
    fontFamily: 'Courier',
    color: '#888',
  },
  mark: {
    lineHeight: 18,
    fontFamily: 'Courier',
  },
});

module.exports = compose(
  connect(
    (state) => ({ user: state.user }),
    (dispatch) => ({ logView: () => dispatch({ type: 'id' }) }),
  ),
)(Search);

import React, { PropTypes } from 'react';
import { Text } from 'react-native';
import timeAgo from '../utils/timeAgo';

const propTypes = {
  date: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]).isRequired,
};

const subscribers = [];

const LOOP_TIME = 1000; // once / second

function loop() {
  subscribers.forEach(sub => sub.updateText());
  setTimeout(loop, LOOP_TIME);
}

loop();

class LiveDate extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      text: timeAgo(new Date(props.date)),
    };
  }
  updateText() {
    const text = timeAgo(new Date(this.props.date));
    if (text !== this.state.text) {
      this.setState({ text });
    }
  }
  componentDidMount() {
    subscribers.push(this);
  }
  componentWillUnmount() {
    const index = subscribers.indexOf(this);
    if (index !== -1) {
      subscribers.splice(index, 1);
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.date !== this.props.date) {
      this.updateText();
    }
  }
  render() {
    return (
      <Text {...this.props}>
        {this.state.text}
      </Text>
    );
  }
}

LiveDate.propTypes = propTypes;

export default LiveDate;

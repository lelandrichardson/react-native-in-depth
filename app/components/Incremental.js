import React, { PropTypes } from 'react';
import { View } from 'react-native';

const propTypes = {
  initial: PropTypes.number,
  increment: PropTypes.number,
  children: PropTypes.node,
};

const defaultProps = {
  initial: 10,
  increment: 10,
};

class Incremental extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rendered: props.initial,
    };
    this.increment = this.increment.bind(this);
    this.raf = null;
  }
  increment() {
    if (this.state.rendered < this.state.length) {
      this.setState({
        rendered: this.state.rendered + this.props.increment,
      });
    }
  }
  componentDidMount() {
    this.raf = requestAnimationFrame(this.increment);
  }
  componentDidUpdate() {
    this.raf = requestAnimationFrame(this.increment);
  }
  componentWillUnmount() {
    cancelAnimationFrame(this.raf);
  }
  render() {
    const { children } = this.props;
    const { rendered } = this.state;
    return (
      <View>
        {React.Children.map(children, (child, i) => {
          if (i > rendered) return null;
          return child;
        })}
      </View>
    );
  }
}

Incremental.propTypes = propTypes;
Incremental.defaultProps = defaultProps;

module.exports = Incremental;

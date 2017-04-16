import React, { PropTypes } from 'react';
import Navigator from 'native-navigation';

const propTypes = {
  title: PropTypes.string,
  children: PropTypes.node,
  onPress: PropTypes.func,
};

const defaultProps = {
};

class Screen extends React.Component {
  render() {
    const {
      children,
      title,
    } = this.props;

    return (
      <Navigator.Config
        title={title}
        backgroundColor="#f7f7f7"
        elevation={4}
        {...this.props}
      >
        {children}
      </Navigator.Config>
    );
  }
}

Screen.defaultProps = defaultProps;
Screen.propTypes = propTypes;

export default Screen;

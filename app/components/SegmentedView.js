import React, { PropTypes } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
import PlatformTouchableHighlight from './PlatformTouchableHighlight';

const propTypes = {
  style: View.propTypes.style,
  duration: PropTypes.number,
  onTransitionStart: PropTypes.func,
  onTransitionEnd: PropTypes.func,
  onPress: PropTypes.func,
  renderTitle: PropTypes.func,
  titles: PropTypes.array,
  index: PropTypes.number,
  barColor: PropTypes.string,
  barPosition: PropTypes.string,
  underlayColor: PropTypes.string,
  stretch: PropTypes.bool,
  selectedTitleStyle: PropTypes.object,
  titleStyle: PropTypes.object,
};

const defaultProps = {
  duration: 200,
  onTransitionStart: () => {},
  onTransitionEnd: () => {},
  onPress: () => {},
  renderTitle: null,
  index: 0,
  barColor: '#44B7E1',
  barPosition: 'top',
  underlayColor: '#CCCCCC',
  stretch: false,
  selectedTextStyle: null,
  textStyle: null,
};

const BAR_SIZE = 40; // default bar size (at scale 1)

class SegmentedView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      barLeft: 0,
      barScale: 1,
    };
    this.moveTo = this.moveTo.bind(this);
    this.onLayout = this.onLayout.bind(this);
    this.storage = [];
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.index !== this.props.index) {
      this.moveTo(nextProps.index);
    }
  }
  onLayout(e, i) {
    const { width, x } = e.nativeEvent.layout;
    this.storage[i] = { width, x };
    if (this.props.index === i) {
      this.moveTo(i);
    }
  }
  moveTo(index) {
    if (!this.storage[index]) return;

    const { width, x } = this.storage[index];
    const centerX = x + (width / 2);
    const scaleX = width / BAR_SIZE;

    if (isNaN(centerX) || isNaN(scaleX)) {
      console.log('measure handler got null!');
      return;
    }

    // Exercise:
    // Make the highlight bar of the SegmentedView animate from its current position to its
    // next position, rather than the instantaneous change it does now.

    this.setState({
      barLeft: centerX,
      barScale: scaleX,
    });
  }
  defaultRenderTitle(title, i) {
    const { index, titleStyle, selectedTitleStyle } = this.props;
    return (
      <View style={styles.title}>
        <Text style={[titleStyle, i === index && selectedTitleStyle]}>
          {title}
        </Text>
      </View>
    );
  }
  renderTitle(title, i) {
    const { stretch, renderTitle, onPress, underlayColor } = this.props;
    return (
      <View
        key={i}
        onLayout={(e) => this.onLayout(e, i)}
        style={{ flex: stretch ? 1 : 0 }}
      >
        <PlatformTouchableHighlight
          color={underlayColor}
          onPress={() => onPress(i)}
        >
          {renderTitle ? renderTitle(title, i) : this.defaultRenderTitle(title, i)}
        </PlatformTouchableHighlight>
      </View>
    );
  }

  render() {
    const items = [];
    const { stretch, style, titles, barColor, barPosition } = this.props;
    const { barLeft, barScale } = this.state;

    if (!stretch) {
      items.push(<View key="s" style={styles.spacer} />);
    }

    for (let i = 0; i < titles.length; i += 1) {
      items.push(this.renderTitle(titles[i], i));
      if (!stretch) {
        items.push(<View key={`s${i}`} style={styles.spacer} />);
      }
    }
    const barContainer = (
      <View style={styles.barContainer}>
        <View
          style={[styles.bar, {
            transform: [
              { translateX: barLeft },
              { scaleX: barScale },
            ],
            backgroundColor: barColor,
          }]}
        />
      </View>
    );
    return (
      <View style={style}>
        {barPosition === 'top' && barContainer}
        <View style={styles.titleContainer}>
          {items}
        </View>
        {barPosition === 'bottom' && barContainer}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
  },
  title: {
    alignItems: 'center',
    paddingHorizontal: 2,
    paddingVertical: 10,
  },
  spacer: {
    flex: 1,
  },
  barContainer: {
    height: 4,
    position: 'relative',
  },
  bar: {
    marginLeft: -BAR_SIZE / 2,
    width: BAR_SIZE,
    backgroundColor: 'blue',
    position: 'absolute',
    height: 4,
  },
});

SegmentedView.propTypes = propTypes;
SegmentedView.defaultProps = defaultProps;

module.exports = SegmentedView;

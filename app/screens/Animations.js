import React, { PropTypes } from 'react';
import {
  View,
  Animated,
  LayoutAnimation,
  StyleSheet,
  TouchableWithoutFeedback,
  Easing,
  PanResponder,
} from 'react-native';
import Navigator from 'native-navigation';
import ScrollScreen from '../components/ScrollScreen';
import Screen from '../components/Screen';
import PillButton from '../components/PillButton';

const { sequence, parallel, add, multiply, spring, timing, Value } = Animated;

const range = (start, end) => Array.from({ length: end - start }).map((_, i) => start + i);

function Box({ color, size, top, left, transform, opacity, onPress }) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <Animated.View
        style={{
          position: 'absolute',
          backgroundColor: color,
          width: size,
          height: size,
          top,
          left,
          transform,
          opacity,
        }}
      />
    </TouchableWithoutFeedback>
  );
}

class Draggable extends React.Component {
  constructor(props) {
    super(props);
    const { x, y } = this.props;
    this.responder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event(
        [null, { dx: x, dy: y }]
      ),
      onPanResponderRelease: () => {
        y.extractOffset();
        x.extractOffset();
      },
      onPanResponderTerminate: () => {
        y.extractOffset();
        x.extractOffset();
      },
    });
  }
  render() {
    const { color, size, top, left, opacity, x, y, transform=[] } = this.props;
    return (
      <Animated.View
        {...this.responder.panHandlers}
        style={{
          position: 'absolute',
          backgroundColor: color,
          width: size,
          height: size,
          top,
          left,
          transform: [
            { translateX: x },
            { translateY: y },
            ...transform,
          ],
          opacity,
        }}
      />
    );
  }
}

// Toggle this to enable/disable scrolling
const SCROLLING = false;

class Animations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scroll: new Value(0),
      x: new Value(0),
      y: new Value(0),
      red: new Value(0),
      blue: new Value(0),
      green: new Value(0),
    };
  }
  pressA() {
    spring(this.state.y, { toValue: Math.random() * 300 }).start();
  }
  pressB() {
    spring(this.state.blue, { toValue: Math.random() * 300 }).start();
    // spring(this.state.blue, { toValue: this.state.red }).start();
  }
  pressC() {
    // parallel([
    //   spring(this.state.red, { toValue: Math.random() * 300 }),
    //   // spring(this.state.blue, { toValue: this.state.red }),
    // ]).start();
    spring(this.state.red, { toValue: this.state.blue, bounciness: 0 }).start();
    spring(this.state.blue, { toValue: this.state.green, bounciness: 0 }).start();
    spring(this.state.green, { toValue: this.state.y, bounciness: 0 }).start();
  }
  render() {
    const {
      scroll,
      x,
      y,
      red,
      blue,
      green,
    } = this.state;

    const content = (
      <View style={{ flex: 1 }}>
        <Box
          size={50}
          color="red"
          transform={[
            { translateY: red },
          ]}
          onPress={() => spring(red, { toValue: Math.random() * 600 }).start()}
        />
        <Box
          size={50}
          left={50}
          color="blue"
          transform={[
            { translateY: blue },
          ]}
        />
        <Box
          size={50}
          left={100}
          color="green"
          transform={[
            { translateY: green },
            {
              rotate: green.interpolate({
                inputRange: [0, 300],
                outputRange: ['0deg', '360deg'],
              }),
            },
          ]}
        />
        <Draggable
          size={50}
          left={150}
          color="orange"
          x={x}
          y={y}
          transform={[
            {
              scale: y.interpolate({
                inputRange: [0, 300, 600],
                outputRange: [1, 1.5, 1],
              }),
            },
            {
              rotate: y.interpolate({
                inputRange: [0, 300],
                outputRange: ['0deg', '360deg'],
              }),
            },
          ]}
        />
      </View>
    );

    const buttons = (
      <View style={styles.buttons}>
        <PillButton title="A" onPress={() => this.pressA()} />
        <PillButton title="B" onPress={() => this.pressB()} />
        <PillButton title="C" onPress={() => this.pressC()} />
      </View>
    );

    return (
      <Screen title="Animations">
        <View style={StyleSheet.absoluteFill}>
          {SCROLLING ? (
            <Animated.ScrollView
              scrollEventThrottle={1}
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { y: scroll } } }],
                { useNativeDriver: true }
              )}
            >
              <Navigator.Spacer />
              {content}
            </Animated.ScrollView>
          ) : (
            <View style={StyleSheet.absoluteFill}>
              <Navigator.Spacer />
              {content}
            </View>
          )}
          {buttons}
        </View>
      </Screen>
    );
  }
}

const styles = StyleSheet.create({
  box: {

  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
});

module.exports = Animations;

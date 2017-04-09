let performanceNow = () => Date.now();

// React Native provides some native-clock-driven performance.now functions that are
// provided on the global with `nativePerformanceNow`
if (global.nativePerformanceNow) {
  performanceNow = () => global.nativePerformanceNow();
} else if (global.performance && global.performance.now) {
  performanceNow = () => global.performance.now();
}

module.exports = performanceNow;

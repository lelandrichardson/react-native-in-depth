
/* eslint no-restricted-syntax:0 */
const hasOwnProperty = Object.prototype.hasOwnProperty;

function shallowDifferences(a, b) {
  const result = [];
  if (a === b) {
    return result;
  }

  for (const key in a) {
    if (hasOwnProperty.call(a, key) && a[key] !== b[key]) {
      result.push(key);
    }
  }

  for (const key in b) {
    if (hasOwnProperty.call(b, key) && !hasOwnProperty.call(a, key)) {
      result.push(key);
    }
  }

  return result;
}

function compareAndLogIfDifferent(a, b) {
  const keys = shallowDifferences(a, b);
  if (keys.length > 0) {
    console.group('%cFunction expected to be pure was not!', 'color: red;');
    console.log('{key}, {first result}, {second result}');
    keys.forEach(key => console.log(key, a[key], b[key]));
    console.groupEnd();
  }
}

function ensureShallowPurity(fn) {
  return function wrappedFunction() {
    // eslint-disable-next-line prefer-rest-params
    const result = fn.apply(this, arguments);
    // eslint-disable-next-line prefer-rest-params
    const testResult = fn.apply(this, arguments);
    compareAndLogIfDifferent(result, testResult);
    return result;
  };
}

module.exports = ensureShallowPurity;

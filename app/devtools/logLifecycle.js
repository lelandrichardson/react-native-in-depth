import performanceNow from '../utils/performanceNow';

function logProtoMethod(proto, name, cname, all, color) {
  const original = proto[name];
  if (original) {
    // eslint-disable-next-line no-param-reassign
    proto[name] = function logger() {
      const start = performanceNow();
      // eslint-disable-next-line prefer-rest-params
      const result = original.apply(this, arguments);
      const time = performanceNow() - start;
      const roundedTime = Math.round(time * 10) / 10;
      if (color !== null) {
        console.log(`%c${cname}:${name} (${roundedTime}ms)`, `color: ${color};`);
      } else {
        console.log(`${cname}:${name} (${roundedTime}ms)`);
      }

      return result;
    };
  } else if (all) {
    // eslint-disable-next-line no-param-reassign
    proto[name] = () => console.log(`${cname}:${name}`);
  }
}

function logLifecycle(Component, all = false, color = null) {
  const name = Component.displayName || Component.name;
  const proto = Component.prototype;
  logProtoMethod(proto, 'componentWillMount', name, all, color);
  logProtoMethod(proto, 'componentDidMount', name, all, color);
  logProtoMethod(proto, 'componentWillUnmount', name, all, color);

  logProtoMethod(proto, 'componentWillReceiveProps', name, all, color);
  logProtoMethod(proto, 'render', name, all, color);

  logProtoMethod(proto, 'componentWillUpdate', name, all, color);
  logProtoMethod(proto, 'componentDidUpdate', name, all, color);

  // only ever log this if it's implemented
  logProtoMethod(proto, 'shouldComponentUpdate', name, false, color);
}

module.exports = logLifecycle;

// This function wraps another function and returns a new function that will execute the wrapped
// function, but ensure that the function is not executed again until a passed in `done` callback
// is invoked. This is useful for async actions that we want to make sure we don't have
// multiple versions of in flight at any given time.
function oneAtATime(fn) {
  let running = false;
  const done = () => { running = false; };
  return () => {
    if (running) return;
    running = true;
    fn(done);
  };
}
module.exports = oneAtATime;

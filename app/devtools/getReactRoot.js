function getReactRoot() {
  // we can't cache a reference to this in a higher scope, because this isn't set initially
  // eslint-disable-next-line no-underscore-dangle
  const plugin = global.__REACT_DEVTOOLS_GLOBAL_HOOK__;
  const agent = plugin.reactDevtoolsAgent;
  const roots = Array.from(agent.roots); // roots is a set
  if (roots.length === 0) {
    return null;
  }
  const rootId = roots[roots.length - 1];
  const root = agent.reactElements.get(rootId);
  return root;
}

module.exports = getReactRoot;

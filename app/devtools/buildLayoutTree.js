/* eslint-disable no-underscore-dangle, no-param-reassign, no-restricted-syntax */
import { UIManager, findNodeHandle } from 'react-native';

const name = fn => fn.displayName || fn.name || 'UnknownComponent';
const nodeName = (component) => name(component._currentElement.type);
const isHost = component => !!component._renderedChildren;
const isText = component => typeof component._stringText === 'string';
const { hasOwnProperty } = Object.prototype;

// This makes a node with all of the layout and react information we need
function makeLayoutNode(component, parent) {
  const text = isText(component);
  return {
    parent,
    component,
    name: text ? '"' : nodeName(component),
    index: -1,
    isHost: isHost(component),
    isText: text,
    detached: false,
    resolved: false,
    x: -1,
    y: -1,
    width: -1,
    height: -1,
    children: null,
  };
}

function buildLayoutTreeOfRoot(component) {
  const promises = [];
  const root = makeLayoutNode(component, null);
  // this call will build a tree of all react views and their current layout, but it's async,
  // so we stuff all of the promises into an array and use Promise.all to make sure we have
  // all the info that we need.
  buildLayoutTree(component, root, promises);
  return Promise.all(promises).then(() => root);
}

function buildLayoutTree(component, node, promises) {
  if (!component) return;
  if (isText(component)) return;

  if (component._instance) {
    UIManager.measureInWindow(
      findNodeHandle(component._instance),
      measureHandler(node, promises)
    );
  }

  if (component._renderedChildren) {
    if (node && node.parent && node.parent.component && node.parent.component._instance) {
      // host nodes don't have an instance to measure (or at least i don't know how to find it),
      // so we just measure their parent and use those values instead
      UIManager.measureInWindow(
        findNodeHandle(node.parent.component._instance),
        measureHandler(node, promises)
      );
    }
    const children = component._renderedChildren;
    node.children = [];
    for (const key in children) {
      if (hasOwnProperty.call(children, key)) {
        const child = children[key];
        const childNode = makeLayoutNode(child, node);
        childNode.index = node.children.length;
        node.children.push(childNode);
        buildLayoutTree(child, childNode, promises);
      }
    }
  } else if (component._renderedComponent) {
    let child = component._renderedComponent;
    while (child._currentElement === null && child._renderedComponent !== null) {
      child = child._renderedComponent;
    }
    const childNode = makeLayoutNode(child, node);
    node.children = childNode;
    buildLayoutTree(child, childNode, promises);
  }
}

function measureHandler(node, promises) {
  let resolve;
  promises.push(new Promise((r) => { resolve = r; }));
  return (x, y, width, height) => {
    node.x = x;
    node.y = y;
    node.width = width;
    node.height = height;
    node.resolved = true;
    node.detached = x === 0 && y === 0 && width === 0 && height === 0;
    resolve();
  };
}

module.exports = buildLayoutTreeOfRoot;

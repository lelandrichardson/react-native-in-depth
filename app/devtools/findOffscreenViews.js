/* eslint-disable no-underscore-dangle, no-param-reassign, no-restricted-syntax */
import { Dimensions } from 'react-native';
import buildLayoutTree from './buildLayoutTree';
import getReactRoot from './getReactRoot';

const WINDOW_HEIGHT = Dimensions.get('window').height;
const PROPS_CHAR_LIMIT = 30;
const COMPONENT_COLOR = 'color: #B2349C;';
const PROPS_COLOR = 'color: #A5672A;';
const WARNING_COLOR = 'color: red;';
const METADATA_COLOR = 'color: #aaa;';

const print = (n, s) => `${Array.from({ length: n + 1 }).join(' ')}${s}\n`;

function findOffscreenViews() {
  const root = getReactRoot();
  if (root === null) {
    console.log('No react views are currently rendered');
    return;
  }
  findOffscreenViewsOfRoot(root);
}

function findOffscreenViewsOfRoot(component) {
  // flag that allows us to check if we didn't find anything so we can tell user that
  const flag = { found: false };
  buildLayoutTree(component)
    .then((tree) => traverseTreeForOffscreenViews(tree, flag))
    .then(() => {
      if (!flag.found) {
        console.log('Couldn\'t find any views that were rendered offscreen');
      }
    });
}

function traverseTreeForOffscreenViews(node, flag) {
  if (node.children === null) {
    // continue
  } else if (Array.isArray(node.children)) {
    const offscreenChildren = node.children.filter(isOffscreen);
    // number of views (including subviews) offscreen
    const viewCount = node.children.reduce((sum, el) => {
      return isOffscreen(el) ? (sum + viewsInSubtree(el)) : sum;
    }, 0);

    if (offscreenChildren.length === node.children.length) {
      // all offscreen. don't traverse any further.
    } else {
      if (offscreenChildren.length > 0) {
        flag.found = true;
        prettyPrintNode(node, offscreenChildren, viewCount);
      }
      // only some children offscreen... we want to keep traversing to get more details into those
      // specific children
      node.children.forEach((el) => traverseTreeForOffscreenViews(el, flag));
    }
  } else {
    traverseTreeForOffscreenViews(node.children, flag);
  }
}

function isOffscreen(node) {
  if (node.resolved) {
    return !node.detached && (node.y > WINDOW_HEIGHT || (node.y + node.height) < 0);
  } else if (node.children !== null && !Array.isArray(node.children)) {
    return isOffscreen(node.children);
  }
  return false;
}

function viewsInSubtree(node) {
  const stack = [node];
  let n = 0;
  let el;
  while (stack.length !== 0) {
    el = stack.pop();
    if (el.resolved && !el.detached) {
      n += 1;
    }
    if (el.children === null) {
      // continue
    } else if (Array.isArray(el.children)) {
      stack.push(...el.children);
    } else {
      stack.push(el.children);
    }
  }
  return n;
}

function ancestorsOfNode(node) {
  const nodes = [];
  let el = node;
  while (el !== null) {
    if (el.name === 'WrappedScreen') {
      break; // manually stop here since this is top of hierarchy that we care about...
    }
    // skip over these because they are so common, and always have `View` and `Text` as parents
    if (el.name !== 'RCTView' && el.name !== 'RCTText' && el.name !== '"') {
      nodes.push(el);
    }
    el = el.parent;
  }
  return nodes.reverse();
}

function prettySource(source) {
  const lastSlashIndex = source.fileName.lastIndexOf('/');
  if (lastSlashIndex === -1) {
    return `${source.fileName}:${source.lineNumber}`;
  }
  const realFileName = source.fileName.slice(lastSlashIndex + 1);
  return `${realFileName}:${source.lineNumber}`;
}

function propString(key, prop) {
  switch (typeof prop) {
    case 'function':
      return `${key}=ƒ`;
    case 'string':
      return prop.length > 20 ? `${key}="..."` : `${key}="${prop}"`;
    case 'number':
      return `${key}=${prop}`;
    case 'boolean':
      return prop ? `${key}` : `${key}=false`;
    case 'object':
      return Array.isArray(prop) ? `${key}={[...]}` : `${key}={{...}}`;
    default:
      return `${key}={[${typeof prop}]}`;
  }
}

function propsString(props) {
  const keys = Object.keys(props);
  let result = '';
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    switch (key) {
      case 'children': break;
      case 'style': break;
      default: {
        const add = propString(key, props[key]);
        if (result.length + add.length > PROPS_CHAR_LIMIT) {
          result += ' ...';
          return result;
        }
        result += ` ${add}`;
      } break;
    }
  }
  return result;
}

function prettyPrintNode(node, offscreenChildren, offscreenViews) {
  const ancestors = ancestorsOfNode(node);
  const buffer = {
    text: '',
    styles: [],
  };
  console.groupCollapsed(
    `FOUND: %c${offscreenViews} %cattached offscreen views (from ${offscreenChildren.length} / ${node.children.length} children)`,
    'color: red;',
    'color: black;'
  );

  let index = 0;
  while (index < ancestors.length) {
    const parent = ancestors[index];
    const el = parent.component._currentElement;
    const source = el._source;
    const showIndex = parent.index !== -1 && parent.parent.children.length !== 1;
    const props = propsString(el.props);
    let post = '';
    if (showIndex) {
      post += ` (child ${parent.index} of ${parent.parent.children.length})`;
    }
    if (source && source.fileName) {
      post += ` (${prettySource(source)})`;
    }
    buffer.text += print(index, `%c<${parent.name}%c${props}%c>%c${post}`);
    buffer.styles.push(
      COMPONENT_COLOR,
      PROPS_COLOR,
      COMPONENT_COLOR,
      METADATA_COLOR
    );
    index += 1;
  }

  buffer.text += print(index, '%c<--');
  buffer.text += print(index + 3, `${offscreenChildren.length} / ${node.children.length} children here are offscreen.`);
  buffer.text += print(index + 3, `This currently amounts to ${offscreenViews} total native views`);
  buffer.text += print(index + 3, 'You should consider setting `removeClippedSubviews` to true on the ');
  buffer.text += print(index + 3, 'on the containing View in order to improve scroll performance.');
  buffer.text += print(index, '-->');
  buffer.styles.push(WARNING_COLOR);

  const children = node.children;

  for (let i = 0; i < children.length; i += 1) {
    const child = children[i];
    const el = child.component._currentElement;
    const source = el._source;
    let warning = '';
    if (isOffscreen(child)) {
      warning = ' (OFFSCREEN!)';
    }
    const props = propsString(el.props);
    let post = '';
    if (source && source.fileName) {
      post += ` (${prettySource(source)})`;
    }
    buffer.text += print(index, `%c<${child.name}%c${props} %c/>%c${warning}%c${post}`);
    buffer.styles.push(
      COMPONENT_COLOR,
      PROPS_COLOR,
      COMPONENT_COLOR,
      WARNING_COLOR,
      METADATA_COLOR
    );
  }

  while (index > 0) {
    index -= 1;
    const parent = ancestors[index];
    buffer.text += print(index, `%c</${parent.name}>`);
    buffer.styles.push(
      COMPONENT_COLOR
    );
  }

  console.log(buffer.text, ...buffer.styles);
  console.groupEnd();
}

module.exports = findOffscreenViews;

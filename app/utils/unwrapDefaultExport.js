export default function unwrapDefaultExport(module) {
  /* eslint no-underscore-dangle: 0 */
  if (module != null && module.__esModule === true) {
    return module.default;
  }
  return module;
}

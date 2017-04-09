/* eslint-disable global-require */
import unwrapDefaultExport from './utils/unwrapDefaultExport';

export default function storeThunk() {
  return unwrapDefaultExport(require('./store'));
}

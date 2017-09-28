import * as _ from 'lodash'
export { loadJSON, downloadJSON } from '../lib/js/io.js'

export const cloneObj = (obj) => {
  return _.cloneDeep(obj)
}

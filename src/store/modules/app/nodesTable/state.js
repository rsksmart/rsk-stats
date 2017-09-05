import { fields } from '../../../../config/table.js'
export default function () {
  return {
    fields: fields,
    sortOrders: {},
    pinned: {},
    sortKey: null,
    filterKey: '',
    options: {
      x: 0,
      y: 0
    }
  }
}

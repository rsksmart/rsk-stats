import { fields, hiddenFields } from '../../../../config/table.js'
export default function () {
  return {
    fields: fields,
    sortOrders: {},
    pinned: {},
    sortKey: null,
    filterKey: '',
    hiddenFields: hiddenFields,
    options: {
      x: 0,
      y: 0
    }
  }
}

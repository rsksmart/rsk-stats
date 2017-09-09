export const fields = (state, getters, rootState) => {
  return state.fields
}

export const hiddenFields = (state) => {
  return state.hiddenFields
}

export const isHiddenField = (state, getters) => field => {
  return getters.hiddenFields.findIndex((item, index) => {
    return (item === field)
  })
}

export const nodes = (state, getters, rootState, rootGetters) => {
  return rootGetters['app/entity/getNodesEntitiesArr']
}

export const rows = (state, getters) => {
  let data = getters.nodes
  let sortKey = state.sortKey
  let filterKey = state.filterKey && state.filterKey.toLowerCase()
  let order = state.sortOrders[sortKey] || 1
  let isPinned = getters.isPinned
  if (filterKey) {
    data = data.filter(function (row) {
      return Object.keys(row).some(function (key) {
        return String(row[key]).toLowerCase().indexOf(filterKey) > -1
      })
    })
  }
  if (sortKey) {
    data = data.slice().sort(function (a, b) {
      let pina = isPinned(a.id)
      let pinb = isPinned(b.id)
      a = a[sortKey]
      b = b[sortKey]
      if (pina === pinb) { // field order
        return (a === b ? 0 : a > b ? 1 : -1) * order
      } else { // pin order
        return (pina < pinb) ? 1 : -1
      }
    })
  }
  return data
}

export const isPinned = (state) => id => {
  return state.pinned[id] || false
}

export const sortKey = (state) => {
  return state.sortKey
}

export const sortOrders = (state) => {
  return state.sortOrders
}

export const options = (state) => {
  return state.options
}

export const initTable = ({ state, commit, getters }) => {
  let fields = getters.fields
  for (let field of fields) {
    if (undefined === state.sortOrders[field]) {
      commit('SORT_ORDERS', [field, -1])
    }
  }
  if (state.sortKey === null) commit('SORT_KEY', fields[0])
}

export const sortBy = ({ state, commit }, key) => {
  commit('SORT_KEY', key)
  let sort = state.sortOrders[key] * -1
  commit('SORT_ORDERS', [key, sort])
}

export const pinRow = ({ state, commit }, id) => {
  let pin = state.pinned[id]
  commit('PIN_ROW', [id, !pin])
}

export const updateFilterKey = ({ state, commit }, key) => {
  commit('FILTER_KEY', key)
}

export const updateOptions = ({ commit }, options) => {
  for (let op in options) {
    commit('UPDATE_OPTION', [op, options[op]])
  }
}

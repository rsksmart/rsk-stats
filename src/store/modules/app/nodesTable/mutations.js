import Vue from 'vue'

export const SORT_ORDERS = (state, payload) => {
  let key = payload[0]
  let value = payload[1]
  Vue.set(state.sortOrders, key, value)
}

export const SORT_KEY = (state, key) => {
  state.sortKey = key
}

export const PIN_ROW = (state, payload) => {
  state.pinned[payload[0]] = payload[1]
}

export const FILTER_KEY = (state, key) => {
  state.filterKey = key
}

export const UPDATE_OPTION = (state, payload) => {
  Vue.set(state.options, payload[0], payload[1])
}

export const HIDE_FIELD = (state, field) => {
  state.hiddenFields.push(field)
}

export const SHOW_FIELD = (state, index) => {
  Vue.delete(state.hiddenFields, index)
}

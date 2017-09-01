import Vue from 'vue'

export const SELECT_ITEM = (state, payload) => {
  Vue.set(state.selection[payload.type], payload.item.id, payload.item)
}
export const UNSELECT_ITEM = (state, payload) => {
  if (state.selection[payload.type][payload.id]) {
    let selection = Object.assign({}, state.selection[payload.type])
    delete (selection[payload.id])
    state.selection[payload.type] = selection
  }
}

export const EMPTY_SELECTION = (state, type) => {
  Vue.set(state.selection, type, {})
}

export const UPDATE_SELECTION_PROP = (state, payload) => {
  let type = payload[0]
  let id = payload[1]
  let prop = payload[2]
  let value = payload[3]
  if (state.selection[type][id]) {
    Vue.set(state.selection[type][id], prop, value)
  }
}

export const ADD_DIALOG = (state, payload) => {
  let type = payload[0]
  let data = payload[1]
  data._type = type
  let index = state.openDialogs.push(data)
  index--
  state.openDialogs[index]._index = index
}

export const REMOVE_DIALOG = (state, index) => {
  state.openDialogs.splice(index, 1)
}
export const UPDATE_DIALOG = (state, payload) => {
  state.openDialogs[payload.index] = payload.value
}

export const SET_SHOW_TABLE = (state, show) => {
  state.showTable = show
}

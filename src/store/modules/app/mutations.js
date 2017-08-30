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

export const ADD_NODE_DIALOG = (state, node) => {
  let index = state.nodeDialogs.push({
    id: node.id,
    x: node.x,
    y: node.y,
    name: node.info.name,
    w: 0,
    h: 0
  })
  if (state.selection.nodes[node.id]) {
    state.selection.nodes[node.id]._dialog = index
  }
}

export const REMOVE_NODE_DIALOG = (state, index) => {
  state.nodeDialogs.splice(index, 1)
}
export const UPDATE_NODE_DIALOG = (state, payload) => {
  state.nodeDialogs[payload.index] = payload.value
}

export const SET_MAXIMIZED_CHART = (state, payload) => {
  state.maximizedChart = payload
}

export const SET_SHOW_TABLE = (state, show) => {
  state.showTable = show
}

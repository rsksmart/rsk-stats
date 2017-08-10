import Vue from 'vue'

export const SOCKET_CONNECTION = (state, connection) => {
  state.socketConnected = (connection)
}

// catch socket emit
export const SOCKET_EMIT = (payload) => { }

export const SET_SIZE = (state, size) => {
  Vue.set(state.app.size, 'w', size.w)
  Vue.set(state.app.size, 'h', size.h)
}

export const SELECT_ITEM = (state, payload) => {
  Vue.set(state.app.selection[payload.type], payload.item.id, payload.item)
}
export const UNSELECT_ITEM = (state, payload) => {
  if (state.app.selection[payload.type][payload.id]) {
    let selection = Object.assign({}, state.app.selection[payload.type])
    delete (selection[payload.id])
    state.app.selection[payload.type] = selection
  }
}

export const EMPTY_SELECTION = (state, type) => {
  Vue.set(state.app.selection, type, {})
}

export const UPDATE_SELECTION_PROP = (state, payload) => {
  let type = payload[0]
  let id = payload[1]
  let prop = payload[2]
  let value = payload[3]
  if (state.app.selection[type][id]) {
    Vue.set(state.app.selection[type][id], prop, value)
  }
}

export const ADD_NODE_DIALOG = (state, node) => {
  let index = state.app.nodeDialogs.push({
    id: node.id,
    node: node,
    x: 0,
    y: 0,
    w: 0,
    h: 0
  })
  if (state.app.selection.nodes[node.id]) {
    state.app.selection.nodes[node.id]._dialog = index
  }
}

export const REMOVE_NODE_DIALOG = (state, index) => {
  state.app.nodeDialogs.splice(index, 1)
}
export const UPDATE_NODE_DIALOG = (state, payload) => {
  state.app.nodeDialogs[payload.index] = payload.value
}


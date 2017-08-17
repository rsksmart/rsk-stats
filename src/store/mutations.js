import Vue from 'vue'

export const SOCKET_CONNECTION = (state, connection) => {
  state.socketConnected = (connection)
}

export const SET_SIZE = (state, size) => {
  Vue.set(state.size, 'w', size.w)
  Vue.set(state.size, 'h', size.h)
}

export const SAVE_SNAPSHOT = (state, snapshot) => {
  Vue.set(state.snapshots, Date.now(), snapshot)
}
export const REMOVE_SNAPSHOT = (state, id) => {
  Vue.delete(state.snapshots, id)
}
export const ACTIVE_SNAPSHOT = (state, snapshot) => {
  state.activeSnapshot = snapshot
}

export const REPLACE_STATE = (state, payload) => {
  state[payload[0]] = payload[1]
}

export const SET_BACKEND_DATA = (state, payload) => {
  state.backendData = payload.backend
}

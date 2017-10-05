import Vue from 'vue'

export const SOCKET_CONNECTION = (state, connection) => {
  state.socketConnected = (connection)
}

export const SET_SIZE = (state, size) => {
  Vue.set(state.size, 'w', size.w)
  Vue.set(state.size, 'h', size.h)
}

export const SET_COL = (state, payload) => {
  let name = payload[0]
  let col = payload[1]
  for (let p in col) {
    Vue.set(state.cols[name], p, col[p])
  }
}

export const SET_DATE_INTERVAL = (state, interval) => {
  state.dateInterval = interval
}

export const SET_DATE = (state) => {
  state.date = Date.now()
}

export const SAVE_SNAPSHOT = (state, snapshot) => {
  let date = Date.now()
  date = snapshot.date || date
  snapshot.date = date
  if (!snapshot.name) snapshot.name = date
  if (!state.snapshots[date]) Vue.set(state.snapshots, date, snapshot)
}

export const REMOVE_SNAPSHOT = (state, id) => {
  Vue.delete(state.snapshots, id)
}

export const ACTIVE_SNAPSHOT = (state, snapshot) => {
  state.activeSnapshot = snapshot
}

export const SET_SNAPSHOTS = (state, snapshots) => {
  state.snapshots = snapshots
}

export const REPLACE_STATE = (state, payload) => {
  state[payload[0]] = payload[1]
}

export const SET_BACKEND_DATA = (state, payload) => {
  state.backendData = payload.backend
}

export const SET_APP_PREVSTATE = (state, prevState) => {
  state.appPrevState = prevState
}

export const IMPORT_NAME = (state, name) => {
  Vue.set(state.snapshotImport, 'name', name)
}

export const IMPORT_ERROR = (state, error) => {
  Vue.set(state.snapshotImport, 'error', error)
}

export const SET_CONFIG = (state, config) => {
  state.config = config
}

export const SET_CONFIG_GROUP = (state, payload) => {
  let group = payload[0]
  let config = payload[1]
  for (let c in config) {
    Vue.set(state.config[group], c, config[c])
  }
}

import { cloneObj, downloadJSON } from './utils.js'

export const connectionUpdate = ({ commit }, connected) => {
  commit('SOCKET_CONNECTION', (connected === true))
}

export const init = ({ dispatch }, data) => {
  dispatch('setDateInterval')
  dispatch('initData', data)
  dispatch('app/entity/renderEntities')
}

export const setSize = ({ commit }, size) => {
  commit('SET_SIZE', size)
}

export const initData = ({ state, commit }, data) => {
  commit('SET_BACKEND_DATA', state)
  if (data) {
    for (let d in data) {
      if (data[d]) commit('REPLACE_STATE', [d, data[d]])
    }
  }
}

export const setDateInterval = ({ state, commit }) => {
  // update date every second
  if (!state.dateInterval) {
    let interval = setInterval(() => {
      commit('SET_DATE')
    }, 1000)
    commit('SET_DATE_INTERVAL', interval)
  }
}

export const takeSnapshot = ({ state, commit }, name) => {
  let snapshot = {
    name: name,
    data: {
      backend: cloneObj(state.backendData),
      app: cloneObj(state.app)
    }
  }
  commit('SAVE_SNAPSHOT', snapshot)
}

export const removeSnapshot = ({ state, commit }, id) => {
  if (state.snapshots[id]) {
    commit('REMOVE_SNAPSHOT', id)
  }
}
export const loadSnapshot = ({ state, commit, getters }, id) => {
  let snapshot = cloneSnapshot(state, id)
  if (snapshot) {
    // save app state
    if (getters.isLive) commit('SET_APP_PREVSTATE', cloneObj(state.app))
    commit('ACTIVE_SNAPSHOT', snapshot)
    snapshot = state.activeSnapshot
    commit('REPLACE_STATE', ['app', snapshot.data['app']])
    commit('SET_BACKEND_DATA', snapshot.data)
  }
}

export const loadLayout = ({ state, commit }, id) => {
  let snapshot = cloneSnapshot(state, id)
  if (snapshot) {
    commit('REPLACE_STATE', ['app', snapshot.data['app']])
  }
}

export const loadPrevState = ({ state, commit }) => {
  if (state.appPrevState) {
    let appPrevState = cloneObj(state.appPrevState)
    commit('SET_APP_PREVSTATE', null)
    commit('REPLACE_STATE', ['app', appPrevState])
  }
}

export const goLive = ({ state, dispatch, commit }) => {
  commit('ACTIVE_SNAPSHOT', null)
  dispatch('initData')
    .then(dispatch('loadPrevState'))
}

export const downloadSnapshot = ({ state }, id) => {
  let snapshot = cloneSnapshot(state, id)
  if (snapshot) {
    let name = snapshot.name || 'snapshot'
    name += '--' + snapshot.date
    downloadJSON(JSON.stringify(snapshot), name)
  }
}

// Helpers

const cloneSnapshot = (state, id) => {
  return cloneObj(state.snapshots[id])
}


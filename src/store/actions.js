import * as _ from 'lodash'

export const connectionUpdate = ({ commit }, connected) => {
  commit('SOCKET_CONNECTION', (connected === true))
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

export const takeSnapshot = ({ state, commit }, name) => {
  let snapshot = {
    name: name,
    data: {
      backend: _.cloneDeep(state.backendData),
      app: _.cloneDeep(state.app)
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
  let snapshot = _.cloneDeep(state.snapshots[id])
  if (snapshot) {
    // save app state
    if (getters.isLive) commit('SET_APP_PREVSTATE', _.cloneDeep(state.app))
    commit('ACTIVE_SNAPSHOT', snapshot)
    snapshot = state.activeSnapshot
    commit('REPLACE_STATE', ['app', snapshot.data['app']])
    commit('SET_BACKEND_DATA', snapshot.data)
  }
}

export const loadPrevState = ({ state, commit }) => {
  if (state.appPrevState) {
    let appPrevState = _.cloneDeep(state.appPrevState)
    commit('REPLACE_STATE', ['app', appPrevState])
  }
}

export const goLive = ({ state, dispatch, commit }) => {
  commit('ACTIVE_SNAPSHOT', null)
  dispatch('initData')
  dispatch('loadPrevState')
}

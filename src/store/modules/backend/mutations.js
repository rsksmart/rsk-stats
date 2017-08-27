import Vue from 'vue'
import defaultState from './state.js'

// catch socket emit
export const SOCKET_EMIT = (payload) => { }

export const SET_SERVER_TIME = (state, time) => {
  state.serverTime = time
}

export const SET_CLIENT_TIME = (state, time) => {
  state.clientTime = time
}

export const RESET = (state, value) => {
  const initial = defaultState()
  if (value) state[value] = initial[value]
  else Object.keys(initial).forEach(key => { state[key] = initial[key] })
}

export const ADD_NODE = (state, node) => {
  if (node.id) {
    Vue.set(state.nodes, node.id, node)
  }
}

export const UPDATE_NODE = (state, node) => {
  if (state.nodes[node.id]) {
    for (let prop in node) {
      Vue.set(state.nodes[node.id], prop, node[prop])
    }
  }
}

export const ADD_LINK = (state, link) => {
  Vue.set(state.links, link.id, link)
}

export const REMOVE_NODE = (state, nodeId) => {
  Vue.set(state.nodes, nodeId, null)
  delete (state.nodes[nodeId])
}

export const REMOVE_LINK = (state, linkId) => {
  Vue.set(state.links, linkId, null)
  delete (state.links[linkId])
}
export const UPDATE_NODE_PENDING = (state, payload) => {
  Vue.set(state.nodes[payload.id].stats, 'pending', payload.pending)
}

export const SET_TOTALS = (state, payload) => {
  for (let prop in payload) {
    Vue.set(state.totals, prop, payload[prop])
  }
}

export const SET_CHARTS = (state, payload) => {
  for (let prop in payload) {
    Vue.set(state.charts, prop, payload[prop])
  }
}

export const UPDATE_NODE_STATS = (state, stats) => {
  if (!stats.id) console.log('UDPATE_STATS error')
  let node = state.nodes[stats.id]
  if (node) {
    for (let s in stats.stats) {
      Vue.set(state.nodes[stats.id].stats, s, stats.stats[s])
    }
  }
}
export const UPDATE_NODE_HISTORY = (state, payload) => {
  let id = payload.id
  let history = payload.history
  if (id && history && state.nodes[id]) {
    Vue.set(state.nodes[id], 'history', history)
  }
}

export const SET_MINERS = (state, miners) => {
  state.miners = miners
}

export const UPDATE_MINER_NAME = (state, payload) => {
  state.miners[payload.key].name = payload.name
}

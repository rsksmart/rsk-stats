/* eslint-disable camelcase */
import * as _ from 'lodash'

export const connectionUpdate = ({ commit }, connected) => {
  commit('SOCKET_CONNECTION', (connected === true))
}

export const socket_INIT = ({ dispatch }, data) => {
  dispatch('updateNodes', data.nodes)
}

export const socket_init = ({ dispatch }, data) => {
  dispatch('socket_INIT', data)
}

export const socket_stats = ({ state, commit }, data) => {
  commit('UPDATE_NODE_STATS', data)
}

export const socket_pending = ({ state, commit }, data) => {
  let node = state.nodes[data.id]
  if (node && data.pending) {
    commit('UPDATE_NODE_PENDING', data)
  }
}

export const socket_client_ping = ({ commit }, data) => {
  let time = data.serverTime
  let clientTime = new Date().getTime()
  let send = {
    serverTime: time,
    clientTime: clientTime
  }
  commit('SET_SERVER_TIME', time)
  commit('SET_CLIENT_TIME', clientTime)
  commit('SOCKET_EMIT', { event: 'client-pong', data: send })
}

export const socket_charts = ({ state, dispatch, commit }, data) => {
  const MAX_BINS = state.config.MAX_BINS
  commit('SET_TOTALS', { avgBlockTime: data.avgBlocktime })

  commit('SET_TOTALS', { avgHashrate: data.avgHashrate })

  commit('SET_TOTALS', { hashrateComparedToBtcNetwork: data.hashrateComparedToBtcNetwork })

  dispatch('commitTotalsCheckBins', ['lastGasLimit', data.gasLimit, 'SET_CHARTS'])
  dispatch('commitTotalsCheckBins', ['lastBlocksTime', data.blocktime, 'SET_CHARTS'])

  dispatch('commitTotalsCheckBins', ['difficultyChart', data.difficulty, 'SET_CHARTS'])

  // if( !_.isEqual($scope.blockPropagationChart, data.propagation.histogram) )  <-- review
  commit('SET_CHARTS', { blockPropagationChart: data.propagation.histogram })
  commit('SET_TOTALS', { blockPropagationAvg: data.propagation.avg })
  data.uncleCount.reverse()

  if (data.uncleCount.length >= MAX_BINS) {
    commit('SET_TOTALS', { uncleCount: data.uncleCount[data.uncleCount.length - 2] + data.uncleCount[data.uncleCount.length - 1] })
    commit('SET_CHARTS', { uncleCountChart: data.uncleCount })
  }
  dispatch('commitTotalsCheckBins', ['transactionDensity', data.transactions, 'SET_CHARTS'])
  dispatch('commitTotalsCheckBins', ['gasSpending', data.gasSpending, 'SET_CHARTS'])
  commit('SET_MINERS', data.miners)
}

// socket_chart helper
export const commitTotalsCheckBins = ({ state, commit }, payload) => {
  const MAX_BINS = state.config.MAX_BINS
  let key = payload[0]
  let value = payload[1]
  let mutation = payload[2]
  if (key && value) {
    if (value.length >= MAX_BINS) {
      let data = {}
      data[key] = value
      mutation = mutation || 'SET_TOTALS'
      commit(mutation, data)
    }
  }
}

export const socket_block = ({ state, getters, dispatch, commit }, data) => {
  let id = data.id
  let node = state.nodes[id]
  let block = data.block

  if (node && node.stats) {
    if (node.stats.block.number < block.number) {
      let best = getters.bestBlockNode.stats.block
      block.arrived = (block.number > best.number) ? _.now() : best.arrived
    }
    commit('UPDATE_NODE_HISTORY', { id, history: data.history })
    commit('UPDATE_NODE_STATS', { id, stats: { block, propagationAvg: data.propagationAvg } })
    dispatch('updateBestBlock')
  }
}

export const updateBestBlock = ({ state, getters, commit }) => {
  if (getters.totalNodes > 0) {
    let bestNode = getters.bestBlockNode
    let bestBlock = bestNode.stats.block.number

    if (bestBlock !== state.totals.bestBlock) {
      let bestStats = bestNode.stats
      commit('SET_TOTALS', {
        bestBlock,
        bestStats,
        lastBlock: bestStats.block.arrived,
        lastDifficulty: bestStats.block.difficulty
      })
    }
  }
}

export const socket_add = ({ dispatch }, data) => {
  // (*) commented in the original code
  // dispatch('addNode', data)
}

export const socket_inactive = ({ commit }, data) => {
  // (!) review if is not necessary remove olds stats first
  commit('UPDATE_NODE_STATS', data)
}

export const addNodes = ({ dispatch }, nodes) => {
  for (let nodeId in nodes) {
    dispatch('addNode', nodes[nodeId])
  }
}

// ADD NODE
export const addNode = ({ state, rootGetters, commit }, node) => {
  if (!node.x) node.x = rootGetters.getSize.w / 2
  if (!node.y) node.y = rootGetters.getSize.h / 2
  if (!node.name) node.name = node.id
  commit('ADD_NODE', node)
}

export const updateNodes = ({ commit, dispatch }, nodes) => {
  if (nodes) {
    commit('RESET', 'nodes')
    dispatch('addNodes', nodes)
      .then(dispatch('updateBestBlock'))
  }
}

export const addLinks = ({ dispatch, state }, links) => {
  for (let linkId in links) {
    dispatch('addLink', links[linkId])
  }
}

export const removeLinks = ({ dispatch }, links) => {
  for (let linkId in links) {
    dispatch('removeLink', linkId)
  }
}

export const removeLink = ({ commit }, linkId) => {
  commit('REMOVE_LINK', linkId)
}

export const updateLinks = ({ commit, dispatch }, links) => {
  commit('RESET', 'links')
  dispatch('addLinks', links)
}

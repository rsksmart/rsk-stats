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
  let send = {
    serverTime: time,
    clientTime: new Date().getTime()
  }
  commit('SET_SERVER_TIME', time)
  commit('SOCKET_EMIT', { event: 'client-pong', data: send })
}

export const socket_charts = ({ state, dispatch, commit }, data) => {
  const MAX_BINS = state.config.MAX_BINS
  commit('SET_TOTALS', { avgBlockTime: data.avgBlocktime })

  commit('SET_TOTALS', { avgHashrate: data.avgHashrate })

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
  dispatch('setMinnersNames')
}

// socket_chart helper:  [payload] 0: key  1: value  [2]: mutation
export const commitTotalsCheckBins = ({ state, commit }, payload) => {
  const MAX_BINS = state.config.MAX_BINS
  if (payload[1].length >= MAX_BINS) {
    let data = {}
    data[payload[0]] = payload[1]
    let mutation = (payload[2]) ? payload[2] : 'SET_TOTALS'
    commit(mutation, data)
  }
}

export const setMinnersNames = ({ state, commit }) => {
  if (state.miners.length > 0) {
    _.forIn(state.miners, (value, key) => {
      if (value.name !== false) return
      if (value.miner === '0x0000000000000000000000000000000000000000') return
      let name = _.result(_.find(_.map(state.nodes, 'info'), 'coinbase', value.miner), 'name')
      if (!_.isUndefined(name)) commit('UPDATE_MINER_NAME', { key, name })
    })
  }
}

export const socket_block = ({ state, getters, dispatch, commit }, data) => {
  let node = state.nodes[data.id]
  if (node && node.stats && node.stats.block && node.stats.block.number) {
    if (node.stats.block.number < data.block.number) {
      let best = _.max(getters.getNodesArr, (node) => { return parseInt(node.stats.block.number) }).stats.block

      if (data.block.number > best.number) {
        data.block.arrived = _.now()
      } else {
        data.block.arrived = best.arrived
      }
      let newNode = { id: node.id, history: data.history }
      let stats = { block: data.block, propagationAvg: data.propagationAvg }
      commit('UPDATE_NODE', newNode)
      commit('UPDATE_NODE_STATS', { id: node.id, stats }) // ------------------------------- review
      dispatch('updateBestBlock')
    }
  }
}

export const updateBestBlock = ({ state, getters, commit }) => {
  let totalNodes = getters.totalNodes
  if (totalNodes > 0) {
    let nodesArr = getters.getNodesArr
    let bestBlock = _.max(nodesArr, (node) => {
      return node.stats.block.number
    })
    bestBlock = bestBlock.stats.block.number

    if (bestBlock !== state.totals.bestBlock) {
      commit('SET_TOTALS', { bestBlock })
      let bestStats = _.max(nodesArr, (node) => {
        return parseInt(node.stats.block.number)
      }).stats
      commit('SET_TOTALS', { bestStats })
      let lastBlock = state.totals.bestStats.block.arrived
      let lastDifficulty = state.totals.bestStats.block.difficulty
      commit('SET_TOTALS', { lastBlock })
      commit('SET_TOTALS', { lastDifficulty })
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
  // let newNodes = utils.rebuildNodes(state.links, state.nodes)
  // dispatch('updateNodes', newNodes)
}

export const updateLinks = ({ commit, dispatch }, links) => {
  commit('RESET', 'links')
  dispatch('addLinks', links)
}

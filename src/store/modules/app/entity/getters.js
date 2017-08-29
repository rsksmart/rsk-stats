import Vue from 'vue'
import { mapColor, interpolColor } from '../../../../lib/js/colors.js'

export const thresholdColors = state => (name) => {
  let threshold = state.thresholds[name]
  if (threshold) {
    let colors = threshold.colors
    let domain = Object.keys(colors).map((v) => { return parseInt(v) })

    let interpolator = threshold.interpolator
    if (interpolator) {
      return interpolColor(domain, interpolator)
    } else {
      let range = Object.values(colors)
      return mapColor(domain, range, threshold.type)
    }
  }
}

export const getEntities = (state, getters) => {
  let entities = {}
  for (let e in state.entities) {
    let entity = state.entities[e]
    entity.title = entity.title || e
    entity.id = e
    entities[e] = entity
  }
  return entities
}
export const getEntity = (state, getters) => (name) => {
  return getters.getEntities[name]
}

export const NodeEntity = (state, getters, rootState, rootGetters) => node => {
  if (node) {
    let stats = node.stats
    let fields = {
      name: node.info.name,
      type: node.info.node,
      latency: (stats.active) ? stats.latency : 0,
      uptime: stats.uptime,
      peers: stats.peers,
      pending: stats.pending,
      uncles: stats.block.uncles.length || 0,
      blockTrans: stats.block.transactions.length || 0,
      lastBlockTime: rootGetters.getDate - stats.block.received,
      lastBlock: stats.block.number,
      bestBlock: stats.block.hash,
      totalDiff: stats.block.totalDifficulty,
      propTime: stats.block.propagation,
      avgPropTime: stats.propagationAvg
    }
    return fields
  }
  return
}
export const TotalsEntity = (state, getters, rootState, rootGetters) => {
  let totals = rootState.backendData.totals
  return {
    bestBlock: totals.bestBlock,
    lastBlockTime: rootGetters.getDate - totals.lastBlock,
    avgBlockTime: totals.avgBlockTime,
    lastDifficulty: totals.lastDifficulty,
    avgHashrate: totals.avgHashrate,
    uncles: totals.bestStats.block.uncles.length + '/' + totals.uncleCount
  }
}

export const getTotalEntity = (state, getters) => (name) => {
  return getters.TotalsEntity[name]
}
/*
'name',
  'propTime',
  'avgPropTime',
  'uptime' */
export const getNodesEntities = (state, getters, rootState, rootGetters) => {
  let nodes = rootGetters.getNodes
  let nEntities = {}
  for (let nid in nodes) {
    let node = getters.NodeEntity(nodes[nid])
    node.id = nid
    nEntities[nid] = node
  }
  return nEntities
}

export const getNodesEntitiesArr = (state, getters) => {
  return Object.values(getters.getNodesEntities)
}

export const filterValue = (state) => (entity, value) => {
  let filters = entity.filters
  if (filters) {
    filters = (typeof (filters) === Array) ? filters : [filters]
    for (let filterName of filters) {
      let filter = Vue.filter(filterName)
      if (filter) value = filter(value)
      else console.info('The entity ' + entity.id + ' call unknown filter ' + filterName)
    }
  }
  return value
}

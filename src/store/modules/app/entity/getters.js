import Vue from 'vue'
import * as entity from '../../../../config/entityValues.js'
import { thColors } from '../../../../lib/js/colors.js'

// returns function to get color from value
export const thresholdColors = state => (name) => {
  let threshold = state.thresholds[name]
  if (threshold) return thColors(threshold)
}

export const getEntities = (state, getters) => {
  return state.renderedEntities
}

export const getEntity = (state, getters) => (name) => {
  return state.renderedEntities[name]
}

export const nodeEntity = (state, getters, rootState, rootGetters) => node => {
  let totals = rootState.backendData.totals
  let date = rootGetters.getDate
  return entity.NODE(node, date, totals)
}
export const TotalsEntity = (state, getters, rootState, rootGetters) => {
  let totals = rootState.backendData.totals
  let date = rootGetters.getDate
  return entity.TOTAL(totals, date)
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
    nEntities[nid] = getters.createNodeEntity(nid)
  }
  return nEntities
}

export const createNodeEntity = (state, getters, rootState, rootGetters) => nid => {
  let node = rootGetters.getNode(nid)
  if (node) {
    let entity = getters.nodeEntity(node)
    entity.id = nid
    return entity
  }
}

export const getNodesEntitiesArr = (state, getters) => {
  return Object.values(getters.getNodesEntities)
}

export const applyFilter = (state) => (filters, value) => {
  if (filters) {
    filters = (Array.isArray(filters)) ? filters : [filters]
    for (let f of filters) {
      if (typeof (f) === 'object') {
        let filterName = f.name
        let args = f.args
        if (filterName) value = filter(filterName, value, args)
      } else {
        value = filter(f, value)
      }
    }
  }
  return value
}

const filter = (filterName, value, args) => {
  let filter = Vue.filter(filterName)
  if (filter) {
    if (args) value = filter(value, ...args)
    else value = filter(value)
  } else {
    console.info('Unknown filter ' + filterName)
  }
  return value
}

export const filterEntityValue = (state, getters) => (entity, value) => {
  let filters = entity.filters
  let err = 'The entity ' + entity.id + ' call unknown filter '
  return getters.applyFilter(filters, value, err)
}

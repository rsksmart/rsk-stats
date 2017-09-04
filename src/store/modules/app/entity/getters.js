import Vue from 'vue'
import * as entity from '../../../../config/entityValues.js'
import { mapColor, interpolColor } from '../../../../lib/js/colors.js'

// returns function to get color from value
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
    entities[e] = getters.createEntity(e)
  }
  return entities
}

export const getEntity = (state, getters) => (name) => {
  return getters.createEntity(name)
}

export const createEntity = (state) => name => {
  let entity = state.entities[name]
  if (entity) {
    entity.title = entity.title || name
    entity.id = name
    let threshold = entity.threshold
    if (threshold) entity.thresholdObj = state.thresholds[threshold]
    return entity
  }
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

export const applyFilter = (state) => (filters, value, err) => {
  if (filters) {
    filters = (Array.isArray(filters)) ? filters : [filters]
    for (let filterName of filters) {
      let filter = Vue.filter(filterName)
      if (filter) {
        value = filter(value)
      } else {
        err = err || 'Unknown filter '
        err += filterName
        console.info(err)
      }
    }
  }
  return value
}

export const filterEntityValue = (state, getters) => (entity, value) => {
  let filters = entity.filters
  let err = 'The entity ' + entity.id + ' call unknown filter '
  return getters.applyFilter(filters, value, err)
}

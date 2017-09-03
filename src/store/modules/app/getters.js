import * as types from './types'

export const getTypes = () => {
  return types
}
export const selection = (state) => {
  return state.selection
}

export const nodesSelected = (state) => {
  return state.selection[types.NODE]
}

export const linksSelected = (state) => {
  return state.selection[types.LINK]
}

export const isNodeSelected = state => id => {
  return state.selection[types.NODE][id]
}

export const isLinkSelected = state => id => {
  return state.selection[types.LINK][id]
}
export const getDialogs = (state) => {
  return state.dialogs
}

export const getDialogsByType = (state) => type => {
  return state.dialogs.filter((item) => {
    return item.type === type
  })
}
export const getNodeDialogs = (state, getters) => {
  return getters.getDialogsByType(types.NODE)
}

export const getChartDialogs = (state, getters) => {
  return getters.getDialogsByType(types.CHART)
}

export const chartsDialogs = (state, getters) => {
  return getters.getDialogsByType(types.CHART)
}

export const tableFields = (state, getters, rootState) => {
  return state.tableFields
}

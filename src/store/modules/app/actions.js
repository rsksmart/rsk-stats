import * as types from './types'

// SELECTION actions
export const clearSelection = ({ commit }) => {
  commit('EMPTY_SELECTION', 'nodes')
  commit('EMPTY_SELECTION', 'links')
}

export const selectNode = ({ commit, dispatch }, node) => {
  commit('SELECT_ITEM', { type: types.NODE, item: node })
  dispatch('addNodeDialog', node)
}

export const addNodeDialog = ({ commit }, node) => {
  let dialog = {
    id: node.id,
    x: node.x,
    y: node.y,
    name: node.info.name,
    w: 0,
    h: 0
  }
  commit('ADD_DIALOG', [types.NODE, dialog])
}

export const selectLink = ({ commit }, link) => {
  commit('SELECT_ITEM', { type: 'links', item: link })
}

export const unSelectNode = ({ state, commit, getters }, id) => {
  commit('UNSELECT_ITEM', { type: 'nodes', id: id })
  let index = findNodeDialog(getters.getNodeDialogs, id)
  if (index !== null) {
    commit('REMOVE_DIALOG', index)
  }
}

export const unSelectLink = ({ commit }, id) => {
  commit('UNSELECT_ITEM', { type: 'links', id: id })
}

export const selectNodeLinks = ({ state, dispatch }, id) => {
  let select = state.selection.nodes[id]
  for (let linkId in state.links) {
    let link = state.links[linkId]
    if (link.tid === id || link.sid === id) {
      if (select) dispatch('selectLink', link)
      else dispatch('unSelectLink', link.id)
    }
  }
}

export const pinNode = ({ state, commit }, node) => {
  node.fx = node.x
  node.fy = node.y
  node._pinned = true
  // commit('UPDATE_NODE', node)
}

export const updateNodeDialog = ({ state, commit, getters }, payload) => {
  let id = payload.id
  let nodeDialogs = getters.getNodeDialogs
  let values = payload
  delete (values.id)
  let index = findNodeDialog(nodeDialogs, id)
  if (index !== null) {
    let value = nodeDialogs[index]
    for (let p in values) {
      value[p] = values[p]
    }
    commit('UPDATE_DIALOG', { index, value })
  }
}

const findNodeDialog = (dialogs, nodeId) => {
  let index = dialogs.findIndex((val) => {
    return val.id === nodeId
  })
  return (index > -1) ? index : null
}

export const maximizeChart = ({ commit }, data) => {
  commit('SET_MAXIMIZED_CHART', data)
}

export const showHideTable = ({ state, commit }, show) => {
  // optional show argument
  show = show || !state.showTable
  commit('SET_SHOW_TABLE', show)
}

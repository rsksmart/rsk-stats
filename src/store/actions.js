export const connectionUpdate = ({ commit }, connected) => {
  commit('SOCKET_CONNECTION', (connected === true))
}

export const setSize = ({ commit }, size) => {
  commit('SET_SIZE', size)
}

// SELECTION actions
export const clearSelection = ({ commit }) => {
  commit('EMPTY_SELECTION', 'nodes')
  commit('EMPTY_SELECTION', 'links')
}

export const selectNode = ({ commit }, node) => {
  commit('SELECT_ITEM', { type: 'nodes', item: node })
  commit('ADD_NODE_DIALOG', node)
}
export const selectLink = ({ commit }, link) => {
  commit('SELECT_ITEM', { type: 'links', item: link })
}

export const unSelectNode = ({ state, commit, getters }, id) => {
  commit('UNSELECT_ITEM', { type: 'nodes', id: id })
  let index = findNodeDialog(getters.getNodeDialogs, id)
  if (index !== null) {
    commit('REMOVE_NODE_DIALOG', index)
  }
}

export const unSelectLink = ({ commit }, id) => {
  commit('UNSELECT_ITEM', { type: 'links', id: id })
}

export const selectNodeLinks = ({ state, dispatch }, id) => {
  let select = state.app.selection.nodes[id]
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
  commit('UPDATE_NODE', node)
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
    commit('UPDATE_NODE_DIALOG', { index, value })
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

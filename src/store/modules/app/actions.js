import * as types from './types'

// SELECTION actions
export const clearSelection = ({ commit }) => {
  commit('EMPTY_SELECTION', types.NODE)
  commit('EMPTY_SELECTION', types.LINK)
}

export const selectNode = ({ commit, dispatch }, node) => {
  commit('SELECT_ITEM', { type: types.NODE, item: node })
  if (!node.name) node.name = node.info.name
  node.type = types.NODE
  dispatch('createDialog', node)
}

export const createDialog = ({ state, commit }, payload) => {
  let type = payload.type
  let id = payload.id
  if (type && id) {
    let dialog = Object.assign({}, payload)
    let props = ['x', 'y', 'z', 'w', 'h', 'width', 'height']
    for (let p of props) {
      dialog[p] = dialog[p] || 0
    }
    dialog.id = id
    let index = findDialog(state.dialogs, id, type)
    if (index === null) commit('ADD_DIALOG', [type, dialog])
  }
}

const findDialog = (dialogs, id, type) => {
  let index = dialogs.findIndex((item) => {
    return ((item.id === id) && (item.type === type))
  })
  return (index > -1) ? index : null
}

export const loadDialog = ({ commit }, payload) => {
  let type = payload[0]
  let dialog = payload[1]
  if (type && dialog) {
    commit('ADD_DIALOG', [type, dialog])
  }
}

export const closeDialog = ({ state, commit, dispatch }, payload) => {
  let type = payload.type
  let id = payload.id
  let index = findDialog(state.dialogs, id, type)
  if (index !== null) {
    // unselect nodes
    if (type === types.NODE) {
      dispatch('unSelectNode', payload.id)
    }
    commit('REMOVE_DIALOG', index)
  }
}

export const selectLink = ({ commit }, link) => {
  commit('SELECT_ITEM', { type: types.LINK, item: link })
}

export const unSelectNode = ({ commit }, id) => {
  commit('UNSELECT_ITEM', { type: types.NODE, id: id })
}

export const unSelectLink = ({ commit }, id) => {
  commit('UNSELECT_ITEM', { type: types.LINK, id: id })
}

export const selectNodeLinks = ({ state, dispatch, rootGetters }, id) => {
  let select = state.selection[types.NODE][id]
  for (let linkId in rootGetters.getLinks) {
    let link = state[types.LINK][linkId]
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
}

export const updateDialog = ({ state, commit }, payload) => {
  let id = payload.id
  let type = payload.type
  let index = findDialog(state.dialogs, id, type)
  if (index > -1) {
    let value = payload
    commit('UPDATE_DIALOG', { index, value })
  }
}

export const showHideTable = ({ state, commit }, show) => {
  // optional show argument
  show = show || !state.showTable
  commit('SET_SHOW_TABLE', show)
}

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
  let index = findDialog(state.dialogs, id, type)

  if (type && id) {
    if (index === null) {
      let copy = Object.assign({}, payload)
      let dialog = {}
      let props = ['x', 'y', 'z', 'w', 'h', 'width', 'height', 'left', 'top', 'centered']
      for (let p of props) {
        dialog[p] = copy[p] || 0
      }
      dialog.id = id
      dialog._show = true
      dialog._persistent = true // <- Hard coded persistence for all dialogs

      commit('ADD_DIALOG', [type, dialog])
    } else {
      commit('SHOW_DIALOG', index)
    }
  }
}

const findDialog = (dialogs, id, type) => {
  let index = dialogs.findIndex((item) => {
    return ((item.id === id) && (item.type === type))
  })
  return (index > -1) ? index : null
}

export const closeDialog = ({ state, commit, dispatch }, dialog) => {
  let type = dialog.type
  let id = dialog.id
  let index = findDialog(state.dialogs, id, type)
  if (index !== null) {
    // unselect nodes
    if (type === types.NODE) {
      dispatch('unSelectNode', dialog.id)
    }
    if (dialog._persistent) commit('HIDE_DIALOG', index)
    else commit('REMOVE_DIALOG', index)
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

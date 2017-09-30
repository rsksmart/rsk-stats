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
  if (state.dialogs.length) {
    return state.dialogs.filter((dialog) => {
      return dialog._show === true
    })
  }
}

export const isVisibleDialog = (state, getters) => (type, id) => {
  let dialog = getters.getDialog(type, id)
  return (dialog) ? dialog[0] : false
}

export const getDialogsByType = (state) => type => {
  if (state.dialogs.length) {
    return state.dialogs.filter((dialog) => {
      return ((dialog.type === type) && (dialog._show === true))
    })
  }
}
export const getNodeDialogs = (state, getters) => {
  return getters.getDialogsByType(types.NODE)
}

export const getChartDialogs = (state, getters) => {
  return getters.getDialogsByType(types.CHART)
}

export const getDialog = (state, getters) => (type, id) => {
  let dialogs = getters.getDialogsByType(type)
  if (dialogs) {
    return dialogs.filter((dialog) => {
      return dialog.id === id
    })
  }
}

export const tableFields = (state) => {
  return state.tableFields
}

export const bigDataFields = (state) => {
  return state.bigDataFields
}


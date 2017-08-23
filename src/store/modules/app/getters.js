export const selection = (state) => {
  return state.selection
}

export const nodesSelected = (state) => {
  return state.selection.nodes
}

export const linksSelected = (state) => {
  return state.selection.links
}

export const isNodeSelected = state => id => {
  return state.selection.nodes[id]
}

export const isLinkSelected = state => id => {
  return state.selection.links[id]
}

export const getNodeDialogs = (state) => {
  return state.nodeDialogs
}

export const tableFields = (state, getters, rootState) => {
  return state.tableFields
}

export const isConnected = (state) => {
  return state.socketConnected
}

export const selection = (state) => {
  return state.app.selection
}

export const nodesSelected = (state) => {
  return state.app.selection.nodes
}

export const linksSelected = (state) => {
  return state.app.selection.links
}

export const isNodeSelected = state => id => {
  return state.app.selection.nodes[id]
}

export const isLinkSelected = state => id => {
  return state.app.selection.links[id]
}

export const getSize = (state) => {
  return state.app.size
}

export const getNodeDialogs = (state) => {
  return state.app.nodeDialogs
}

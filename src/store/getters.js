export const isConnected = (state) => {
  return state.socketConnected
}

export const getSize = (state) => {
  return state.size
}
// temp
export const getActivesNodes = (state) => {
  return Object.values(state.backendData.nodes).filter((node) => {
    return node.stats.active === true
  })
}

export const getNodesArr = (state) => {
  return Object.values(state.backendData.nodes)
}

export const getLinksArr = (state) => {
  return Object.values(state.backendData.links)
}

export const getNodes = (state) => {
  return state.backendData.nodes
}

export const getNode = state => id => {
  return state.backendData.nodes[id]
}
// checks if backend datasource is live
export const isLive = (state) => {
  return state.backendData === state.backend
}

export const totalSnapshots = (state) => {
  return Object.keys(state.snapshots).length
}

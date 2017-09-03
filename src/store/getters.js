export const isConnected = (state) => {
  return state.socketConnected
}

export const getSize = (state) => {
  return state.size
}

export const getDate = (state, getters) => {
  let snapshot = state.activeSnapshot
  let date = (snapshot) ? snapshot.date : state.date
  date += getters.timeDifference
  return date
}

export const timeDifference = (state) => {
  return state.backendData.serverTime - state.backendData.clientTime
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

export const getLinks = (state) => {
  return state.backendData.links
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
export const getSnapshots = (state) => {
  return state.snapshots
}
export const totalSnapshots = (state) => {
  if (state.snapshots) return Object.keys(state.snapshots).length
  return 0
}

export const getSnapshotsListOptions = (state) => {
  return state.snapshotsListOptions
}

export const getCharts = (state) => {
  return state.backendData.charts
}

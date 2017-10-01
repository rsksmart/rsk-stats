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

export const checkSnapshot = () => snapshot => {
  if (!snapshot) return
  let data = snapshot.data
  if (data && snapshot.name && snapshot.date) {
    if (data.app && data.backend) {
      return snapshot
    }
  }
}

export const ifSnapshot = (state) => snapshot => {
  let date = snapshot.date
  let name = snapshot.name
  if (name && date) {
    let dup = state.snapshots[date]
    return (dup && (dup.name === name))
  }
}

export const getCharts = (state) => {
  return state.backendData.charts
}

export const getConfig = (state) => {
  return state.config
}

export const getNetOptions = (state) => {
  return Object.assign({}, state.config.netOptions)
}

export const getNodesList = (state) => {
  return state.nodes
}

export const getLinksList = (state) => {
  return state.links
}

export const totalNodes = (state) => {
  return Object.keys(state.nodes).length
}

export const getActivesNodes = (state) => {
  return Object.values(state.nodes).filter((node) => {
    return node.stats.active === true
  })
}

export const getNodesArr = (state) => {
  return Object.values(state.nodes)
}

export const getLinksArr = (state) => {
  return Object.values(state.links)
}

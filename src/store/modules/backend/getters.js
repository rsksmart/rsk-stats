import { aMax } from './utils.js'

export const getNodesList = (state) => {
  return state.nodes
}

export const getLinksList = (state) => {
  return state.links
}

export const totalNodes = (state) => {
  return Object.keys(state.nodes).length
}

export const getNodesArr = (state) => {
  return Object.values(state.nodes)
}

// get node with best block
export const bestBlockNode = (state, getters) => {
  let nodes = getters.getNodesArr
  return aMax(nodes, (node) => {
    return parseInt(node.stats.block.number)
  })
}

export const bestBlock = (state, getters) => {
  return getters.bestBlockNode.stats.block.number
}

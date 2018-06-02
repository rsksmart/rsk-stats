import { aMax } from './utils.js'

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
  let node = getters.bestBlockNode
  if (node) return node.stats.block.number
}

export const getMinerName = (state) => addr => {
  return state.minersNames[addr]
}

export const getMiners = (state, getters) => {
  return state.miners.map((miner) => {
    if (!miner.name && miner.miner) miner.name = getters.getMinerName(miner.miner)
    return miner
  })
}

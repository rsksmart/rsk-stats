export const getEntities = (state) => {
  let entities = {}
  for (let e in state.entities) {
    let entity = state.entities[e]
    entity.title = entity.title || e
    entity.id = e
    entities[e] = entity
  }
  return entities
}

export const NodeEntity = (state, getters, rootState) => node => {
  if (node) {
    let fields = {
      name: node.info.name,
      type: node.info.node,
      latency: node.stats.latency,
      uptime: node.stats.uptime,
      peers: node.stats.peers,
      pending: node.stats.pending,
      uncles: node.stats.block.uncles.length || 0,
      blockTrans: node.stats.block.transactions.length || 0,
      blockPropagation: node.stats.block.propagation,
      lastBlockTime: rootState.date - node.stats.block.received,
      lastBlock: node.stats.block.number,
      bestBlock: node.stats.block.hash,
      totalDiff: node.stats.block.totalDifficulty,
      propTime: node.stats.block.propagation,
      avgPropTime: node.stats.propagationAvg
    }
    return fields
  }
  return
}
/*
'name',
  'propTime',
  'avgPropTime',
  'uptime' */
export const getNodesEntities = (state, getters, rootState, rootGetters) => {
  let nodes = rootGetters.getNodes
  let nEntities = {}
  for (let nid in nodes) {
    let node = getters.NodeEntity(nodes[nid])
    node.id = nid
    nEntities[nid] = node
  }
  return nEntities
}

export const getNodesEntitiesArr = (state, getters) => {
  return Object.values(getters.getNodesEntities)
}

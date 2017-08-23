export const getEntities = (state) => {
  let entities = {}
  for (let e in state.entities) {
    let entity = state.entities[e]
    entity.title = entity.title || e
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
    return getters.filterFields(fields)
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
    nEntities[nid] = getters.NodeEntity(nodes[nid])
  }
  return nEntities
}

export const filterFields = (state, getters) => (fields) => {
  let entities = state.entities
  for (let f in fields) {
    let entity = entities[f]
    if (entity && entity.filters) {
      let filters = (typeof (filters) === Array) ? entity.filters : [entity.filters]
      for (let filterName of filters) {
        fields[f] = getters.applyFilter(filterName, fields[f])
      }
    }
  }
  return fields
}

export const applyFilter = (state) => (filterName, value) => {
  let filter = state.filters[filterName]
  return (filter) ? filter(value) : value
}

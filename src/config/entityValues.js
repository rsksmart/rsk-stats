const NA = 'n/a'

export const NODE = (node, date, totals) => {
  if (node) {
    let stats = node.stats
    let fields = {
      name: node.info.name,
      type: node.info.node,
      latency: (stats.active) ? stats.latency : NA,
      uptime: stats.uptime,
      peers: stats.peers,
      pending: stats.pending,
      uncles: stats.block.uncles.length || 0,
      blockTrans: stats.block.transactions.length || 0,
      lastBlockTime: date - stats.block.received,
      lastBlock: stats.block.number,
      lastBlockDifference: totals.bestBlock - stats.block.number,
      bestBlock: stats.block.hash,
      bestBlockTrim: stats.block.hash,
      totalDiff: stats.block.totalDifficulty,
      propTime: stats.block.propagation,
      avgPropTime: stats.propagationAvg,
      mining: stats.mining,
      active: stats.active
    }
    return fields
  }
}

export const TOTAL = (totals, date) => {
  return {
    bestBlock: totals.bestBlock,
    lastBlockTime: date - totals.lastBlock,
    avgBlockTime: totals.avgBlockTime,
    lastDifficulty: totals.lastDifficulty,
    avgHashrate: totals.avgHashrate,
    uncles: totals.bestStats.block.uncles.length + '/' + totals.uncleCount,
    gasPrice: totals.bestStats.gasPrice,
    gasLimit: totals.bestStats.block.gasLimit,
    minGasPrice: totals.bestStats.block.minimumGasPrice
  }
}

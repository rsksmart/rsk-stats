export default function () {
  return {
    config: {
      MAX_BINS: 40
    },
    nodes: {},
    links: {},
    pendingNodes: {},

    totals: {
      bestBlock: 0,
      bestStats: {
        block: {
          uncles: []
        }
      },
      nodesActive: 0,
      lastBlock: 0,
      lastDifficulty: 0,
      avgBlockTime: 0,
      blockPropagationAvg: 0,
      avgHashrate: 0,
      uncleCount: [],
      upTimeTotal: 0 // <---
    },
    charts: {
      difficultyChart: [],
      blockPropagationChart: [],
      uncleCountChart: [],
      lastGasLimit: [],
      lastBlocksTime: [],
      transactionDensity: [],
      gasSpending: []
    },
    miners: []
  }
}

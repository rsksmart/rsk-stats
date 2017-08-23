export default function () {
  return {
    selection: {
      nodes: {},
      links: {}
    },
    nodeDialogs: [],
    maximizedChart: null,
    showTable: false,
    tableFields: [
      'name',
      'type',
      'latency',
      'peers',
      'pending',
      'lastBlock',
      'totalDiff',
      'blockTrans',
      'uncles',
      'lastBlockTime',
      'propTime',
      'avgPropTime',
      'uptime'
    ]
  }
}

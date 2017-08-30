export default function () {
  return {
    fields: [
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
    ],
    sortOrders: {},
    pinned: {},
    sortKey: null,
    filterKey: '',
    options: {
      x: 0,
      y: 0
    }
  }
}

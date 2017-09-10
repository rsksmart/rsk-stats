/*
  Entities definitions
  - icon: icon class name
  - title: entity title
  - prefix: entity value prefix
  - suffix: entity value suffix
  - filters: String | Array : Vue filters names
  - threshold: threshold name, view thresholds.js
  - thField: key of value to compute threshold
*/
export default {
  name: {
    icon: 'rsk',
    title: 'node name'
  },
  type: {
    icon: 'database',
    title: 'node type',
    filters: 'node-type'
  },
  mining: {
    icon: 'ellipsis',
    title: 'is mining',
    filters: 'yes-no',
    threshold: 'yesNo'
  },
  uptime: {
    icon: 'plug',
    filters: 'percent',
    threshold: 'time'
  },
  latency: {
    icon: 'stopwatch',
    title: 'node latency',
    suffix: 'ms',
    threshold: 'latency'
  },
  peers: {
    icon: 'server'
  },
  pending: {
    icon: 'credit-card',
    title: 'pending transactions'
  },
  uncles: {
    icon: 'git-merge'
  },
  blockTrans: {
    icon: 'rocket',
    title: 'block transactions'
  },
  lastBlockTime: {
    icon: 'cubes',
    title: 'last block',
    filters: 'abbr-time-seconds',
    suffix: ' ago',
    threshold: 'blockTime'
  },
  lastBlock: {
    icon: 'cube',
    title: 'last block',
    threshold: 'lastBlock',
    thField: 'lastBlockDifference',
    filters: 'locale'
  },
  bestBlock: {
    icon: 'cube',
    title: 'best block',
    filters: 'locale'
  },
  bestBlockTrim: {
    icon: 'cube',
    title: 'last block hash',
    filters: 'hash-trim',
    threshold: 'lastBlock',
    thField: 'lastBlockDifference'
  },
  lastBlockDifference: {
    title: 'last block difference',
    threshold: 'lastBlock'
  },
  totalDiff: {
    icon: 'puzzle',
    title: 'total difficulty',
    filters: 'H',
    threshold: 'hashes'
  },
  propTime: {
    title: 'propagation time',
    icon: 'stopwatch',
    threshold: 'propagation',
    filters: 'miliseconds'
  },
  avgPropTime: {
    title: 'average propagation time',
    icon: 'flame',
    filters: 'miliseconds',
    threshold: 'propagation'
  },
  avgBlockTime: {
    title: 'avg block time',
    icon: 'stopwatch',
    filters: 's-seconds',
    threshold: 'avgBlockTime'
  },
  avgHashrate: {
    title: 'avg hash rate',
    icon: 'zap',
    filters: 'Hs',
    threshold: 'hashes'
  },
  lastDifficulty: {
    title: 'difficulty',
    icon: 'puzzle',
    filters: 'H',
    threshold: 'hashes'
  },
  gasPrice: {
    title: 'gas price',
    icon: 'cube',
    cssClass: 'big-number',
    filters: 'wei'
  },
  gasLimit: {
    title: 'gas limit',
    icon: 'cube',
    cssClass: 'big-number',
    filters: 'gas'
  },
  nodeHistory: {
    title: 'node history',
    icon: 'pulse'
  }
}

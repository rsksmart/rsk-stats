/*
  Entities definitions
  - icon: icon class name
  - title: entity title
  - prefix: entity value prefix
  - suffix: entity value suffix
  - filters: String | Array : Vue filters names
  - threshold: threshold name, view thresholds.js
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
    filters: 'm-seconds-ago',
    suffix: ' ago'
  },
  lastBlock: {
    icon: 'cube',
    title: 'last block'
  },
  bestBlock: {
    icon: 'cube',
    title: 'best block'
  },
  totalDiff: {
    icon: 'puzzle',
    title: 'total difficulty',
    filters: 'numerals',
    suffix: 'H'
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
    filters: 's-seconds'
  },
  avgHashrate: {
    title: 'avg hash rate',
    icon: 'zap',
    filters: 'numerals',
    suffix: 'Hs'
  },
  lastDifficulty: {
    title: 'difficulty',
    icon: 'puzzle',
    filters: 'numerals',
    suffix: 'H'
  }
}

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
    icon: 'icon-rsk',
    title: 'node name'
  },
  type: {
    icon: 'icon-database',
    title: 'node type',
    filters: 'node-type'
  },
  uptime: {
    icon: 'icon-plug',
    filters: 'percent',
    threshold: 'time'
  },
  latency: {
    icon: 'icon-stopwatch',
    title: 'node latency',
    suffix: 'ms',
    threshold: 'latency'
  },
  peers: {
    icon: 'icon-server'
  },
  pending: {
    icon: 'icon-credit-card',
    title: 'pending transactions'
  },
  uncles: {
    icon: 'icon-git-merge'
  },
  blockTrans: {
    icon: 'icon-rocket',
    title: 'block transactions'
  },
  lastBlockTime: {
    icon: 'icon-cubes',
    title: 'last block',
    filters: 'm-seconds-ago',
    suffix: ' ago'
  },
  lastBlock: {
    icon: 'icon-cube',
    title: 'last block'
  },
  bestBlock: {
    icon: 'icon-cube',
    title: 'best block'
  },
  totalDiff: {
    icon: 'icon-puzzle',
    title: 'total difficulty',
    filters: 'numerals',
    suffix: 'H'
  },
  propTime: {
    title: 'propagation time',
    icon: 'icon-stopwatch',
    threshold: 'propagation',
    filters: 'miliseconds'
  },
  avgPropTime: {
    title: 'average propagation time',
    icon: 'icon-flame',
    filters: 'miliseconds',
    threshold: 'propagation'
  },
  avgBlockTime: {
    title: 'avg block time',
    icon: 'icon-stopwatch',
    filters: 's-seconds'
  },
  avgHashrate: {
    title: 'avg net hash rate',
    icon: 'icon-zap',
    filters: 'numerals',
    suffix: 'Hs'
  },
  lastDifficulty: {
    title: 'difficulty',
    icon: 'icon-puzzle',
    filters: 'numerals',
    suffix: 'H'
  }
}

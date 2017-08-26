export default function () {
  return {
    entities: {
      name: {
        icon: 'icon-rsk',
        title: 'node name'
      },
      type: {
        icon: 'icon-database',
        title: 'node type',
        filters: 'nodeType'
      },
      uptime: {
        icon: 'icon-plug',
        filters: 'percent'
      },
      latency: {
        icon: 'icon-stopwatch',
        title: 'node latency',
        suffix: 'ms'
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
      blockPropagation: {
        icon: 'icon-stopwatch',
        title: 'avg propagation time'
      },
      lastBlockTime: {
        icon: 'icon-cubes',
        title: 'last block time',
        filters: 'mSecondsAgo'
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
        icon: 'icon-stopwatch'
      },
      avgPropTime: {
        icon: 'icon-flame'
      }
    }
  }
}

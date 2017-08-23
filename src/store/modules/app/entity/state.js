import { percent } from '../../../../filters/NumberFilters.js'
export default function () {
  return {
    filters: {
      percent
    },
    entities: {
      uptime: {
        icon: 'icon-plug',
        filters: 'percent'
      },
      peers: {
        icon: 'icon-server'
      },
      pending: {
        icon: 'icon-credit-card',
        title: 'pending trans'
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
        icon: 'icon-cube',
        title: 'last block time'
      },
      lastBlock: {
        title: 'last block'
      },
      bestBlock: {
        title: 'best block'
      },
      totalDiff: {
        title: 'total difficulty'
      }
    }
  }
}


import { blues } from './colorsInterpolators.js'
export default {
  uncleCountChart: {
    title: 'Uncles',
    options: {
      colorInterpol: blues
    }
  },
  lastBlocksTime: {
    title: 'Blocks Time',
    options: {
      colors: ['red', 'yellow']
    }
  },
  difficultyChart: {
    title: 'Difficulty'
  },
  lastGasLimit: {
    title: 'Gas Limit'
  },
  gasSpending: {
    title: 'Gas Spending'
  },
  transactionDensity: {
    title: 'Transaction Density'
  }
}

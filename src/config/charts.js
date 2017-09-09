import { blues, redGreen } from './colorsInterpolators.js'
import COLORS from './colors.js'
export default {
  uncleCountChart: {
    title: 'uncles',
    subtitle: '25 blocks per bar',
    options: {
      colorInterpol: blues
      // colors: [COLORS.blue, COLORS.white]
    }
  },
  lastBlocksTime: {
    title: 'blocks time',
    options: {
      colors: [COLORS.red, COLORS.yellow]
    }
  },
  difficultyChart: {
    title: 'difficulty',
    options: {
      colorInterpol: redGreen
      // colors: ['green', 'red']
    }
  },
  lastGasLimit: {
    title: 'gas Limit'
  },
  gasSpending: {
    title: 'gas spending'
  },
  transactionDensity: {
    title: 'transaction density'
  }
}

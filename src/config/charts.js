/* eslint-disable no-unused-vars */
import { blues, redGreen } from './colorsInterpolators.js'
import COLORS from './colors.js'
import Vue from 'vue'
export default {
  uncleCountChart: {
    title: 'uncles',
    subtitle: '25 blocks per bar',
    options: {
      // colorInterpol: blues
      colors: [COLORS.blue, COLORS.green]
    }
  },
  lastBlocksTime: {
    title: 'blocks time',
    entity: 'blocksChart',
    options: {
      formatY: (y) => { return Math.floor(y) + 's' }
    }
  },
  difficultyChart: {
    title: 'difficulty',
    entity: 'totalDiff'
  },
  lastGasLimit: {
    entity: 'gasLimit'
  },
  gasSpending: {
    title: 'gas spending',
    options: {
      colors: [COLORS.red, COLORS.orange, COLORS.green, COLORS.green],
      formatY: (y) => { return Vue.filter('locale')(y) }
    }
  },
  transactionDensity: {
    title: 'transaction density',
    options: {
      line: true,
      curve: {
        style: {
          stroke: COLORS.red
        }
      },
      bars: false,
      colors: [COLORS.orange]
    }
  },
  blockPropagationChart: {
    title: 'block propagation',
    options: {
      colors: [COLORS.green, COLORS.red],
      axis: {
        linesY: false
      },
      curve: {
        type: 'Cardinal',
        style: {
          stroke: COLORS.yellow,
          'stroke-width': '2px'
        }
      },
      getX: (d) => {
        return d.x
      },
      getY: (d) => {
        return d.y
      },
      formatLabel: (bar) => {
        let label = []
        let d = bar.d
        if (d) {
          label = [
            (d.x / 1000) + 's - ' + ((d.x + d.dx) / 1000) + 's',
            'Percent: ' + Math.round(d.y * 100) + '%',
            'Frequency: ' + d.frequency,
            'Cumulative: ' + Math.round(d.cumpercent * 100) + '%'
          ]
        }
        return label
      }
    }
  }
}

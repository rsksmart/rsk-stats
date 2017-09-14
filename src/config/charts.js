import COLORS from './colors.js'
import Vue from 'vue'
export default {
  uncleCountChart: {
    title: 'uncles',
    subtitle: '25 blocks per bar',
    options: {
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
    entity: 'totalDiff',
    options: {
      curveBack: {
        close: true,
        gradient: {
          stroke: false,
          fill: true
        }
      },
      curve: {
        type: 'Cardinal',
        close: false,
        gradient: {
          stroke: true,
          fill: false
        }
      },
      bars: false
    }
  },
  lastGasLimit: {
    entity: 'gasLimit'
  },
  gasSpending: {
    title: 'gas spending',
    options: {
      colors: [COLORS.red, COLORS.orange, COLORS.green, COLORS.green],
      formatY: (y) => { return Vue.filter('locale')(y) },
      bars: false,
      curve: {
        type: 'Cardinal',
        gradient: {
          fill: false,
          stroke: true
        }
      },
      curveBack: {
        close: true,
        gradient: {
          fill: true,
          stroke: true
        }
      }
    }
  },
  curveBack: {
    gradient: {
      stroke: true,
      fill: false
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
  nodeChart: {
    title: 'node history',
    entity: 'propTime'
  },
  nodeChart2: {
    title: 'node history',
    entity: 'propTime',
    options: {
      bars: false,
      curve: {
        gradient: {
          stroke: true,
          fill: false
        }
      }
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

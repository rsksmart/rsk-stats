/* eslint-disable no-trailing-spaces */
/*
  Thresholds definitions
  
  - colors: { value : color } | [ { value:'', color:''} ] 
  
  - firstColor
  - lastColor
     For out of range values, firstColor overrides lastColor
  
  - type: String | Function
    String: name of d3 scale function ex: Linear, Ordinal etc
    Function: color callback ->
    Default: Linear
    NOTE: Linear Scale requires 3 values
  
  - filters: String| Array:  Filter/s to apply before select color
  
  - interpolator: interpolator name, see colorsInterpolators.js, 
      this prop overrides type to 'interpolated'
*/
import COLORS from './colors.json'
import { SI } from '../lib/js/units.js'
import { valueToColor, thMap } from '../lib/js/colors.js'

const definitions = {
  time: {
    colors: {
      1: 'red',
      75: 'yellow',
      90: 'green',
      100: 'green'
    }
  },
  propagation: {
    colors: {
      0: 'gray',
      1: 'green',
      1000: 'yellow',
      3000: 'orange',
      7000: 'red',
      8000: 'red'
    }
  },
  latency: {
    colors: {
      0: 'gray',
      1: 'green',
      100: 'green',
      200: 'yellow',
      1000: 'orange',
      1500: 'red'
    }
  },
  lastBlock: {
    type: 'Threshold',
    lastColor: 'red',
    colors: {
      0: 'green',
      1: 'green',
      2: 'yellow',
      4: 'orange',
      5: 'red'
    }
  },
  blockTime: {
    filters: 'm-to-seconds',
    type: 'Quantile',
    colors: {
      0: 'green',
      50: 'yellow',
      70: 'orange',
      90: 'red'
    }
  },
  avgBlockTime: {
    filters: 'm-to-seconds',
    colors: {
      0: 'green',
      30: 'green',
      90: 'red'
    }
  },
  hashes: {
    type: 'Quantile',
    colors: [
      { value: SI.M, color: 'red' },
      { value: SI.G, color: 'orange' },
      { value: SI.T, color: 'yellow' },
      { value: SI.P, color: 'green' }
    ]
  },
  hashrateBtc: {
    colors: {
      0: 'red',
      1: 'green',
      100: 'green'
    }
  },
  yesNo: {
    filters: 'to-int',
    type: valueToColor,
    colors: {
      0: 'gray',
      1: 'green'
    }
  },
  yesGreenNoRed: {
    filters: 'to-int',
    type: valueToColor,
    colors: {
      0: 'red',
      1: 'green'
    }
  }
}

export const status = {
  gray: 0,
  green: 1,
  blue: 2,
  yellow: 3,
  orange: 4,
  red: 5
}

export const thresholds = thMap(definitions, COLORS)

/* eslint-disable no-trailing-spaces */
/*
  Thresholds definitions
  
  - colors: { value : color }
  
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
import COLORS from './colors.js'
import { valueToColor } from '../lib/js/colors.js'
// import { redGreen } from './colorsInterpolators.js'
export default {
  time: {
    colors: {
      0: COLORS.green,
      75: COLORS.red,
      90: COLORS.green
    }
  },
  propagation: {
    colors: {
      0: COLORS.gray,
      1: COLORS.green,
      1000: COLORS.yellow,
      3000: COLORS.orange,
      7000: COLORS.red
    }
  },
  latency: {
    colors: {
      0: COLORS.gray,
      1: COLORS.green,
      100: COLORS.green,
      200: COLORS.yellow,
      1000: COLORS.orange,
      1500: COLORS.red
    }
  },
  lastBlock: {
    type: 'Threshold',
    lastColor: COLORS.red,
    colors: {
      0: COLORS.green,
      1: COLORS.green,
      2: COLORS.yellow,
      5: COLORS.red
    }
  },
  blockTime: {
    filters: 'm-to-seconds',
    type: 'Quantize',
    colors: {
      0: COLORS.green,
      50: COLORS.yellow,
      70: COLORS.orange,
      90: COLORS.red
    }
  },
  avgBlockTime: {
    filters: 'm-to-seconds',
    colors: {
      0: COLORS.green,
      30: COLORS.green,
      90: COLORS.red
    }
  },
  hashes: {
    filters: 'numerals-suffix',
    type: valueToColor,
    colors: {
      P: COLORS.green,
      T: COLORS.yellow,
      G: COLORS.orange,
      M: COLORS.red
    }
  },
  yesNo: {
    filters: 'to-int',
    type: valueToColor,
    colors: {
      0: COLORS.gray,
      1: COLORS.green
    }
  },
  yesGreenNoRed: {
    filters: 'to-int',
    type: valueToColor,
    colors: {
      0: COLORS.red,
      1: COLORS.green
    }
  }
}

/*
  Thresholds definitions
  colors: { value : color }
  type: linear | sequential
  interpolator: interpolator name, see colorsInterpolators.js, this prop overrides type to 'interpolated'
*/
import COLORS from './colors.js'
export default {
  time: {
    colors: {
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
      500: COLORS.yellow,
      1000: COLORS.orange,
      1500: COLORS.red
    }
  }
}

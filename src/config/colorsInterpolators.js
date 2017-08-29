import * as d3interpolate from 'd3-interpolate'
import * as d3Chromatic from 'd3-scale-chromatic'
const d3 = Object.assign({}, d3interpolate, d3Chromatic)

export const blues = d3.interpolateBlues
export const redGreen = d3.interpolateRdYlGn

export default { blues, redGreen }

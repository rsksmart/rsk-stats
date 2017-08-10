import * as d3interpolate from 'd3-interpolate'
import * as d3Chromatic from 'd3-scale-chromatic'
const d3 = Object.assign({}, d3interpolate, d3Chromatic)
/*      let colors = d3.scaleLinear()
        .domain([1000, 3000, 7000, 10000])
        .range(['#7bcc3a', '#FFD162', '#ff8a00', '#F74B4B']) */
export const blues = d3.interpolateBlues
export const redGreen = d3.interpolateRdYlGn

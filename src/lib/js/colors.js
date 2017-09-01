import * as d3array from 'd3-array'
import * as d3scale from 'd3-scale'
const d3 = Object.assign({}, d3array, d3scale)

export const mapColor = (domain, range, type) => {
  let cf
  switch (type) {
    case 'fixed':
      cf = d3.scaleQuantize()
        .domain(domain)
        .range(range)
      break
    default:
      cf = d3.scaleLinear()
        .domain(domain)
        .range(range)
      break
  }
  return cf
}

export const interpolColor = (domain, interpolator) => {
  return d3.scaleSequential()
    .interpolator(interpolator)
    .domain(domain)
}

export const arrMax = (data) => {
  return d3.max(data)
}

export const arrMin = (data) => {
  return d3.min(data)
}

export const arrMinMaxRange = (arr, min, max) => {
  if (undefined !== min) arr.unshift(min)
  if (undefined !== max) arr.push(max)
  return arr
}

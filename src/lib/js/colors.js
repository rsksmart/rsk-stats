import * as d3array from 'd3-array'
import * as d3scale from 'd3-scale'
const d3 = Object.assign({}, d3array, d3scale)

export const mapColor = (domain, range, type) => {
  let cf
  let name = (type) ? 'scale' + type : null
  if (name) {
    if (d3[name]) {
      cf = d3[name]
    } else {
      console.info('Unknown scale ' + name + ' see colors.js')
    }
  }
  cf = cf || d3.scaleLinear
  cf = cf()
    .domain(domain)
    .range(range)
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

export const valueToColor = (colors, value, defValue) => {
  if (Array.isArray(colors)) {
    let color = colors.find((c) => {
      return c.value === value
    })
    return (color) ? color.color : colors[0].color
  } else {
    return colors[value] || defValue || colors[0]
  }
}

export const thColors = (threshold) => {
  let colors = threshold.colors
  let type = threshold.type
  let defValue = threshold.firstColor || threshold.lastColor
  if (typeof (type) === 'function') {
    return (value) => { return type(colors, value, defValue) }
  }
  // defines domain and range
  let domain, range
  // array format
  if (Array.isArray(colors)) {
    domain = colors.map((v) => { return v.value })
    range = colors.map((v) => { return v.color })
  } else { // object format
    domain = Object.keys(colors).map((v) => { return parseInt(v) })
    range = Object.values(colors)
  }
  let interpolator = threshold.interpolator
  if (interpolator) {
    return interpolColor(domain, interpolator)
  } else {
    if (threshold.firstColor) range.unshift(threshold.firstColor)
    else if (threshold.lastColor) range.push(threshold.lastColor)

    return mapColor(domain, range, type)
  }
}

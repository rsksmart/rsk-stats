import Vue from 'vue'
import * as d3format from 'd3-format'
const d3 = Object.assign({}, d3format)

export const numerals = Vue.filter('numerals', (num, fixed) => {
  num = Number(num)
  if (!fixed) fixed = 1
  fixed++
  let prefix = d3.format('.' + fixed + 's')
  return prefix(num)
})

export const percent = Vue.filter('percent', (value) => {
  return parseInt(value) + '%'
})


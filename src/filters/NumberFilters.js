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

export const numeralsSuffix = Vue.filter('numerals-suffix', (num) => {
  let value = numerals(num)
  return value.replace(/\d/g, '').replace(/\./g, '')
})

export const percent = Vue.filter('percent', (value) => {
  return parseInt(value) + '%'
})

export const toInt = Vue.filter('to-int', (value) => {
  value = value || 0
  if (value === true) value = 1
  return parseInt(value)
})

export const locale = Vue.filter('locale', (value) => {
  let format = d3.format(',')
  return format(value)
})

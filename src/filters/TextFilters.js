import Vue from 'vue'

export const nodeType = Vue.filter('node-type', (text) => {
  if (text) return text.replace(/\//g, ' ')
})

export const yesNo = Vue.filter('yes-no', (value) => {
  return (value) ? 'yes' : 'no'
})

export const hashTrim = Vue.filter('hash-trim', (value, len) => {
  len = len || 8
  return value.slice(0, len) + '...' + value.slice(-len)
})

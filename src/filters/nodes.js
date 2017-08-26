import Vue from 'vue'

export const nodeFilter = Vue.filter('node-filter', (node) => {
  node = addInactive(node, '_cssClass')
  node = addInactive(node, '_labelClass')
  return node
})

const addInactive = (node, className) => {
  let cssClass = node[className] || ''
  if (!node.stats.active) cssClass += ' inactive'
  node[className] = cssClass
  return node
}

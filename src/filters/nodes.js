import Vue from 'vue'

export const nodeFilter = Vue.filter('node-filter', (node) => {
  node = addClasses(node, '_cssClass')
  node = addClasses(node, '_labelClass')
  return node
})

const addClasses = (node, className) => {
  let cssClass = node[className] || ''
  if (!node.stats.active) cssClass += ' inactive'
  // if (node.stats.mining) cssClass += ' is-mining'
  node[className] = cssClass
  return node
}


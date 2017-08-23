import Vue from 'vue'

export const nodeType = Vue.filter('node-type', (text) => {
  return text.replace(/\//g, ' ')
})

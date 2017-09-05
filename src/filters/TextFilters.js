import Vue from 'vue'

export const nodeType = Vue.filter('node-type', (text) => {
  return text.replace(/\//g, ' ')
})

export const yesNo = Vue.filter('yes-no', (value) => {
  return (value) ? 'yes' : 'no'
})

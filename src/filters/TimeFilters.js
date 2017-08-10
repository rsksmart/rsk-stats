import Vue from 'vue'
import * as moment from 'moment'

export const secondsAgo = Vue.filter('seconds-ago', (timestamp) => {
  let time = moment(timestamp).format('s')
  if (time > 60) {
    time = moment.duration(time).humanize()
  }
  return time
})

export const sSeconds = Vue.filter('sSeconds', (time) => {
  if (time < 60) return parseFloat(time).toFixed(2) + ' s'
  return moment.duration(Math.round(time), 's').humanize()
})

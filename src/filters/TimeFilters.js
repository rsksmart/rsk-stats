import Vue from 'vue'
import * as moment from 'moment'

export const tSecondsAgo = Vue.filter('t-seconds-ago', (timestamp) => {
  let time = moment(timestamp).format('s')
  return sAgo(time)
})

export const mSecondsAgo = Vue.filter('m-seconds-ago', (miliseconds) => {
  let seconds = Math.floor(miliseconds / 1000)
  seconds = (seconds >= 0) ? seconds : 0
  return sAgo(seconds)
})

const sAgo = (time) => {
  if (time > 60) {
    time = moment.duration(time, 'seconds').humanize()
  } else {
    time += 's'
  }
  return time
}

export const sSeconds = Vue.filter('s-seconds', (time) => {
  if (time < 60) return parseFloat(time).toFixed(2) + ' s'
  return moment.duration(Math.round(time), 's').humanize()
})

export const dateFromTs = Vue.filter('date-from-ts', (timestamp) => {
  timestamp = Number(timestamp)
  let date = new Date(timestamp)
  let datetime = date.getDate() + '/' +
    (date.getMonth() + 1) + '/' +
    date.getFullYear() + '-' +
    date.getHours() + ':' +
    date.getMinutes() + ':' +
    date.getSeconds()
  return datetime
})

export const miliseconds = Vue.filter('miliseconds', (time) => {
  time = parseInt(time)
  if (time === 0) return time
  if (time < 1000) return time + ' ms'
  let seconds = Math.floor(time / 1000)
  return sAgo(seconds)
})

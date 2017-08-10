<template lang="pug">
  .main-data
    .big-data
      .bd-icon
        span.icon-cube
      .bd-main
        .bd-title Best avgBlock
        .bd-data {{totals.bestBlock}}


    ul
      li best block {{totals.bestBlock}}
      li uncles {{totals.bestStats.block.uncles.length}}  /{{ totals.uncleCount }}
      li last block {{ lastBlock | seconds-ago }}s ago
      li avg block time {{ totals.avgBlockTime | s-seconds }}
      li avg net hash rate {{totals.avgHashrate | numerals(3) }}H/s
      li difficulty {{totals.lastDifficulty | numerals }}
</template>
<script>
/* eslint-disable no-unused-vars */
import { mapState } from 'vuex'
import { secondsAgo, sSeconds } from '../filters/TimeFilters.js'
import { Numerals } from '../filters/NumberFilters.js'
export default {
  name: 'Totals',
  filters: {
    secondsAgo,
    sSeconds,
    Numerals
  },
  data () {
    return {
      now: Date.now()
    }
  },
  created () {
    let vm = this
    setInterval(() => {
      vm.now = Date.now()
    }, 1000)
  },
  computed: {
    ...mapState({
      totals: state => state.totals
    }),
    lastBlock () {
      return this.now - this.totals.lastBlock
    }
  }
}
</script>
<style lang="stylus">
@import '../lib/styl/vars.styl'
  .main-data
    width: 100%

.big-data
  color: $midlight
  // border: red solid 1px
  display: block
  min-width: 100%
  min-height: 7em
  .bd-icon
    font-size: 5em 
    width: 1em
    min-height: 100%
    height: 100%
    display: inline-block
    padding: 0 .25em
    // border: white solid 1px
   .bd-main
    width: auto
    display: inline-block
    // border: blue solid 1px
    .bd-data
      font-size: 3em
</style>

<template lang="pug">
  .node-chart
    d3-bar-chart(:data='data' :options='opts')
</template>
<script>
import D3BarChart from 'vue-d3-barchart'
// import D3BarChart from './vue-d3-barchart.vue'
import { redGreen } from '../config/colorsInterpolators.js'
export default {
  name: 'node-chart',
  components: {
    D3BarChart
  },
  props: ['data', 'options'],
  data () {
    return {
      opts: {
        colorInterpol: redGreen,
        yUnits: 'ms',
        padding: 0.2
      }
    }
  },
  created () {
    if (this.options) {
      for (let op in this.options) {
        this.opts[op] = this.options[op]
      }
    }
  }
}
</script>
<style lang="stylus">
 @import '../lib/styl/vars.styl'
.node-chart
  background-color: $darkness
  padding: .25em
.d3-bar-chart
  max-height: 100%
  max-width 100%
  svg
    width 100%
    overflow: visible 
</style>


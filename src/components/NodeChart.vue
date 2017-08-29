<template lang="pug">
  .node-chart
    d3-bar-chart(:data='data' :options='options')
</template>
<script>
import D3BarChart from 'vue-d3-barchart'
import { redGreen } from '../config/colorsInterpolators.js'
export default {
  name: 'node-chart',
  components: {
    D3BarChart
  },
  props: ['data'],
  data () {
    return {
      options: {
        colorInterpol: redGreen,
        yUnits: 'ms',
        padding: 0.2
      }
    }
  }
}
</script>
<style lang="stylus">
 @import '../lib/styl/vars.styl'
.node-chart
  background-color: $darkness
  height: 50px
  padding: .25em
</style>


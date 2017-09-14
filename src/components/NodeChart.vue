<template lang="pug">
  .node-chart
    d3-bar-chart(:data='data' :options='chart.options')
</template>
<script>
import { mapGetters } from 'vuex'
import D3BarChart from 'vue-d3-barchart'
export default {
  name: 'node-chart',
  components: {
    D3BarChart
  },
  props: ['data', 'name'],
  data () {
    return {
      chartName: 'nodeChart',
      chart: {},
      opts: {}
    }
  },
  created () {
    if (this.name) this.chartName = this.name
    this.chart = this.getChart()(this.chartName, this.data)
  },
  methods: {
    ...mapGetters('app/charts', [
      'getChart'
    ])
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


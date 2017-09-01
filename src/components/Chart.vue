<template lang="pug">
  .chart.dark-chart
      h3.chart-title {{chart.title}}
      .chart-cointainer
        d3-bar-chart(:data='chart.data' :options='chartOptions')
</template>
<script>
import D3BarChart from 'vue-d3-barchart'
import { mapGetters } from 'vuex'
export default {
  name: 'chart',
  components: {
    D3BarChart
  },
  props: ['name', 'width', 'height'],
  data () {
    return {
      size: {
        w: 0,
        h: 0
      }
    }
  },
  mounted () {
    this.onResize()
    window.addEventListener('resize', this.onResize)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResize)
  },
  computed: {
    chart () {
      return this.getChart()(this.name)
    },
    chartStyle () {
      return { width: this.w + 'px', height: this.h + 'px' }
    },
    chartOptions () {
      let size = { w: this.size.w, h: this.size.h }
      return Object.assign({ size }, this.chart.options)
    }
  },
  methods: {
    ...mapGetters('app/charts', [
      'getChart'
    ]),
    onResize () {
      this.size.w = this.$el.clientWidth
      this.size.h = this.size.w / 4
    }
  }
}
</script>
<style lang="stylus">
  @import '../lib/styl/vars.styl'
  .chart
    margin-top: 1em
    position:relative
    
  .chart-title
    font-weight:normal
    margin-left: 2em
    font-size: 1em
 
  button.max
    position:absolute
    top: 1em
    right :1em
    z-index: 50
    pointer-events: initial
    &:hover
      color: $color2
    
    .dialog
      position:absolute
      z-index:999
      left:0
      top:0
      min-width: 100%  

</style>


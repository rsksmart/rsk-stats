<template lang="pug">
  .chart.dark-chart(v-if='chart' :class='(max)?"max-chart":""')
      .header
        slot(name='header')
      h3.chart-title {{ chart.title }}
        small.gray &nbsp;{{chart.subtitle}}
      .chart-cointainer
        .chart-content
          d3-bar-chart(:data='chart.data' :options='chartOptions')
      slot
</template>
<script>
// import D3BarChart from 'vue-d3-barchart'
import D3BarChart from './vue-d3-barchart.vue'
import { mapGetters } from 'vuex'
export default {
  name: 'chart',
  components: {
    D3BarChart
  },
  props: ['name', 'width', 'height', 'max'],
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
      let options = Object.assign({ size }, this.chart.options)
      options.points = false
      options.labels = null
      options.rulers = false
      /*       if (this.max) {
              options.rulers = true
              options.axis = true
              options.labels = { y: true, x: false }
            } */
      return options
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
@import '../lib/styl/mixins.styl'
  .chart .header button
    position absolute
    right: 0
    z-index 10
  .chart-title
    small-titles()
    margin-left 2em
    margin-bottom .5em

  .chart.max-chart-xxx
      display flex
      flex-direction column
      padding 3em
    .bar-chart
      max-width 70%
      flex-shrink 1
      display inline-block
      float: left
</style>

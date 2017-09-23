<template lang="pug">
  .chart.dark-chart(v-if='chart' :class='(max)?"max-chart":"mini-chart"')
      .header
        slot(name='header')
      .chart-title-cont
        h3.chart-title {{ chart.title }}
          small.gray &nbsp;{{chart.subtitle}}
      .chart-container
        d3-bar-chart(:data='chart.data' :options='chartOptions')
      slot
</template>
<script>
import D3BarChart from 'vue-d3-barchart'
import { mapGetters } from 'vuex'
export default {
  name: 'chart',
  components: {
    D3BarChart
  },
  props: ['name', 'xsize', 'max'],
  data () {
    return {
      size: {
        w: 0,
        h: 0
      }
    }
  },
  watch: {
    xsize (newValue) {
      this.onResize()
    }
  },
  mounted () {
    this.onResize()
  },
  computed: {
    ...mapGetters({ appSize: 'getSize' }),
    chart () {
      if (this.name) return this.getChart()(this.name)
    },
    chartStyle () {
      return { width: this.w + 'px', height: this.h + 'px' }
    },
    chartOptions () {
      let size = { w: this.size.w, h: this.size.h }
      let options = Object.assign({ size }, this.chart.options)
      options.margin = 10
      if (!options.formatLabel) options.formatLabel = this.formatLabel
      if (this.max) {
        let w = this.appSize.w / 2.2
        options.size = { w, h: w / 4 }
        options.fontSize = 12
        options.margin = 20
        if (!options.axis) {
          options.axis = {
            valuesY: true,
            linesY: true
          }
        }
      }
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
    },
    formatLabel (bar, formatX, formatY) {
      return [
        formatY(bar.yv)
      ]
    }
  }
}
</script>
<style src="vue-d3-barchart/dist/vue-d3-barchart.css"></style>
<style lang="stylus">
@import '../lib/styl/vars.styl'
@import '../lib/styl/mixins.styl'
  .chart-container
    display flex
    justify-content space-around
  .chart .header button
    position absolute
    right: 0
    z-index 10
  .chart-title
    small-titles()
    margin-left 2em
    margin-bottom .5em

  // .chart.max-chart 

</style>

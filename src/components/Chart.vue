<template lang="pug">
  .chart(:class='style' @keydown.esc='close')
      button.max(v-if='data.length && !maximized' @click='max()')
        span.icon.icon-cube
      button.close(v-if='maximized' @click='close')
      h3.chart-title {{title}}
      .chart-cointainer(:style=' "height:" + size.h + "px"')
        d3-bar-chart(:data='data' :options='opts')
</template>
<script>
import D3BarChart from 'vue-d3-barchart'
import { mapState, mapActions } from 'vuex'
export default {
  name: 'bar-chart',
  components: {
    D3BarChart
  },
  props: ['title', 'chart', 'options', 'chartStyle', 'maximized'],
  data () {
    return {
      style: 'dark-chart',
      size: {
        w: 0,
        h: 0
      }
    }
  },
  created () {
    if (this.chartStyle) this.style = this.chartStyle
  },
  mounted () {
    this.onResize()
    window.addEventListener('resize', this.onResize)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResize)
  },
  computed: {
    ...mapState({
      charts: state => state.backendData.charts
    }),
    data () {
      return this.charts[this.chart]
    },
    opts () {
      let options = Object.assign({}, this.options)
      options.size = {}
      options.size.w = this.size.w
      options.size.h = this.size.h
      return options
    }
  },
  methods: {
    ...mapActions('app/', [
      'maximizeChart'
    ]),
    max () {
      let title = this.title
      let chart = this.chart
      let options = this.maxOptions()
      this.maximizeChart({ title, chart, options })
    },
    close () {
      this.maximizeChart(null)
    },
    maxOptions () {
      let options = Object.assign({}, this.opts)
      options.axis = false
      options.rulers = false
      options.labels = false
      return options
    },
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


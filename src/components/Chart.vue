<template>
  <div v-if="chart" class="chart">
    <div class="chart-title-cont">
      <h3 class="chart-title capitalize">
        {{ chart.title }} {{ chart.subtitle }}
      </h3>
    </div>
    <div class="chart-container" v-if="chart.data">
      <d3-bar-chart :data="chart.data" :options="chartOptions" />
    </div>
    <slot></slot>
  </div>
</template>

<script>
import D3BarChart from 'vue-d3-barchart'
import { mapState, mapGetters } from 'vuex'
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
    let vm = this
    this.$nextTick(() => {
      vm.onResize()
    })
  },
  computed: {
    ...mapState({
      breakpoints: state => state.mediaBreakpoints
    }),
    ...mapGetters({
      appSize: 'getSize'
    }),
    chart () {
      let { name, getChart } = this
      return (name) ? getChart()(name) : undefined
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
        let w = this.appSize.w / 1.2
        if (this.appSize.w > this.breakpoints.medium) w = this.appSize.w / 2.2
        options.size = { w, h: w / 4 }
        options.fontSize = 12
        options.margin = 20
        // axis defaults
        if (undefined === options.axis) {
          options.axis = {
            valuesY: true,
            linesY: true
          }
        }
      }
      const axis = {
        valuesY: false,
        linesY: true,
        linesX: true,
        valuesX: false
      }
      options = Object.assign({ axis }, options)
      return options
    }
  },
  methods: {
    ...mapGetters('app/charts', [
      'getChart'
    ]),
    onResize () {
      this.size.w = this.$el.clientWidth
      this.size.h = 100
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

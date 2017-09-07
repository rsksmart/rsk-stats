<template lang='pug'>
  .node-info(:style='styleObj')
    svg
      d3-bar-chart.node-mini-chart2(v-if='size > 24' :data='node.history' :options='chartOpts' :x='w /10 ' :y='h/4')
        icon(v-for='field,key in fields' :key='key'
          :name='entity[field].icon' 
          width="20" height="20"
          :style='iconStyle(entity[field],nodeEntity[field])')

  //-.node-info(:style='styleObj')
    .node-mini-chart(:style='chartStyle')
   
    //-.node-label(:style='labelStyle') {{node.name}}
    //-svg(:width='w' :height='h')
      circle(:r='circle.r' :cx='circle.cx' :cy='circle.cy')
    .emblem(v-for='field,key in fields' :key='key' :style='fieldStyle(key,iconSize)')
      icon(:name='entity[field].icon' :style='iconStyle(entity[field],nodeEntity[field])')
</template>
<script>
import { mapGetters } from 'vuex'
import EntityMixin from '../mixins/Entity'
import D3BarChart from 'vue-d3-barchart'
import { redGreen } from '../config/colorsInterpolators.js'
export default {
  name: 'noode-data',
  components: {
    D3BarChart
  },
  props: ['node', 'size'],
  mixins: [
    EntityMixin
  ],
  data () {
    return {
      width: 0,
      height: 0,
      padding: 1,
      rotation: 0,
      fields: ['lastBlockTime', 'propTime', 'avgPropTime']
    }
  },
  mounted () {
    this.width = this.size || this.$el.clientWidth
    this.height = this.size || this.$el.clientHeight
  },
  computed: {
    nodeEntity () {
      return this.createNodeEntity()(this.node.id)
    },
    chartOpts () {
      return {
        colorInterpol: redGreen,
        bars: false,
        points: false,
        padding: 0,
        size: {
          w: parseInt(this.w / 1.25),
          h: parseInt(this.h / 5)
        },
        gradient: {
          stroke: true
        },
        curve: {
          type: ''
        }
      }
    },
    w () {
      return (this.size || this.width) * this.padding
    },
    h () {
      return (this.size || this.height) * this.padding
    },
    iconSize () {
      return this.size / 5
    },
    styleObj () {
      let width = this.w
      let height = this.h
      let left = this.node.x - width / 2 + 'px'
      let top = this.node.y - height / 2 + 'px'
      width += 'px'
      height += 'px'
      return { left, top, width, height }
    },
    labelStyle () {
      return {
        top: this.pos(90)
      }
    },
    circle () {
      let cx = this.w / 2
      let cy = this.h / 2
      let r = this.w / 2
      return { r, cx, cy }
    },
    chartStyle () {
      let style = {}
      style.height = parseInt(this.size / 2)
      return style
    }
  },
  methods: {
    ...mapGetters('app/entity', [
      'thresholdColors',
      'createNodeEntity'
    ]),
    iconStyle (entity, value) {
      let cf = this.thresholdColors()(entity.threshold)
      let fill = (cf) ? cf(value) : ''
      return { fill }
    },
    pos (deg) {
      deg = deg || 0
      let r = this.w / 2
      let x = Math.sin(deg) * r
      let y = Math.cos(deg) * r
      return { x, y, r }
    },
    fieldStyle (key, size) {
      let s = { width: size, height: size }
      let style = {}
      let deg = 2 * Math.PI / this.fields.length * key + this.rotation
      let pos = this.pos(deg)
      let r = pos.r - (size / 2)
      s.top = pos.y + r
      s.left = pos.x + r
      for (let p in s) {
        style[p] = s[p] + 'px'
      }
      return style
    }
  }
}
</script>
<style lang='stylus'>
 @import '../lib/styl/vars.styl'
.node-info
  // border: yellow solid 1px
  position: absolute
  pointer-events: none
  z-index: 50

.container
  position relative
  min-width: 100%
  min-height: 100%

svg.emblem 
  max-width: 20%

svg.node-mini-chart 
  pointer-events: none
  opacity: .8
  path 
    stroke-width: 2px
    stroke-linejoin: miter
    opacity: .9
</style>

<template lang='pug'>
  .node-info(:style='styleObj')
    .node-info-data

      //- NO Syncing
      //-template(v-if='!isSync')

    svg(:width='w' :height='h' :viewBox='viewBox')
      defs
        filter#blur
          feGaussianBlur(in="SourceGraphic" stdDeviation="3")

      //-Block Time
      template(v-if='isDelayed')
        ellipse.over-node.time(:cx='cx' :cy='cy * .95' rx='30%' ry='13%' :stroke-width='4' fill='none' stroke='white')
        ellipse.over-node.time(:cx='cx' :cy='cy * .95' rx='30%' ry='13%' :stroke-width='2' fill='none' :stroke='isDelayed.color')
        g.delayed(transform="skewY(20) rotate(-5)")
          text(:fill='isDelayed.color' y='42%' x='21%' text-anchor="right" :font-size='fS') {{isDelayed.fvalue}}
          //-svg.time(:width='cS' :height='cS' :y='size/1.4 -cS / 2' :x='size')
            //-icon(name='ethereum' :color='isDelayed.color')

      g(v-if='isTrans' transform="skewY(-20) rotate(5)")
        //-svg(:width='w' :height='h' :viewBox='viewBox')
          icon.icon(:name='isTrans.entity.icon' :scale='0.1')
        text.trans-value(y='70%' x='98%' text-anchor="right" :font-size='fS') {{ isTrans.value }}

      //-Cubes
      template(v-if='isLow && isLow.value > 0')
        cube-of-cubes.cubes(:size='cS*2' :mod='cubeMod' :step='cubeStep(isLow.value)' :color='isLow.color' :x='cx' :y='cubC' )
        text(:fill='isLow.color' :font-size='fS' x='50%' :y='cubC * .5' text-anchor="middle") {{isLow.fvalue}}

      //- Last Block
      ellipse.cube-shadow(:cx='block.sh.x' :cy='block.sh.y' :rx='block.sh.w' :ry='block.sh.h' filter="url(#blur)" :key='"ELLIPSE_" + node.stats.block.number' )
      svg-cube.block-cube(:x='block.x' :y='block.y' :size='block.s' :key='"CUBE_" + node.stats.block.number')

      //-Debug squareF
    //-svg(:width='w' :height='h' :viewBox='viewBox')
      rect(x='0' y='0' width='100%' height='100%' stroke='red' fill='none')
      //-circle(r='2' :cx='cx' :cy='cy' fill='red')

</template>
<script>
import { mapGetters } from 'vuex'
import EntityMixin from '../mixins/Entity'
import SvgCube from './SvgCube.vue'
import CubeOfCubes from './CubeOfCubes.vue'
import COLORS from '../config/colors.json'
export default {
  name: 'noode-data',
  props: ['node', 'size'],
  components: {
    SvgCube,
    CubeOfCubes
  },
  mixins: [
    EntityMixin
  ],
  data () {
    return {
      width: 0,
      height: 0,
      padding: 1,
      rotation: 0,
      blockCubes: 4,
      lineCubes: 27,
      cubeMod: 3,
      newBlock: {
        color: COLORS.green
      },
      fields: {
        time: 'lastBlockTime',
        diff: 'lastBlockDifference',
        last: 'lastBlock',
        trans: 'pending'
      }
    }
  },
  mounted () {
    this.width = this.size || this.$el.clientWidth
    this.height = this.size || this.$el.clientHeight
  },
  computed: {
    block () {
      let h = this.h
      let s = this.size / 15
      let sh = {}
      let x = this.size / 2
      let y = (h / 2.2) + (s / 4)
      sh.x = x - (s * 2)
      sh.y = y + (s / 2)
      sh.w = s / 1.25
      sh.h = s / 3
      return { x, y, s, sh }
    },
    nodeEntity () {
      return this.createNodeEntity()(this.node.id)
    },
    cubeMax () {
      return Math.pow(this.cubeMod, 3)
    },
    viewBox () {
      return [0, 0, this.w, this.h].join(' ')
    },
    w () {
      return (this.size || this.width) * this.padding
    },
    h () {
      return (this.size || this.height) * this.padding
    },
    cx () {
      return this.w / 2
    },
    cy () {
      return this.h / 2.2
    },
    cS () {
      return this.size / 6
    },
    fS () {
      return this.cS / 2
    },
    eS () {
      return this.size / 3
    },
    cubC () {
      return this.cy - (this.cS / 2) - this.size / 25
    },
    sW () {
      return this.size / 35
    },
    bCubes () {
      let total = this.blockCubes - 1
      let cubes = []
      let cS = this.cS
      for (let i = 1; i <= total; i++) {
        let w = Math.round(cS / (1 + 0.15 * i))
        let y = Math.round(this.cubC - cS / (1 + 0.15 * i) * (i - 1))
        cubes.push({ w, y })
      }
      return cubes
    },
    cubeLine () {
      let total = this.lineCubes - 1
      let cubes = []
      let cS = this.size / (this.lineCubes + 1)
      let h = this.h
      for (let i = 1; i <= total; i++) {
        // let x = cS * 1.5 + (cS * 0.8) * i
        let x = cS * 2 + (cS * 0.8) * i
        let y = (h / 4) + (cS / 4) * i
        cubes.push({ x, y, s: cS })
      }
      return cubes
    },
    iconSize () {
      return this.size / 5
    },
    isActive () {
      return this.node.stats.active
    },
    isSync () {
      let sync = this.node.stats.syncing !== false
      return sync && this.isActive
    },
    isLow () {
      return this.fieldObj('diff', 0)
    },
    isDelayed () {
      return this.fieldObj('time', 2)
    },
    isTrans () {
      let trans = this.fieldObj('trans', 2)
      return (trans.value > 0) ? trans : null
    },
    timeStatus () {
      let status = this.status(this.fields.time)
      return (status) ? status.number : undefined
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
      'createNodeEntity',
      'getTotalEntity'
    ]),
    status (field) {
      let node = this.nodeEntity[field]
      let entity = this.entity[field]
      if (entity) return entity.status(node, this.nodeEntity)
    },
    statusNumber (f) {
      let status = this.status(this.fields[f])
      if (status) return status.number
    },
    iconStyle (entity, value) {
      let cf = this.thresholdColors()(entity.threshold)
      let fill = (cf) ? cf(value) : ''
      return { fill }
    },
    cubeStep (val) {
      return (val <= this.cubeMax) ? val : this.cubeMax
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
    },
    fVal (f) {
      let field = this.fields[f]
      return this.nodeEntity[field]
    },
    entVal (f) {
      let val = this.fVal(f)
      let entity = this.entity[this.fields[f]]
      return entity.formatValue(val, false, true)
    },
    fieldObj (f, level) {
      let field = this.fields[f]
      let entity = this.entity[field]
      let fields = this.nodeEntity
      let value = fields[field]
      if (!entity.status) {
        return { value, entity }
      }
      let fvalue = entity.formatValue(value, false, true)
      let status = entity.status(value, fields)
      if (level < status.number) {
        let color = entity.color(value, fields)
        return { value, fvalue, color, entity }
      }
      return null
    }
  }
}
</script>
<style lang='stylus'>

  .node-info
    box-sizing border-box
    position absolute
    pointer-events none
    user-select none

    .entity-value
      position absolute

    svg
      overflow visible
      position absolute

    svg.cube path
      stroke black
      // fill-opacity .9
      stroke-width 1
      stroke-opacity 0.25
      // stroke-dasharray 3

    .cubes
      .cube
        stroke $darkness
        stroke-width 0.5
        stroke-opacity 0.85

    .node-info-data
      width 100%
      height @width
      display flex
      position absolute
      top 0
      left 0
      justify-content center
      align-items center

    .over-node
      opacity 0.6

    .block-cube
      will-change opacity transform
      transform translate3d(0, 0, 0)
      fill $color
      opacity 1

      .cube
        transform translate3d(0, 0, 0)
        will-change opacity transform
        transform-origin center center
        animation bcube-anim 0.5s ease
        opacity 0

    .cube-shadow
      opacity 0
      fill alpha(black, 0.1)
      transform translate3d(0, 0, 0)
      will-chage transform opacity
      transform-origin center center
      animation cube-shadow-anim 0.5s ease

    @keyframes cube-shadow-anim
      0%
        opacity 0
        transform scale(0.1, 0.1)

      20%
        transform scale(0.1, 0.1)
        opacity 1

      90%
        opacity 1
        transform scale(1, 1)

      100%
        transform scale(0.1, 0.1)
        opacity 0

    $start = translate(-120%, -300%) scale(2, 2)
    $mid = translate(-120%, -200%) scale(1, 1)
    $end = translate(-120%, 0%) scale(1, 1)

    @keyframes bcube-anim
      0%
        opacity 0
        transform $start

      20%
        opacity 1
        transform $mid

      90%
        opacity 0.9
        transform $end

      100%
        transform $end
        opacity 0

    .block-cube-enter
      opacity 0

    .block-cube-enter-active
      transition all 2s ease-in
      opacity 1

    .trans-value
      fill $color
      // transform rotateY(20deg)

    .time
      will-change opacity
      animation etime 3s infinite

    @keyframes etime
      0%
        opacity 0.1

      50%
        opacity 0.8

      100%
        opacity 0.1
</style>

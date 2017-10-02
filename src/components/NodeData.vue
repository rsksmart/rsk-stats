<template lang='pug'>
  .node-info(:style='styleObj')
    //-svg(:width='size' :height='size')
      rect(x='0' y='0' :width='size' :height='size')
    .node-info-data
      
      //- NO Syncing
      //-template(v-if='!isSync')
        //-svg(:width='w' :height='h' xmlns="http://www.w3.org/2000/svg")
          svg-cube.block( v-for='i in 5' :x='cS *1.8+(cS * 0.8) * i' :y='(h/3)+ (cS / 4) * i' :size='cS' :color='"red"' )
          
        //-transition(name="block-number"  appear ) 
          //-block-number(:key='node.stats.block.number') {{node.stats.block.number}}
          
          svg-cube.block(:x='cx' :y='cubC' :size='cS / 2' :key='node.stats.block.number')
      //- IS Sync and low
      //-template(v-if='isSync && isLow')
        p syncing    
      
      //-p(v-if='isTrans') {{ isTrans.value }}
      
      //-svg(:width='w' :height='h' :viewBox='viewBox')
        //-Block Time
        ellipse.over-node.time(v-if='isDelayed' :cx='cx' :cy='cy * .86' :rx='eS / 1.2' :ry='eS/3' :stroke-width='sW' fill='none' :stroke='isDelayed.color')
      //- Block Difference
      
    //-transition(name="block-number"  appear ) 
      svg-cube.block(:x='cx' :y='cubC' :size='cS' :key='node.stats.block.number')
    //-svg-cube.block-cube(:x='block.x' :y='block.y' :size='block.s' :key='node.stats.block.number')
    svg(:width='w' :height='h')
      defs
        filter#shadow
          feDropShadow(dx='0' dy='1' stdDeviation='1')
      //-transition(name='block-cube' appear)
      //-Block Time
      //-ellipse.over-node.time(v-if='isDelayed' :cx='cx' :cy='cy * .93' :rx='eS / 1.2' :ry='eS/3' :stroke-width='1' fill='none' :stroke='isDelayed.color')
  
      //-text.trans-value(v-if='isTrans' :y='h/2' :x='w/2' text-anchor="middle" :font-size='cS/2') {{ isTrans.value }}
      template(v-if='isLow')
        template(v-if='isLow.value < blockCubes')
          svg-cube.diff-cube(v-for='i in isLow.value' :x='cx' :y='bCubes[i-1].y' :color='isLow.color' :size='bCubes[i-1].w' :key='i')
        template(v-else)
          svg-cube.diff-cube(:x='cx' :y='cubC' :color='isLow.color' :size='cS' :shadow='1')
          text(:fill='isLow.color' :font-size='cS / 2' x='50%' :y='cubC * .5' text-anchor="middle") {{isLow.fvalue}}
      svg-cube.block-cube(:x='block.x' :y='block.y' :size='block.s' :key='node.stats.block.number')
      //-Debug square
    //-svg(:width='w' :height='h' :viewBox='viewBox')
      rect(x='0' y='0' width='100%' height='100%' stroke='red' fill='none')
      //-circle(r='2' :cx='cx' :cy='cy' fill='red')

</template>
<script>
import { mapGetters } from 'vuex'
import EntityMixin from '../mixins/Entity'
import SvgCube from './SvgCube.vue'
import COLORS from '../config/colors.json'
export default {
  name: 'noode-data',
  props: ['node', 'size'],
  components: {
    SvgCube
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
      lineCubes: 8,
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
      let cS = this.cS / 1.2
      let x = cS * 4 + cS
      // let x = this.w / 2
      let y = (h / 2.2) + (cS / 4)
      return { x, y, s: cS }
    },
    nodeEntity () {
      return this.createNodeEntity()(this.node.id)
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
    /*     cubeLine () {
          let total = this.blockCubes - 1
          let cubes = []
          let cS = this.size / 8
          let h = this.h
          for (let i = 1; i <= total; i++) {
            let x = cS * 1.5 + (cS * 0.8) * i
            let y = (h / 3.1) + (cS / 4) * i
            cubes.push({ x, y })
          }
          return cubes
        }, */
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
      if (status) return status.number
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
 @import '../lib/styl/vars.styl'
.node-info
  box-sizing border-box
  position: absolute
  pointer-events: none
  user-select none
  .entity-value
    position absolute
  svg
    overflow visible
    position absolute
    
  svg.cube path 
    stroke black
    // fill-opacity .9
    stroke-width .5
    stroke-opacity 0.25
    // stroke-dasharray 3
  
  //ellipse.time
    //stroke-dasharray 1



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
  opacity .6

.block-number
  color: $color
  font-size .8em
  opacity 0
  transform: translate3d(0,0,0)
  will-change: transform, opacity
  path  
    fill none
    stroke $color !important
    stroke-width 1 !important
    stroke-opacity 1 !important
    stroke-dasharray 5
  

.block-number-enter-active
  transition all 1s ease
  opacity: 0
  transform: translateY(-5rem) scale(1.5,1.5)

.block-number-enter
  opacity:1
  transform: translateY(1rem) scale(0.1, 0.1)

.block-cube
  will-change: opacity transform
  transform: translate3d(0,0,0)
  fill $color
  opacity 1
  .cube
    transform: translate3d(0,0,0)
    will-change: opacity transform
    // animation bcube-anim .5s infinite
    animation bcube-anim .5s ease
    opacity 0


@keyframes bcube-anim
  0%
    opacity 0
    transform translate(50%,20%)
  10%
    opacity 1
      
  60%
    opacity 1
  90% 
    opacity 0  
  100%
    transform translate(-250%,-100%) 
    opacity 0   

@keyframes bcube-anim-xxx
  0%
    opacity 0
    transform translate(90%,90%) scale(.1,.1)
  50%
    opacity 1
    transform scale(2,2)
  100%
    opacity 0 
.block-cube-enter
  opacity 0

.block-cube-enter-active
  transition all 2s ease-in
  opacity 1

.trans-value
  fill: $dark
  // transform rotateY(20deg)

</style>

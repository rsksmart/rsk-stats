<template lang="pug">
  .watcher
      .header
        span.icon.icon-rsk
        span.node-title {{node.info.name}}
      ul.node-data 
        //-li 
          //-span.icon(:class='osIcons[node.info.os] || "icon-xxx"' :title="node.info.os") 
        //-li type: {{ node.info.node }}
        //- li is mining: {{ node.stats.mining }}
        
        //- UPTime
        li 
          .icon.icon-plug(title='uptime')
          .txt {{ node.stats.uptime | percent }}
        
        //- PEERS
        li 
          .icon.icon-server(title='peers')
          .txt {{ node.stats.peers }}
        
        //- PENDING TRANS
        li 
          .icon.icon-credit-card(title='pending trans')
          .txt {{ node.stats.pending }}
        
        //- UNCLES
        li 
          .icon.icon-git-merge(title='uncles')
          .txt {{node.stats.block.uncles.length || 0}}
        
        //- TRANS
        li
          .icon.icon-rocket(title='block trans')
          .txt {{node.stats.block.transactions.length || 0}}

        //- AVG PROPAGATION
        li
          .icon.icon-stopwatch(title='avg propagation time')
          .txt {{ node.stats.block.propagation }}  

        //- LAST BLOCK time
        li
          .icon.icon-cube(title='last block time')
          .txt {{ node.stats.block.received | seconds-ago }}
            small s ago

        //- LAST BLOCK
        li.double 
          .label last block: 
          .data {{ node.stats.block.number }}
        
        //- BEST BLOCK
        li.double 
          .label best block
          .data
            tool-tip(:value='node.stats.block.hash' trim='8' :options='{ trimend:true }')
        
        //- TOTAL Diff
        li.quad 
          .label Total diff 
          .data {{node.stats.block.totalDifficulty}}
            //-tool-tip(:value='node.stats.block.totalDifficulty' trim='8' trimend='true')

      //- CHART Node History 
      d3-bar-chart(:data='node.history' class="node-chart dark-chart" :options='chartOptions')

</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import D3BarChart from 'vue-d3-barchart'
import ToolTip from './ToolTip.vue'
import { redGreen } from '../lib/js/charts.js'
export default {
  name: 'node-watcher',
  components: {
    D3BarChart,
    ToolTip
  },
  props: ['dialog', 'index'],
  data () {
    return {
      width: 0,
      height: 0,
      chartOptions: {
        colorInterpol: redGreen,
        yUnits: 'ms'
      },
      wclass: 'fixed',
      offset: {
        x: 0,
        y: 0
      },
      left: 0,
      top: 0,
      drag: true
    }
  },
  created () {
    this.left = this.dialog.x
    this.top = this.dialog.y
  },
  mounted () {
    this.width = this.$el.clientWidth
    this.height = this.$el.clientHeight
    /*     this.updateNodeDialog([this.node.id, { w: this.width, h: this.height }])
          .then(this.setNodeDialogPos(this.index).then(() => {
            this.top = this.dialog.y
            this.left = this.dialog.x
          }
          )) */
  },
  watch: {
    dialog (newValue) {
      this.top = newValue.y
      this.left = newValue.x
    }
  },
  methods: {
    ...mapActions([
      'unSelectNode',
      'updateNodeDialog',
      'setNodeDialogPos'
    ]),
    close () {
      this.unSelectNode(this.node.id)
    },
    setDrag () {
      this.drag = !this.drag
    },
    dragStart (event) {
      let x = 0
      let y = 0
      event.target.style.opacity = 1
      x = this.left - event.clientX
      y = this.top - event.clientY
      this.offset = { x, y }
    },
    dragEnd (event) {
      this.left = event.clientX + this.offset.x
      this.top = event.clientY + this.offset.y
      this.wclass = 'free'
      this.updateNodeDialog([this.node.id, { x: this.left, y: this.top }])
    }
  },
  computed: {
    ...mapGetters({
      nodes: 'getNodes'
    }),
    node () {
      return this.nodes[this.dialog.id]
    }
  }
}
</script>
<style lang="stylus">
 @import '../lib/styl/vars.styl'
  
$btn-size = 1.5em

button.icon
  background-color: white
  border-style: none
  color: black
  font-size: 1em
  text-shadow: $txt-sh
  height: $btn-size
  width: $btn-size
  line-height: 1.25em
  border-radius: 50%
  padding:0
  margin:0
  box-shadow: none

button.icon:hover
  background-color: $color2

.mini
  font-size: 0.75em

.watcher
  width: auto
  max-width: 20em

  .node-dialog
    padding: .5em 1em 
    box-shadow: $box-sh
    border: $border
    border-radius: 0.2s5em
    background-color: $light
    color: $darkness
    box-shadow: $hard-sh
    position:relative

    .close
      position:absolute
      right: 0
      top: 0

.node-dialog.fixed
  border-color: $color2

 .header 
    display: table-cell
    vertical-align: middle
    .icon
       margin-right: .25em

  .icon 
    color:$color
    font-size: 2em

  .node-title
    color: $darknes

.node-chart
  height: 50px
  margin-top: 10px
  margin-bottom: 1em
  background-color: $darkness

$item-min = 6em 
$item-margin = .25em
.node-data
  font-size: 0.6em
  display: flex
  flex-direction: row
  flex-wrap: wrap
  list-style: none
  padding:  0 .125em
  li
    display: inline-block
    margin: $item-margin
    text-align: center
    //border: 1px dotted $color
    box-shadow: 1px 1px 0.5px rgba(0,0,0,.2)
    min-width: $item-min
    padding: 0.25em
    .icon
      font-size: 3em
      display: block
    .txt
      display: inline-block
      font-size: 2em

  li.double
    min-width: ($item-min * 2) + 4 * $item-margin 
    .label
      font-size: 1.5em
    .data
      font-size: 2em  
  li.quad
    min-width: ($item-min * 4) + 16 * $item-margin 
    .label
      font-size: 1.5em
     .data
        font-size: 1.5em 
      


</style>

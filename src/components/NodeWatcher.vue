<template lang="pug">
  .watcher
      //-.header
        .icon.icon-rsk.med
        .node-title.title {{node.info.name}}
      ul.node-data 
        li(v-for='ent in ["uptime","latency","peers","pending","uncles","blockTrans","propTime","avgPropTime","totalDiff"]')
          entity-icon(:entity='entity[ent]')
          entity-value.txt(:entity='entity[ent]' :value='fields[ent]')

        li
          entity-icon(:entity='entity.lastBlockTime')
          entity-value.txt(:entity='entity.lastBlockTime' :value='fields.lastBlockTime')

        li.double 
          .label {{ entity.lastBlock.title }}
          .data {{ fields.lastBlock }}
        
        li.quad 
          .label {{ entity.bestBlock.title }}
          .data
            tool-tip(:value='fields.bestBlock' trim='16' :options='{ trimend:true }')
        
        //- TOTAL Diff
        //-li.quad 
          .label {{entity.totalDiff.title}}
          .data {{fields.totalDiff}}
            //-tool-tip(:value='node.stats.block.totalDifficulty' trim='8' trimend='true')

      //- CHART Node History 
      node-chart.dark-chart(:data='node.history')

</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import NodeChart from './NodeChart.vue'
import ToolTip from './ToolTip.vue'
import EntityMixin from '../mixins/Entity.vue'
export default {
  name: 'node-watcher',
  mixins: [
    EntityMixin
  ],
  components: {
    NodeChart,
    ToolTip
  },
  props: ['dialog', 'index'],
  data () {
    return {
      width: 0,
      height: 0,
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
    ])
  },
  computed: {
    ...mapGetters({
      nodes: 'getNodes'
    }),
    ...mapGetters('app/entity', {
      entity: 'getEntities',
      nodesEntity: 'getNodesEntities'
    }),
    node () {
      return this.nodes[this.dialog.id]
    },
    fields () {
      return this.nodesEntity[this.dialog.id]
    }
  }
}
</script>
<style lang="stylus">
 @import '../lib/styl/vars.styl'
  @import '../lib/styl/colors.styl'
  


.watcher
  width: auto
  max-width: 20em
  .node-chart
    height: 50px
    padding-top 1em
    border: none

 .header 
    display block
    position relative
    background $darkness
    .icon
       margin-right: .25em

  .icon 
    color:$color
    display inline

  .node-title
    display inline-block
    color: $darkness
    position relative

$item-min = 7.25em
$item-margin = .25em
.node-data
  font-size: 0.6em
  display: flex
  flex-direction: row
  flex-wrap: wrap
  list-style: none
  padding:  0 .125em
  background $darkness-even
  margin 0
  li
    display: inline-block
    margin: $item-margin
    text-align: center
    box-shadow: 1px 1px 0.5px alpha(black,.5)
    min-width: $item-min
    padding: .5em .25em
    color-dark()
    
    .label, .entity-icon .icon
      color: $dark

    .entity-icon .icon
      font-size: 3em
      display: block
    .entity-icon .tip
      font-size: 1.5em    
    .txt
      display: inline-block
      font-size: 1.75em

  li.double
    min-width: ($item-min * 2) + (4 * $item-margin) 
    .label
      font-size: 1.5em
    .data
      font-size: 2em  
  li.quad
    min-width: ($item-min * 4) + (12 * $item-margin) 
    .label
      font-size: 1.5em
     .data
        font-size: 2em 
  


</style>

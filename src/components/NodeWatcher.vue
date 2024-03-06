<template>
  <div class="watcher">
    <ul :class="nodeClass" class="node-data">
      <li v-for="ent in ['latency', 'peers', 'pending', 'uncles', 'blockTrans', 'totalDiff', 'lastBlockTime', 'lastBlockDifference']" :key="ent">
        <entity-icon :entity="entity[ent]" :value="fields[ent]" :fields="fields"></entity-icon>
        <entity-value class="txt" :entity="entity[ent]" :value="fields[ent]" :fields="fields"></entity-value>
      </li>
    </ul>
    <div class="content-block-chart">
      <li class="double">
        <div class="label">{{ entity.lastBlock.title }}</div>
        <div class="data">
          <entity-value :entity="entity.lastBlock" :value="fields.lastBlock" :fields="fields"></entity-value>
        </div>
      </li>
      <li class="double">
        <div class="label">{{ entity.bestBlock.title }}</div>
        <div class="data">
          <tool-tip :value="fields.bestBlock" trim="8" :options="{ trimAt: 'end' }"></tool-tip>
        </div>
      </li>
      <!-- CHART Node History -->
      <node-chart class="dark-chart" :data="node.history"></node-chart>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import NodeChart from './NodeChart.vue'
import ToolTip from './ToolTip.vue'
import EntityMixin from '../mixins/Entity'
import { nodeFilter } from '../filters/nodes.js'
export default {
  name: 'node-watcher',
  mixins: [
    EntityMixin
  ],
  components: {
    NodeChart,
    ToolTip
  },
  filters: {
    nodeFilter
  },
  props: ['dialog'],
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
    // this.left = this.dialog.x
    // this.top = this.dialog.y
  },
  mounted () {
    // this.width = this.$el.clientWidth
    // this.height = this.$el.clientHeight
    this.onResize()
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
      'setNodeDialogPos'
    ]),
    ...mapGetters(['getNode']),
    ...mapGetters('app/entity', [
      'createNodeEntity'
    ]),
    onResize () {
      const chartContainer = this.$el.querySelector('.content-block-chart')
      this.width = chartContainer.offsetWidth
      this.height = Math.max(chartContainer.offsetHeight, 130)
      // this.width = 300
      // this.height = 300
    }
  },
  computed: {
    node () {
      return this.getNode()(this.dialog.id)
    },
    fields () {
      return this.createNodeEntity()(this.dialog.id)
    },
    nodeClass () {
      let node = this.node
      node = nodeFilter(node)
      return node._cssClass
    }
  }
}
</script>
<!-- <style lang="stylus">

  .watcher
    width 100%
    height: 100%
    // max-width 20em

    .node-chart
      width: 141px
      height 50px
      border none

  .header
    display block
    position relative

    .svg-icon
      margin-right 0.25em

  .svg-icon
    display inline

  .node-title
    display inline-block
    position relative

  $item-min = 7.25em
  $item-margin = 0.25em

  .node-data
    font-size 0.6em
    display flex
    flex-direction row
    flex-wrap wrap
    list-style none
    padding 0 0.125em
    margin 0

    li
      flex 1 1 24%
      margin 0.5%
      text-align center
      // box-shadow: 1px 1px 0.5px alpha(black,.5)
      box-sizing border-box
      min-width $item-min
      padding 1em 0.25em 0.25em 0.25em

      .label, .entity-icon .svg-icon

      .entity-icon .svg-icon
        width 2.5em
        // height 2.5em
        display block

      .entity-icon .tip
        font-size 1.5em

      .txt
        display inline-block
        font-size 1.75em

    li.double
      // min-width: ($item-min * 2) + (4 * $item-margin)
      flex 2 0 49%

      .label
        font-size 1.5em

      .data
        font-size 2em

    li.quad
      flex 4 0 99%

      // min-width: ($item-min * 4) + (12 * $item-margin)
      .label
        font-size 1.5em

      .data
        font-size 2em
</style> -->

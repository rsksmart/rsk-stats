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
  mounted () {
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

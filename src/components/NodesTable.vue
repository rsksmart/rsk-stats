<template lang="pug">
  .nodes-table
    .search
      .icon.icon-search
        input(name="search" type='search' v-model='filterRows' id="search" placeholder="type to filter")
    table.nodes(v-if='fields')
      tr
        th(v-for='field,key in fields' @click='sortBy(field)')
          entity-icon(:entity='entity[field]')
            .order(slot='badge' v-if='field === sortKey')
              span.arrow.up(v-if='sortOrders[field] > 0')
              span.arrow.down(v-else)
        th
          .icon.icon-pulse
        th
          .icon.icon-pin
      tr(v-for='node,index in rows' :class='rowClass(index,node.id)')
        td(v-for='field,key in fields') 
          entity-value(:value='node[field]' :entity='entity[field]')
        td
          node-chart(:data='nodeChart(node.id)' class="node-history")
        td
          .pin(@click='pinRow(node.id)')
            .icon-pinned.color2(v-if='isPinned()([node.id])' )
            .icon-pin(v-else)
    .loading(v-else)
      h2 loading data...

</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import NodeChart from './NodeChart.vue'
import EntityMixin from '../mixins/Entity.vue'
export default {
  name: 'nodes-table',
  mixins: [
    EntityMixin
  ],
  components: {
    NodeChart
  },
  created () {
    this.initTable()
  },
  computed: {
    ...mapGetters('app/entity/', {
      nodes: 'getNodesEntitiesArr',
      entity: 'getEntities'
    }),
    ...mapGetters('app/nodesTable', [
      'fields',
      'rows',
      'sortKey',
      'sortOrders'
    ]),
    filterRows: {
      get () {
        return this.$store.state.app.nodesTable.filterKey
      },
      set (value) {
        this.updateFilterKey(value)
      }
    }
  },
  methods: {
    ...mapGetters(['getNode']),
    ...mapGetters('app/nodesTable', [
      'isPinned']
    ),
    ...mapActions('app/nodesTable', [
      'initTable',
      'sortBy',
      'pinRow',
      'updateFilterKey'
    ]),

    nodeChart (id) {
      return this.getNode()(id).history
    },
    rowClass (index, id) {
      let node = this.getNode()(id)
      let cssClass = (index % 2) ? 'odd' : 'even'
      if (node && !node.stats.active) cssClass += ' inactive'
      return cssClass
    }
  }
}
</script>
<style lang="stylus">
@import '../lib/styl/vars.styl'
$head-bg = $white
$row-odd-bg = $darkness
$row-even-bg = lightness($row-odd-bg, 15%)
$border-color = alpha($color,.2)
  table.nodes
    border:none
    padding:0
    margin:0
    border-spacing: 0
    color: $color
    tr
      border: $color solid 1px
    th
      padding: .5em 1em 
      border-bottom: $border-color dashed 1px
      background-color $head-bg
      .entity-icon
        .icon 
          font-size: 1.5em
        .badge
          font-size: .5em
          bottom: 0
          right: -1.5em
          font-size: .6em
    td
     font-size: 0.8em
     padding: .25em 1em
     white-space: nowrap
    tr.odd td
      background-color $row-odd-bg
    tr.even td   
      background-color $row-even-bg
    tr:last-child td
      border-bottom: solid 1px $border-color
    tr:hover td
      background-color: $darkness2 
    .node-history
      max-width 10em
      max-height 2em   
  .search
    margin-bottom: .25em
    input
      margin-left: .25em
    .icon
      font-size: .8em
      line-height: 1em
</style>


<template lang="pug">
  .nodes-table
    table.nodes(v-if='fields')
      tr
        th(v-for='field in fields')
          entity-icon(:entity='entity[field]')
        th
        th 
      tr(v-for='node,id,index in nodes' :class='(index % 2) ? "odd" : "even"')
        td(v-for='field,key in fields') 
          entity-value(:value='node[field]' :entity='entity[field]')
        td
          d3-bar-chart(:data='nodeChart(id)' class="node-history")
        td
          span.icon-pin(@click='pinRow()')
    .loading(v-else)
      h2 loading data...

</template>
<script>
import { mapGetters } from 'vuex'
import EntityIcon from './EntityIcon.vue'
import EntityValue from './EntityValue.vue'
import D3BarChart from 'vue-d3-barchart'
export default {
  name: 'data-table',
  components: {
    EntityIcon,
    EntityValue,
    D3BarChart
  },
  props: ['pinned'],
  computed: {
    ...mapGetters('app/entity/', {
      nodes: 'getNodesEntities',
      entity: 'getEntities'
    }),
    ...mapGetters('app/', {
      fields: 'tableFields'
    })
  },
  methods: {
    ...mapGetters(['getNode']),
    nodeChart (id) {
      let node = this.getNode()(id)
      return node.history
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
</style>


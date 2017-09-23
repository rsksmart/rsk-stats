<template lang="pug">
  .nodes-table
    .search
      icon(name='search')
      input(name="search" type='search' v-model='filterRows' id="search" placeholder="type to filter")
      
      .hidden-fields(v-if='hiddenFields.length')
        small Hidden fields:
        button(v-for='field in hiddenFields' @click='showField(field)' @touchstart='showField(field)' )
          entity-icon(:entity='entity[field]')   
    
    table.nodes.dark(v-if='fields')
      thead
        tr.field-actions
          //- fields 
          th(v-for='field,key in fields' v-if='!isHidden(field)' @touchstart='hideField(field)')
            button(@click='hideField(field)')
              icon(name='close')
          th      
        tr
          //- fields 
          th(v-for='field,key in fields' v-if='!isHidden(field)')
            button(@click='sortBy(field)' @touchstart='sortBy(field)')
              entity-icon(:entity='entity[field]')
                .order(slot='badge' v-if='field === sortKey')
                  span.arrow.up(v-if='sortOrders[field] > 0')
                  span.arrow.down(v-else)
          th
            icon(name='pin')
      tbody
        
        //- no content 
        tr.full(v-if='rows.length === 0')
          td(:colspan='fields.length + 2') There are no results that match your search
        
        //- rows
        tr(v-for='node,index in rows' :class='rowClass(index,node.id)')
          //- fields
          td(v-for='field,key in fields' v-if='!isHidden(field)' :class='toKebab(field)') 
            node-chart.node-history(v-if='field === "nodeHistory"' :data='nodeChart(node.id)' name='nodeChart2')
            entity-value(v-else :value='node[field]' :entity='entity[field]' :fields='node')
            
          //- Pin button
          td
            .pin(@click='pinRow(node.id)' @touchstart='pinRow(node.id)')
              icon.color2(v-if='isPinned()([node.id])' name='pinned' )
              icon(v-else name='pin')
    .loading(v-else)
      h2 loading data...

</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import NodeChart from './NodeChart.vue'
import EntityMixin from '../mixins/Entity'
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
      nodes: 'getNodesEntitiesArr'
    }),
    ...mapGetters('app/nodesTable', [
      'fields',
      'hiddenFields',
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
      'isPinned',
      'isHiddenField'
    ]
    ),
    ...mapActions('app/nodesTable', [
      'initTable',
      'sortBy',
      'showField',
      'hideField',
      'pinRow',
      'updateFilterKey'
    ]),
    isHidden (field) {
      let h = this.isHiddenField()(field)
      return (h > -1)
    },
    nodeChart (id) {
      return this.getNode()(id).history
    },
    rowClass (index, id) {
      // let node = this.getNode()(id)
      let data = this.rows[index]
      let cssClass = (index % 2) ? 'odd' : 'even'
      if (data && !data.active) cssClass += ' inactive'
      if (this.isPinned()(id)) cssClass += ' pinned'
      return cssClass
    },
    toKebab (value) {
      return value.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
    }
  }
}
</script>
<style lang="stylus">
@import '../lib/styl/vars.styl'
  .nodes-table
    overflow visible
    display flex
    flex-direction column
  table.nodes
    min-width 100%
    tr.full 
      min-width: 100%  
    td, th
     animation-name: row-anim
     animation-duration: .5s
     animation-timing-function: ease-out 
    @keyframes row-anim
      0%
        transform: rotateX(-90deg) rotateZ(-90deg)
      40%
        rotateZ(10deg)   
      50%
        transform: rotateX(45deg) rotateZ(0)  
      100% 
        transform: rotateX(0) 
    .node-history
    .node-chart
      height: 50px
      padding 0
      max-width 10em
      min-width 5em
      max-height 2em
      margin 0
      svg
        path
          stroke-width: 1px    

  .search  
    display flex
    input
      margin-right .5em

  .hidden-fields
    z-index 500
    display flex
    flex 1
    order 2
    button
      margin-left .5em
  tr.field-actions
    padding 0
    line-height: 1em
    td, th
      background none
      margin 0
      padding 0
      .svg-icon, button
        width .8em
        height @width

</style>


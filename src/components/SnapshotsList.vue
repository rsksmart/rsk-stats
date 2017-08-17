<template lang="pug">
  .snapshots-list
    h4.title snapshots
    button.btn(@click='takeSnapshot()')
      span.icon-save
      span Take Snapshot
    table.snapshots
      tr(v-for='snapshot,key in snapshots')
        td {{ snapshot.name }}
         td {{ key | date-from-ts}}
        td
          button(@click='removeSnapshot(key)')
            span.icon-delete 
        td
          button(@click='loadSnapshot(key)')
            span.icon-load  



</template>
<script>
import { mapState, mapActions } from 'vuex'
import { dateFromTs } from '../filters/TimeFilters.js'
export default {
  name: 'snapshots-list',
  filters: {
    dateFromTs
  },
  computed: {
    ...mapState({
      snapshots: state => state.snapshots
    })
  },
  methods: {
    ...mapActions([
      'loadSnapshot',
      'takeSnapshot',
      'removeSnapshot'
    ])
  }
}
</script>
<style lang="stylus">
@import '../lib/styl/vars.styl'
  .snapshots-list
      background-color: $white
      padding: .5em
      max-height: 20em
      overflow: auto
</style>

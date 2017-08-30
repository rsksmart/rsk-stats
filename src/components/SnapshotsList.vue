<template lang="pug">
  .snapshots-list
    button.close(@click='close')
    slot.title(name='title')
    input(type="text" v-model='snapShotName')
    button.btn(@click='takeSnapshot(snapShotName)')
      span.icon-save
    table.snapshots
      tr(v-for='snapshot,key in snapshots')
        td
          button(@click='removeSnapshot(key)')
            tool-tip(:value='"delete"')
              .icon-delete-forever 
        td {{ snapshot.name }}
        td
          small {{ key | date-from-ts}}
        td
          button(@click='downloadSnapshot(key)')
            tool-tip(:value='"download"')
              .icon-download 
        td
          button(@click='loadSnapshot(key)')
            tool-tip(:value='"load"')
              .icon-load  

</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { dateFromTs } from '../filters/TimeFilters.js'
import ToolTip from './ToolTip.vue'
export default {
  name: 'snapshots-list',
  components: {
    ToolTip
  },
  filters: {
    dateFromTs
  },
  data () {
    return {
      snapShotName: 'snapshot'
    }
  },
  computed: {
    ...mapGetters({
      snapshots: 'getSnapshots'
    })
  },
  methods: {
    ...mapActions([
      'loadSnapshot',
      'takeSnapshot',
      'removeSnapshot',
      'downloadSnapshot'
    ]),
    close () {
      this.$emit('close')
    }
  }
}
</script>
<style lang="stylus">
@import '../lib/styl/vars.styl'
  .snapshots-list
      background-color: $light
      padding: .5em
      max-height: 20em
      overflow: auto
      display inline-block
      position: relative
      .title 
        padding: 0
        margin: 0
      button.close
        position: absolute
        right: .5em
        top: .5em
</style>

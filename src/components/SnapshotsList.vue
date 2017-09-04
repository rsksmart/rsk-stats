<template lang="pug">
  .snapshots-list
    button.close(@click='close')
      icon(name='close')
    slot.title(name='title')
    input(type="text" v-model='snapShotName')
    button.btn(@click='takeSnapshot(snapShotName)')
      icon(name='floppy')
    table.snapshots
      tr(v-for='snapshot,key in snapshots')
        td
          button(@click='removeSnapshot(key)')
            tool-tip(:value='"delete"')
              icon(name='delete-forever') 
        td {{ snapshot.name }}
        td
          small {{ key | date-from-ts}}
        td
          button(@click='downloadSnapshot(key)')
            tool-tip(:value='"download"')
              icon(name='clowd-down') 
        td
          button(@click='loadSnapshot(key)')
            tool-tip(:value='"load"')
              icon(name='load')  
        td
          button(@click='loadLayout(key)')
            tool-tip(:value='"load Layout"')
              icon(name='load')  

</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { dateFromTs } from '../filters/TimeFilters.js'
import ToolTip from './ToolTip.vue'
import '../icons/floppy'
import '../icons/delete-forever'
import '../icons/clowd-down'
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
      'downloadSnapshot',
      'loadLayout'
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

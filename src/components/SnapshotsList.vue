<template lang="pug">
  .snapshots-list
    input(v-model='snapShotName')
    button.btn(@click='takeSnapshot(snapShotName)')
      icon(name='floppy')
    table.snapshots.dark
      tr(v-for='snapshot,key in snapshots' :key='key' :class='(key % 2) ? "odd" : "even"')
        td
          button(@click='removeSnapshot(key)')
            //-tool-tip(:value='"delete"')
            icon(name='delete-forever') 
        td {{ snapshot.name }}
        td
          small {{ key | date-from-ts}}
        td
          button(@click='downloadSnapshot(key)' title="Download")
            //-tool-tip(:value='"download"')
            icon(name='clowd-down') 
        td
          button(@click='loadSnapshot(key)' title="Load snapsshot")
            //-tool-tip(:value='"load"')
            icon(name='load')  
        td
          button(@click='loadLayout(key)' title="Load layout")
            //-tool-tip(:value='"load Layout"')
            icon(name='link-external')  

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
      snapShotName: ''
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

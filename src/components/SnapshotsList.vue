<template lang="pug">
  .snapshots-list
    .controls
      .label create snapshot
      input.big(v-model='snapShotName' placeholder="snapshot name" size="15")
      button.btn.big.dark(@click='takeSnapshot(snapShotName)' aria-label="take snapshot")
        tool-tip(:value='"take snapshot"')
          icon(name='floppy')

      input(type='file' id='snapshot-file' @change='loadFile' accept='.json,application/json' style="display:none" ref='sfile')
      button.btn.dark.big(@click='$refs.sfile.click()' aria-label="import snapshot")
        tool-tip(:value='"import snapshot"')
          icon(name='clowd-up')

    ul.list.snapshots.dark
      li(v-for='snapshot,id,key in snapshots' :key='key' :class='rowClass(id,key)')
        ul.list-head
          li(@touchstart.passive='minMaxRow(id)') {{ (snapshot.name || id ) }}
        ul.list-item
          li 
            small {{ key | date-from-ts}}
          li.col
            button.circle.delete(@click='removeSnapshot(id)' aria-label="remove")
              tool-tip(:value='"delete"')
                icon(name='delete-forever') 
          li.col
            button.circle(@click='downloadSnapshot(id)' aria-label="download")
              tool-tip(:value='"download"')
                icon(name='clowd-down') 
          li.col.action
            button.circle(@click='loadSnapshot(id)' aria-label="load snapshot" )
              tool-tip(:value='"load snapshot"')
                icon(name='load')  
          li.col.action
            button.circle(@click='loadLayout(id)' aria-label="load layout")
              tool-tip(:value='"load Layout"')
                icon(name='link-external')  
        ul.list-buttons
          li
            button(@click='minMaxRow(id)')
              span.arrow(:class='(isMax(id)) ? "up":"down" ')
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
  data () {
    return {
      snapShotName: '',
      maxRows: {}
    }
  },
  components: {
    ToolTip
  },
  filters: {
    dateFromTs
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
      'loadLayout',
      'loadSnapshotFromFile'
    ]),
    close () {
      this.$emit('close')
    },
    minMaxRow (id) {
      let min = this.isMax(id)
      this.$set(this.maxRows, id, !min)
    },
    loadFile (event) {
      this.loadSnapshotFromFile(event.target.files)
    },
    isMax (id) {
      return this.maxRows[id] || false
    },
    rowClass (id, key) {
      let rowClass = []
      rowClass.push((key % 2) ? 'odd' : 'even')
      rowClass.push((this.isMax(id)) ? 'max' : 'min')
      return rowClass
    }
  }
}
</script>
<style lang="stylus">
@import '../lib/styl/vars.styl'
  .snapshots-list
    width 100%
    .controls
      padding .5em
      margin-bottom 1em
        
</style>

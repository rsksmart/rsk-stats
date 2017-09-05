<template lang="pug">
  .main-dialog
    dialog-drag(:options='dialog' :id='dialog.id'
      :class='dialog.type + "-dialog"'
      :event-cb='dialogEventFormatter(dialog.type)'
      @close='closeDialog(dialog)'
      @move='updateDialog'
      @load='updateDialog'
      @pin='updateDialog'
      @focus='bringDialogToFront(dialog)'
      )
        template(v-if='!is(types.TOTAL)')
          icon( v-if='buttonClose' name='close' slot='button-close')
          icon( v-if='buttonPin' name='pin' slot='button-pin')
          icon( v-if='buttonPin' name='pinned' slot='button-pinned')
        
        //- Node Dialog
        template(v-if='is(types.NODE)')
          .node-header(slot='title')
            icon.med(name='rsk')
            h3.node-title.title {{ dialog.name }}
          node-watcher(:dialog='dialog')
        //- Chart Dialog
        template(v-if='is(types.CHART)')
          h3.node-title(slot='title') {{ dialog.name }}
          chart(:name='dialog.id' :max='true')  
        
        template(v-if='is(types.TOTAL)')
          big-data(:name='dialog.id')
          icon( v-if='buttonClose' name='close' slot='button-close')
        template(v-if='is(types.TABLE)')
          nodes-table  
  
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import DialogDrag from 'vue-dialog-drag'
import NodeWatcher from './NodeWatcher.vue'
import Chart from './Chart.vue'
import NodesTable from './NodesTable.vue'
import BigData from './BigData.vue'

import '../icons/close'
import '../icons/pin'
import '../icons/pinned'
import '../icons/rsk'

// Dialog event cb
const dialogEventFormatter = (type) => (obj) => {
  obj.type = type // set type
  obj.w = obj.width // save computed width
  obj.h = obj.height // save computed height
  obj.height = 0 // auto height
  obj.centered = false // remove autocenter, after load
  return obj
}

export default {
  name: 'main-dialog',
  components: {
    DialogDrag,
    NodeWatcher,
    Chart,
    BigData,
    NodesTable
  },
  props: ['dialog'],
  data () {
    return {
      buttonPin: true,
      buttonClose: true,
      dialogEventFormatter: dialogEventFormatter
    }
  },
  created () {
    if (this.dialog.type === this.types.CHART) {
      this.buttonPin = false
    }
    this.dialog.buttonClose = this.buttonClose
    this.dialog.buttonPin = this.buttonPin
  },
  computed: {
    ...mapGetters('app/', {
      types: 'getTypes'
    })
  },
  methods: {
    ...mapActions('app/', [
      'updateDialog',
      'closeDialog',
      'bringDialogToFront'
    ]),
    is (type) {
      return this.dialog.type === type
    }
  }
}
</script>

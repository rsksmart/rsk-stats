<template lang="pug">
  .main-dialog
    dialog-drag(:options='dialog' :id='dialog.id'
      :class='dialog.type + "-dialog"'
      :event-cb='dialogEventFormatter(dialog.type)'
      @close='close'
      @move='updateDialog'
      @load='updateDialog'
      @pin='updateDialog'
      @focus='bringDialogToFront(dialog)'
      )

      template(v-if='!isDialog(types.TOTAL)')
        icon( v-if='buttonClose' name='close' slot='button-close')
        icon( v-if='buttonPin' name='pin' slot='button-pin')
        icon( v-if='buttonPin' name='pinned' slot='button-pinned')
      
      //- Node Dialog
      template(v-if='isDialog(types.NODE)')
        .node-header(slot='title')
          icon.med(name='rsk')
          h3.node-title.title {{ dialog.name | txt-trim  }}
        node-watcher(:dialog='dialog')
      //- Chart Dialog
      template(v-if='isDialog(types.CHART)')
        h3.node-title(slot='title') {{ dialog.name }}
        chart(:name='dialog.id' :max='true')  
      
      template(v-if='isDialog(types.TOTAL)')
        big-data(:name='dialog.id')
        icon( v-if='buttonClose' name='close' slot='button-close')
      template(v-if='isDialog(types.TABLE)')
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
      buttonClose: true
    }
  },
  created () {
    if (this.dialog.type === this.types.CHART) {
      this.buttonPin = false
    }
    this.dialog.buttonClose = this.buttonClose
    this.dialog.buttonPin = this.buttonPin
    // this.dialog.dropEnabled = false
  },
  computed: {
    ...mapGetters({
      types: 'app/getTypes',
      size: 'getSize'
    })
  },
  methods: {
    ...mapActions('app/', [
      'updateDialog',
      'closeDialog',
      'bringDialogToFront'
    ]),
    ...mapActions('app/charts', [
      'minimizeChart'
    ]),
    isDialog (type) {
      return this.dialog.type === type
    },
    close (dialog) {
      if (dialog.type === this.types.CHART) {
        this.minimizeChart(dialog.id)
      }
      this.closeDialog(dialog)
    },
    // Dialog event cb
    dialogEventFormatter (type) {
      return (obj) => {
        obj.type = type // set type
        obj.w = obj.width // save computed width
        obj.h = obj.height // save computed height
        if (obj.y < 0) obj.y = 0
        // auto size for all dialogs except TOTALS
        if (type !== this.types.TOTAL) {
          obj.height = 0 // auto height
          obj.width = 0 // auto height
        }
        if (type !== this.types.TABLE) {
          obj.centered = null // remove autocenter, after load
        }
        return obj
      }
    }

  }
}
</script>

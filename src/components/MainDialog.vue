<template>
  <div class="main-dialog">
    <div class="dialog-background" :class="dialog.type">
      <div class="content-dialog">
        <!-- Node Dialog -->
        <template v-if="isDialog(types.NODE)">
          <div slot="title" class="node-header">
            <button @click="close(dialog)">
              <img class="close-icon" src="../assets/svg/close-icon.svg" alt="close-icon">
            </button>
            <node-watcher :dialog="dialog" />
          </div>
        </template>

        <!-- Chart Dialog -->
        <template v-if="isDialog(types.CHART)">
          <h3 slot="title" class="node-title">{{ dialog.name }}</h3>
          <chart :name="dialog.id" :max="true"></chart>
        </template>

        <template v-if="isDialog(types.TOTAL)">
          <big-data :name="dialog.id"></big-data>
          <icon v-if="buttonClose" name="close" slot="button-close"></icon>
        </template>
        <template v-if="isDialog(types.TABLE)">
          <div class="head-tables-node">
            <button @click="close(dialog)">
              <img class="close-icon" src="../assets/svg/close-icon.svg" alt="close-icon">
            </button>
            <nodes-table />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
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
      showDialog: false
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

<template lang="pug">
  .mini-chart(v-if='!isMaximized' @touchstart.prevent='openDialog')
    chart(:name='name')
      button(@click='openDialog' slot='header')
        icon(name='resize')
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import Chart from './Chart.vue'
import '../icons/resize'
export default {
  name: 'mini-chart',
  components: {
    Chart
  },
  props: ['name'],
  methods: {
    ...mapActions('app/charts', [
      'createChartDialog'
    ]),
    ...mapGetters({
      getDialog: 'app/getDialog'
    }),
    openDialog () {
      let dialog = {
        id: this.name,
        width: this.size / 2,
        height: this.size / 6,
        centered: 'viewport'
      }
      this.createChartDialog(dialog)
    }
  },
  computed: {
    ...mapGetters({
      size: 'getSize',
      types: 'app/getTypes'
    }),
    dialog (name) {
      return this.getDialog()(this.types.CHART, this.name)
    },
    isMaximized () {
      if (this.dialog) return this.dialog.length
      return 0
    }
  }
}
</script>


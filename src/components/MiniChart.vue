<template lang="pug">
  .mini-chart(v-if='!isMaximized' @touchstart.prevent='openDialog')
    chart(:name='name')
      button(@click='openDialog' slot='header')
        icon.maximize(name='enlarge')
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
    ...mapActions('app/', ['centerDialog']),
    ...mapGetters({
      getDialog: 'app/getDialog'
    }),
    openDialog (event) {
      let dialog = {
        id: this.name,
        width: this.size.w / 2,
        height: this.size.w / 6,
        centered: 'viewport'
      }
      if (event.touches) {
        this.centerDialog(dialog)
      }
      this.createChartDialog(dialog)
    }
  },
  computed: {
    ...mapGetters({
      size: 'getSize',
      types: 'app/getTypes'
    }),
    dialog () {
      return this.getDialog()(this.types.CHART, this.name)
    },
    isMaximized () {
      if (this.dialog) return this.dialog.length
      return 0
    }
  }
}
</script>

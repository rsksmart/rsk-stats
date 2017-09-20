<template lang="pug">
  .mini-chart(@touchstart.prevent='openDialog')
    chart(:name='name')
      button.max(@click='openDialog' slot='header')
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
        width: this.size.w / 2.1,
        height: this.size.w / 6,
        centered: 'viewport'
      }
      this.createChartDialog(dialog)
    }
  },
  computed: {
    ...mapGetters({
      size: 'getSize',
      types: 'app/getTypes'
    })
  }
}
</script>
 <style lang="stylus">
  .mini-chart
    display flex
    flex-flow column nowrap
    margin-bottom: .25rem
    .curve
      stroke-width 2px
 </style>
 

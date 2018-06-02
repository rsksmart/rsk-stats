<template lang="pug">
  .mini-chart(v-if='name')
    chart(:name='name' :xsize='size.w')
      button.max(@click='maximize' slot='header' aria-label="maximize-chart")
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
      'maximizeChart'
    ]),
    maximize () {
      this.maximizeChart(this.name)
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
    margin-top .25rem
    .curve
      stroke-width 2px
 </style>

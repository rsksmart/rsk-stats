<template>
  <div v-if="name" class="mini-chart">
    <chart :name="name" :xsize="size.w">
      <template v-slot:header>
        <button class="max" @click="maximize" aria-label="maximize-chart">
          <icon name="enlarge" class="maximize"></icon>
        </button>
      </template>
    </chart>
  </div>
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
 <!-- <style lang="stylus">
  .mini-chart
    display flex
    flex-flow column nowrap
    margin-top .25rem
    .curve
      stroke-width 2px
 </style> -->

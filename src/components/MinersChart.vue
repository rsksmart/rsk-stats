<template lang="pug">
  .miners-chart
    h3.chart-title last blocks miners
    .miners
      .miner(v-for='miner in miners')
        .blocks 
          span {{miner.blocks}}
        cube-of-cubes.cubes(:mod='mod' :step='miner.blocks' :size='size') 
        .name
          temlpate(v-if='miner.name')
            span {{miner.name}} &nbsp;
            tool-tip(:value='miner.miner' trim='4' :options='{trimAt:"end"}')
          template(v-else)
            tool-tip(:value='miner.miner' :trim='4' :options='{trimAt:"center"}')

</template>
<script>
import { mapGetters } from 'vuex'
import CubeOfCubes from './CubeOfCubes.vue'
import ToolTip from './ToolTip.vue'
export default {
  name: 'miners-chart',
  components: {
    ToolTip,
    CubeOfCubes
  },
  mounted () {
    this.size = this.$el.clientWidth / 4
  },
  computed: {
    ...mapGetters({
      miners: 'backend/getMiners',
      cols: 'getCols'
    }),
    max () {
      if (!this.miners.length) return
      return Math.max(...this.miners.map(
        (miner) => { return miner.blocks })
      )
    },
    size: {
      get () {
        return this.cols.a.w / 6
      },
      set () {
      }
    },
    mod () {
      let max = this.max
      if (max) return Math.ceil(Math.cbrt(max))
    }
  }
}
</script>
<style lang="stylus">
@import '../lib/styl/vars.styl'
@import '../lib/styl/mixins.styl'
  .miners-chart
    box()
    padding-bottom .5rem
    .chart-title
      margin-bottom 1em
  .miners
    min-width 100%
    display flex
    flex-flow row nowrap
    justify-content space-around
  
  .miner
    flex 1
    position relative
    display flex
    align-items center
    flex-flow column nowrap
    svg 
      overflow visible
      .cube
        fill $color
        stroke $dark
    .name 
      font-size .8em
      
    .cubes
      display inline-block
    .blocks
      position absolute
      right 1.5em
      text-align center
      span
        badge(1.6em)
        border $border
        background none

    
</style>


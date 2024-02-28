<template>
<div class="miners-chart">
  <div class="chart-title">
    Last Blocks Miners
    <div class="content-icon">
      <img src="@/assets/svg/blocks.svg" alt="">
      <div class="badge"></div>
    </div>
  </div>
  <div class="miners">
    <div class="miner" v-for="(miner, i) in miners" :key="i">
      <div class="name">
        <template v-if="miner.name"><span>{{miner.name}} &nbsp;</span>
          <tool-tip :value="miner.miner" trim="4" :options="{trimAt:'end'}"></tool-tip>
        </template>
        <template v-else>
          <tool-tip :value="miner.miner" :trim="4" :options="{trimAt:'center'}"></tool-tip>
        </template>
      </div>
      <div class="blocks">
        <icon name="cube" />
        <span>{{miner.blocks}}</span>
      </div>
    </div>
  </div>
</div></template>
<script>
import { mapGetters } from 'vuex'
import ToolTip from './ToolTip.vue'
export default {
  name: 'miners-chart',
  components: {
    ToolTip
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
      let { max } = this
      return (max) ? Math.ceil(Math.cbrt(max)) : undefined
    }
  }
}
</script>

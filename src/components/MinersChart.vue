<template lang="pug">
  .miners-chart
    table.miners.dark
      thead
        tr
          th miner
          th blocks
      tbody
        tr(v-for='miner in miners')
          td(v-if='miner.name') 
            span {{miner.name}} &nbsp;
            tool-tip(:value='miner.miner' trim='4' :options='{trimAt:"end"}') 
          td(v-else)
            tool-tip(:value='miner.miner' :trim='8' :options='{trimAt:"center"}')
          td {{miner.blocks}}
</template>
<script>
import { mapGetters } from 'vuex'
import ToolTip from './ToolTip.vue'
export default {
  name: 'miners-chart',
  components: {
    ToolTip
  },
  computed: {
    ...mapGetters('backend/', {
      miners: 'getMiners'
    })
  }
}
</script>
<style lang="stylus">
  table.miners
    min-width 100%
</style>


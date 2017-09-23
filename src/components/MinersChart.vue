<template lang="pug">
  .miners-chart
    table.miners.dark
      thead
        tr
          th miner
          th blocks
      tbody
        tr(v-for='miner in miners')
          td {{miner.name || miner.miner | hash-trim  }}
          td {{miner.blocks}}
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'miners-chart',
  computed: {
    ...mapGetters('backend/', {
      miners: 'getMiners'
    })
  }
}
</script>

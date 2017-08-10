<template lang="pug">
  #app.main(@keyup.esc='setTool("pointer")')
    //-> Network
    chart(title='Difficulty' chart='difficultyChart' )
    d3-network(
      v-if='connected'
      :netNodes="nodes"
      :netLinks="links"
      :options="options"
      class="net"
      )
    //- if not connected  
    .center.loading(v-else)
      img(class="logo" src="static/rsk-logo.png")
      h1.center connecting to server  

</template>
<script>
/* eslint-disable no-unused-vars */
import { mapState, mapActions, mapGetters } from 'vuex'
import defaultData from './data.js'
import D3Network from 'vue-d3-network'
import Chart from './components/Chart.vue'
export default {
  name: 'NetStats',
  components: {
    D3Network,
    Chart
  },
  data () {
    let data = Object.assign({}, defaultData)
    data.options.size = { w: 500, h: 500 }
    data.options.offset = { x: 0, y: 0 }
    return data
  },
  mounted () {
    this.onResize()
    window.addEventListener('resize', this.onResize)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResize)
  },
  computed: {
    ...mapState({
      state: state => state,
      totals: state => state.totals
    }),
    ...mapGetters({
      size: 'getSize',
      connected: 'isConnected',
      nodes: 'getNodesArr',
      links: 'getLinksArr',
      activeNodes: 'getActivesNodes'
    })
  },
  methods: {
    onResize () {
      let size = { w: this.$el.clientWidth, h: this.$el.clientHeight }
      this.setSize(size)
      let options = this.options
      options.size = size
      this.changeOptions(options)
    }
  }
}
</script>
<style lang="stylus">
</style>

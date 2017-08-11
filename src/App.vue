<template lang="pug">
  #app.main(@keyup.esc='setTool("pointer")')
    //- .drag-col(v-for='(col, index) in cols' :class='"drag-col-" + index' @dragover='dragCol(index)')
    .maximized-chart(v-if='maxChart')
       chart( :title='maxChart.title' :chart='maxChart.chart' :options='maxChart.options' maximized='true')
    .layout( v-if='connected')
      .col-a
        big-data(title="Best Block" :data="totals.bestBlock" icon="icon-cube")
        big-data(title="Last Block" :data='lastBlock | seconds-ago' sufix="s ago" icon="icon-cubes" )
        big-data(title="Avg Block Time" :data="totals.avgBlockTime | s-seconds" icon="icon-stopwatch" )
        
        chart(title='Uncles' chart='uncleCountChart' :options='{colorInterpol:unclesColors}' )
        chart(title='Blocks Time' chart='lastBlocksTime'  :options='{ colors:["red", "yellow"] }')
        chart(title='Difficulty' chart='difficultyChart' )
        
      .col-b 
      .col-c
        big-data(title="Difficulty" :data='totals.lastDifficulty | numerals' sufix="H" icon="icon-puzzle"  )
        big-data(title="Avg Network Hash Rate" :data='totals.avgHashrate | numerals(1)' sufix="Hs" icon="icon-zap" )
        big-data(title="Uncles" :data='totals.bestStats.block.uncles.length + "/" + totals.uncleCount' icon="icon-git-merge" )
        
        //- h6 blockPropagationChart
        //-chart(:data='blockChart')
        
        chart(title='Gas Limit' chart='lastGasLimit')
        chart(title='Gas Pending' chart='gasSpending')
        chart(title='Transaction Density' chart='transactionDensity' )
    //-> Network
    d3-network(
      v-if='connected'
      :netNodes="nodes"
      :netLinks="links"
      :selection="selection"
      :node-sym='nodeSym'
      :options="options"
      @node-click="nodeClick"
      @link-click="linkClick"
      class="net"
      )
    //- if not connected  
    .center.loading(v-else)
      img(class="logo" src="static/rsk-logo.png")
      h1.center connecting to server  
    
    //-> Tools
    .tools
      ul
        li(v-for='t,to in tools') 
          button.btn.circle(@click='setTool(to)' :class='buttonClass(to)')
            span(:class="t.class") 
      .tip {{ tools[tool].tip }}

    .watchers
      dialog-drag(v-for="(dialog,index) in dialogs"  
        :options='dialog'
        :key="index"
        :id='index'
        @close='unSelectNode(dialog.node.id)'
        )
        node-watcher( 
          :dialog='dialog'
          :index='index'
          )
    .over
      //-> Menu
      .menu(v-if="showMenu")
        .close(@click="showMenu=false")
        stats-menu(
          :nodes="nodes" 
          :links="links" 
          :options="options" 
          @options="changeOptions"
          @reset="resetOptions"
          )
      
      .options
        button.btn.menu(@click="showMenu = !showMenu")
          span(class="icon-equalizerh")
        h1
          span.icon-rsk
          span &nbsp; rsk network
        ul.inline
          li nodes: {{activeNodes.length}} 
          li actives: {{ nodes.length }}
</template>
<script>
/* eslint-disable no-unused-vars */
import { mapState, mapActions, mapGetters } from 'vuex'
import defaultData from './data.js'
import D3Network from 'vue-d3-network'
import StatsMenu from './components/StatsMenu'
import DialogDrag from 'vue-dialog-drag'
import NodeWatcher from './components/NodeWatcher.vue'
import BigData from './components/BigData.vue'
import Chart from './components/Chart.vue'
import { secondsAgo, sSeconds } from './filters/TimeFilters.js'
import { Numerals } from './filters/NumberFilters.js'
import { blues, redGreen } from './lib/js/charts.js'
import nodeIcon from '!!raw-loader!./assets/node2.svg'
export default {
  name: 'NetStats',
  components: {
    D3Network,
    StatsMenu,
    DialogDrag,
    NodeWatcher,
    BigData,
    Chart
  },
  filters: {
    secondsAgo,
    sSeconds,
    Numerals
  },
  data () {
    let data = Object.assign({}, defaultData)
    data.options.size = { w: 500, h: 500 }
    data.options.offset = { x: 0, y: 0 }
    data.options.nodeSym = nodeIcon
    data.tools = {
      pointer: {
        tip: 'Select',
        class: 'icon-pointer'
      },
      pin: {
        tip: 'click on node to pin it',
        class: 'icon-pin'
      }
    }
    data.tool = 'pointer'
    data.now = Date.now()
    data.unclesColors = blues
    data.redGreen = redGreen
    data.nodeSym = nodeIcon
    return data
  },
  created () {
    let savedOptions = window.localStorage.options
    if (savedOptions) {
      this.options = Object.assign({}, JSON.parse(savedOptions))
    }
    // updates time every second
    let vm = this
    setInterval(() => {
      vm.now = Date.now()
    }, 1000)
  },
  mounted () {
    this.onResize()
    window.addEventListener('resize', this.onResize)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.onResize)
  },
  watch: {
    options (newValue) {
      if (newValue) localStorage.setItem('options', JSON.stringify(newValue))
      this.options = newValue
    }
  },
  computed: {
    ...mapState({
      state: state => state,
      totals: state => state.backend.totals,
      charts: state => state.backend.charts,
      maxChart: state => state.app.maximizedChart
    }),
    ...mapGetters({
      size: 'getSize',
      selection: 'selection',
      dialogs: 'getNodeDialogs',
      connected: 'isConnected',
      nodes: 'getNodesArr',
      links: 'getLinksArr',
      activeNodes: 'getActivesNodes'
    }),
    lastBlock () {
      return this.now - this.totals.lastBlock
    },
    blockChart () {
      return this.charts.blockPropagationChart.map((d) => {
        return d.x
      })
    }
  },
  methods: {
    ...mapActions([
      'selectNode',
      'selectLink',
      'unSelectNode',
      'unSelectLink',
      'selectNodeLinks',
      'remoteRemoveLink',
      'setSize',
      'pinNode',
      'socketUrl'
    ]),
    ...mapGetters([
      'isNodeSelected',
      'isLinkSelected'
    ]),
    onResize () {
      let size = { w: this.$el.clientWidth, h: this.$el.clientHeight }
      this.setSize(size)
      let options = this.options
      options.size = size
      this.changeOptions(options)
    },
    resetOptions () {
      this.options = Object.assign({}, defaultData.options)
      this.options.offset = { x: 0, y: 0 }
    },
    showSelection () {
      return Object.keys(this.selection.nodes).length + Object.keys(this.selection.links).length
    },
    buttonClass (tool) {
      if (tool === this.tool) return 'selected'
    },
    setTool (tool) {
      this.tool = tool
      let cursorClass = (tool === 'pointer') ? '' : 'cross-cursor'
      this.$el.className = cursorClass
    },
    changeOptions (options) {
      this.options = Object.assign({}, options)
    },
    // -- Selection
    nodeClick (event, node) {
      switch (this.tool) {
        case 'pin':
          this.pinNode(node)
          break
        default: // selection tool
          if (this.isNodeSelected()(node.id)) {
            this.unSelectNode(node.id)
          } else {
            this.selectNode(node)
          }
          this.selectNodeLinks(node.id)
          break
      }
    },
    linkClick (event, link) {
      if (this.tool === 'killer') {
        this.remoteRemoveLink(link.id)
      } else {
        if (this.isLinkSelected()(link.id)) {
          this.unSelectLink(link.id)
        } else {
          this.selectLink(link)
        }
      }
    }
  }
}
</script>
<style src="vue-d3-barchart/dist/vue-d3-barchart.css"></style>
<style lang="stylus">
@import './lib/styl/app.styl'
@import './lib/styl/nodes.styl'
  .maximized-chart
    position:absolute
    display: flex
    justify-content: center
    align-items: center
    top:0
    width: 100%
    max-width: 100%
    min-height: 100%
    z-index: 900
    .chart
      padding: 2em

</style>

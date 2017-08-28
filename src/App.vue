<template lang="pug">
  #app.main(@keyup.esc='setTool("pointer")')
    
    //- snapshots hint
    .snapshot-hint(v-if='!isLive')
      small.hint running in snapthot mode
      button.btn.live(@click='goLive()') go Live

    //- Maximized chart
    .maximized-chart(v-if='maxChart')
       chart( :title='maxChart.title' :chart='maxChart.chart' :options='maxChart.options' maximized='true')
    
    //- Nodes table
    dialog-drag(v-if='showTable' id='table' @close='showHideTable()' class='dialog-table')
      nodes-table
    
    //- Layout
    .layout( v-if='connected')
      .col-a
        big-data(title="Best Block" :data="totals.bestBlock" icon="icon-cube")
        //- REVIEW
        big-data(title="Last Block" :data='lastBlock | m-seconds-ago' sufix=" ago" icon="icon-cubes" )
        //- p {{totals.lastBlock}} - {{lastBlock }} {{now}}
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
        chart(title='Gas Spending' chart='gasSpending')
        chart(title='Transaction Density' chart='transactionDensity' )
    

    //-> Network
    d3-network(
      v-if='connected'
      :netNodes="nodes"
      :netLinks="links"
      :selection="selection"
      :node-sym='nodeSym'
      :options="options"
      :nodeCb='nodeFilter'
      @node-click="nodeClick"
      @link-click="linkClick"
      class="net"
      )
    //- if not connected  
    .center.loading(v-else)
      img(class="logo" src="static/rsk-logo.png")
      h1.center connecting to server  

    //- interface background
    iface-back(:size='options.size')

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
        :id='dialog.id'
        @close='unSelectNode(dialog.id)'
        @move='updateNodeDialog'
        )
        node-watcher( 
          :dialog='dialog'
          :index='index'
          )
    .over
    
      //- Menu
      .menu(v-if="showMenu")
        .close(@click="showMenu=false")
        stats-menu(:nodes="nodes" :links="links" :options="options" @options="changeOptions" @reset="resetOptions")
      
      //- Snapshots dialog  
      dialog-drag(v-if='showSnapshots' title='Snapshots' id='snapshots-list'
          @move='updateSnapshotsListPos'
          @close='showSnapshots = false' 
          :options='snapshotsListOptions'
          )
        snapshots-list
      .options
        //- menu button 
        button.btn.menu(@click="showMenu = !showMenu")
          span.icon-settings
        //- snapshots button  
        button.btn.badge(@click='showSnapshots = !showSnapshots')
          span.icon-versions
          span.badge(v-if='totalSnapshots') {{ totalSnapshots }}
        //- table button
        button.btn(@click='showHideTable()')
          span.icon-table
        h1
          span.icon-rsk
          span &nbsp; rsk network
        ul.inline
          li nodes: {{ nodes.length }}
          li actives: {{ activeNodes.length }} 
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import defaultData from './data.js'
import D3Network from 'vue-d3-network'
import StatsMenu from './components/StatsMenu'
import DialogDrag from 'vue-dialog-drag'
import IfaceBack from './components/ifaceBack.vue'
import NodeWatcher from './components/NodeWatcher.vue'
import BigData from './components/BigData.vue'
import Chart from './components/Chart.vue'
import SnapshotsList from './components/SnapShotsList.vue'
import { tSecondsAgo, mSecondsAgo, sSeconds } from './filters/TimeFilters.js'
import { numerals } from './filters/NumberFilters.js'
import { blues, redGreen } from './lib/js/colors.js'
import nodeIcon from '!!raw-loader!./assets/node.svg'
import { locStorage as storage } from './lib/js/io.js'
import NodesTable from './components/NodesTable.vue'
import { nodeFilter } from './filters/nodes.js'
export default {
  name: 'NetStats',
  components: {
    D3Network,
    StatsMenu,
    DialogDrag,
    NodeWatcher,
    BigData,
    Chart,
    NodesTable,
    IfaceBack,
    SnapshotsList
  },
  filters: {
    tSecondsAgo,
    mSecondsAgo,
    sSeconds,
    numerals
  },
  data () {
    let data = Object.assign({}, defaultData)
    data.options.size = { w: 500, h: 500 }
    data.options.offset = { x: 0, y: 0 }
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
    data.unclesColors = blues
    data.redGreen = redGreen
    data.nodeSym = nodeIcon
    data.nodeFilter = nodeFilter
    return data
  },
  created () {
    let savedOptions = storage.get('options')
    if (savedOptions) this.options = Object.assign({}, savedOptions)
    let savedSnapshots = storage.get('snapshots')
    this.$store.dispatch('init', { snapshots: savedSnapshots })
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
      if (newValue) storage.set('options', newValue)
      this.options = newValue
    },
    snapshots (newValue) {
      storage.set('snapshots', newValue)
    }
  },
  computed: {
    ...mapState({
      state: state => state,
      totals: state => state.backendData.totals,
      charts: state => state.backendData.charts,
      maxChart: state => state.app.maximizedChart,
      snapshots: state => state.snapshots,
      showTable: state => state.app.showTable
    }),
    ...mapGetters({
      connected: 'isConnected',
      size: 'getSize',
      activeNodes: 'getActivesNodes',
      nodes: 'getNodesArr',
      links: 'getLinksArr',
      isLive: 'isLive',
      totalSnapshots: 'totalSnapshots',
      snapshotsListOptions: 'getSnapshotsListOptions',
      now: 'getDate'
    }),
    ...mapGetters('app/', {
      selection: 'selection',
      dialogs: 'getNodeDialogs'
    }),

    lastBlock () {
      let lb = this.totals.lastBlock
      return (lb) ? this.now - lb : 0
    },
    blockChart () {
      return this.charts.blockPropagationChart.map((d) => {
        return d.x
      })
    }
  },
  methods: {
    ...mapActions([
      'setSize',
      'takeSnapshot',
      'loadSnapshot',
      'goLive',
      'updateSnapshotsListPos'
    ]),
    ...mapActions('app/', [
      'selectNode',
      'selectLink',
      'unSelectNode',
      'unSelectLink',
      'selectNodeLinks',
      'pinNode',
      'updateNodeDialog',
      'showHideTable'
    ]),
    ...mapGetters('app/', [
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
      this.options.size = this.size
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
@import './lib/styl/vars.styl'
@import './lib/styl/app.styl'
@import './lib/styl/nodes.styl'
  .iface-back
    position: absolute
    top: 0 
    left: 0
    z-index: 1
    pointer-events: none
  
  .debug
    position: absolute
    z-index: 100 

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
   .snapshot-hint
    position: absolute
    min-height: 99.5%
    min-width: 99.5%
    text-align: center
    top: 0
    left: 0
    border: $warn dashed 1px
    .live
      position: absolute
      z-index: 1000
    .hint
      color: $color2
  


</style>

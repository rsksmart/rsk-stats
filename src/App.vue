<template lang="pug">
  #app.main(@keyup.esc='setTool("pointer")')
    //- snapshots hint
    .snapshot-hint(v-if='!isLive')
      small.hint running in snapthot mode
      button.btn.live(@click='goLive()') go Live

    //- Nodes table
    dialog-drag.dialog-table(v-if='showTable' id='table' ref='table'
      :options='tableOptions'
      @close='showHideTable()' 
      @load='tableLoaded')
      icon(name='close' slot='button-close')
      icon(name='pin' slot='button-pin')
      icon(name='pinned' slot='button-pinned')
      nodes-table
    
    //- Layout
    .layout( v-if='connected')
      .col-a
        big-data(name='bestBlock')
        big-data(name='lastBlockTime')
        big-data(name='avgBlockTime')
        
        mini-chart(name='uncleCountChart')
        mini-chart(name='lastBlocksTime')
        mini-chart(name='difficultyChart')
        
      .col-b 
      .col-c
        big-data(name='lastDifficulty')
        big-data(name='avgHashrate')
        big-data(name='uncles')
        
        //- h6 blockPropagationChart
        //-chart(:data='blockChart')
        
        mini-chart( name='lastGasLimit')
        mini-chart( name='gasSpending')
        mini-chart( name='transactionDensity' )
    

    //- Node Data
    //-node-data(v-for='node,id in nodes' :node='node' :key='id' :size='options.nodeSize')
    //-> Network
    d3-network(v-if='connected'
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
            icon(:name='t.icon')

    //- Dialogs
    main-dialog(v-for="(dialog,index) in dialogs" :key='index' :dialog='dialog')
  
    .over
      //- Menu
      .menu(v-if="showMenu")
        stats-menu(:nodes="nodes" :links="links" :options="options" @options="changeOptions" @reset="resetOptions")
          button.close(@click="showMenu = false" slot="header")
            icon(name='close')
      
      //- Snapshots 
      snapshots-list(v-if='showSnapshots' id='snapshots-list' @close='showSnapshots = false')
        h4.title(slot='title') Snapshots
      
      .options
        //- menu button 
        button.btn.menu(@click="showMenu = !showMenu")
          icon(name='settings')
        //- snapshots button  
        button.btn.badge(@click='showSnapshots = !showSnapshots')
          icon(name='versions')
          span.badge(v-if='totalSnapshots') {{ totalSnapshots }}
        //- table button
        button.btn(@click='showHideTable()')
          icon(name='table')
        h1
          icon(name='rsk')
          span &nbsp; rsk network
        ul.inline
          li nodes: {{ nodes.length }}
          li actives: {{ activeNodes.length }} 
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { locStorage as storage } from './lib/js/io.js'

import D3Network from 'vue-d3-network'
import StatsMenu from './components/StatsMenu'
import DialogDrag from 'vue-dialog-drag'
import IfaceBack from './components/ifaceBack.vue'
import NodeWatcher from './components/NodeWatcher.vue'
import NodeData from './components/NodeData.vue'
import BigData from './components/BigData.vue'
import MiniChart from './components/MiniChart.vue'
import SnapshotsList from './components/SnapShotsList.vue'
import NodesTable from './components/NodesTable.vue'
import MainDialog from './components/MainDialog.vue'

import { nodeFilter } from './filters/nodes.js'
import { tSecondsAgo, mSecondsAgo, sSeconds } from './filters/TimeFilters.js'
import { nodeType } from './filters/TextFilters.js'
import { percent, numerals } from './filters/NumberFilters.js'

import nodeIcon from '!!raw-loader!./assets/node.svg'
import defaultData from './data.js'
import './icons'

export default {
  name: 'rsk-stats',
  components: {
    D3Network,
    StatsMenu,
    DialogDrag,
    NodeWatcher,
    BigData,
    MiniChart,
    NodesTable,
    IfaceBack,
    SnapshotsList,
    NodeData,
    MainDialog
  },
  filters: {
    tSecondsAgo,
    mSecondsAgo,
    sSeconds,
    numerals,
    nodeType,
    percent
  },
  data () {
    let data = Object.assign({}, defaultData)
    data.options.size = { w: 500, h: 500 }
    data.options.offset = { x: 0, y: 0 }
    data.tools = {
      pointer: {
        tip: 'Select',
        icon: 'pointer'
      },
      pin: {
        tip: 'click on node to pin it',
        icon: 'pin'
      }
    }
    data.tool = 'pointer'
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
      dialogs: 'getDialogs'
    }),
    ...mapGetters('app/nodesTable', {
      tableOptions: 'options'
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
    tableLoaded (data) {
      let dialog = this.$refs.table
      dialog.center()
    },
    ...mapActions([
      'setSize',
      'takeSnapshot',
      'loadSnapshot',
      'goLive'
    ]),
    ...mapActions('app/', [
      'selectNode',
      'selectLink',
      'unSelectNode',
      'unSelectLink',
      'selectNodeLinks',
      'pinNode',
      'updateDialog',
      'showHideTable',
      'closeDialog',
      'createDialog'
    ]),
    ...mapActions('app/nodesTable', {
      updateTableOptions: 'updateOptions'
    }),
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
      if (this.showTable) this.$refs.table.center()
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
  
  .mini-chart
    z-index: 50
    position:relative
    pointer-events all

</style>

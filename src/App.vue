<template lang="pug">
#app.wrapper
    //- snapshots hint
    .snapshot-hint(v-if='!isLive')
      small.hint.color2 running in snapthot mode
      button.btn.live(@click='goLive()') go Live
    
    header
      logo
      .header-content
      .menu
        button.btn.big.main-menu
          icon(name='equalizerh')
    .content
      .col-a
        .col-content
          .node-box.big-data(@touchstart.prevent='showHideTable()')
            .bd-main
              button.btn.badge.big(@click.stop='showHideTable()')
                icon(name='table')
                span.badge {{ activeNodes.length }}
              button.big-txt(@click.stop='showHideTable()') tracked nodes {{ nodes.length }} 
              //-{{ activeNodes.length }}
          big-data(v-for='name,index in bigDataFields ' 
          v-if='!isVisibleDialog()(types.TOTAL,name)'
          :key='name'
          :name='name'
          :options='{minimized:(name === "gasLimit" || name === "gasPrice" || name ==="uncles")}'
          )
          
          .options
            button.btn(@click="showMenu = !showMenu")
              icon(name='settings')
            button.btn.badge(@click='showSnapshots = !showSnapshots')
              icon(name='versions')
              span.badge(v-if='totalSnapshots') {{ totalSnapshots }}
            button.btn(v-for='t,to in tools' @click='setTool(to)' :class='buttonClass(to)')
              icon(:name='t.icon')


      .col-b#main
        //- col-c 
        aside.col-c
      .col-c
        .col-content
          //- h6 blockPropagationChart
          //-chart(:data='blockChart')

          //- CHARTS --------------------------
          .box
            mini-chart(name='uncleCountChart')
          .box
            mini-chart(name='lastBlocksTime')
          .box
            mini-chart(name='difficultyChart')
          .box
            mini-chart(name='gasSpending')
          .box
            mini-chart(name='transactionDensity' )
            //-mini-chart(name='lastGasLimit')
          .box
            mini-chart(name='blockPropagationChart')
      footer
        p rsk
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
      :style='absStyle'
      )    
      //- interface background 
    iface-back(:size='options.size'  :style='absStyle')
     

      
      //- Dialogs
    .dialogs
      main-dialog(v-for="(dialog,index) in dialogs" :key='dialog.type + "-" + dialog.id' :dialog='dialog')
      
    //- Menu
    .over
      .menu(v-if="showMenu")
        stats-menu(:nodes="nodes" :links="links" :options="options" @options="changeOptions" @reset="resetOptions")
          button.close(@click="showMenu = false" slot="header")
            icon(name='close')
    
      
    //- table
    dialog-drag.dialog-table(v-if='showTable' id='table-dialog' ref='table'
      :key='"dialog-table"'
      :options='tableOptions'
      @close='showHideTable()' 
      @load='tableLoaded')
      icon(name='close' slot='button-close')
      icon(name='pin' slot='button-pin')
      icon(name='pinned' slot='button-pinned')
      nodes-table
    
    //- Snapshots 
    dialog-drag(v-if='showSnapshots' id="snapshots" title="Snapshots"
      :key='"dialog-snaps"'
      :options="{top:0, left:0,centered:true}" 
      @close='showSnapshots = false')
      icon(name="close" slot="button-close")
      
      snapshots-list( id='snapshots-list')       
    
    //- Not connected section
    .loading(v-if='!connected')
      h2.center requesting server data...
      


</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { locStorage as storage } from './lib/js/io.js'

import D3Network from 'vue-d3-network'
import StatsMenu from './components/StatsMenu'
// import DialogDrag from 'vue-dialog-drag'
import DialogDrag from './components/vue-dialog-drag.vue'
import Logo from './components/Logo.vue'
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
import { nodeType, yesNo } from './filters/TextFilters.js'
import { percent, numerals, toInt, numeralsSuffix } from './filters/NumberFilters.js'

import nodeIcon from '!!raw-loader!./assets/node.svg'
import defaultData from './data.js'
import './icons'

export default {
  name: 'rsk-stats',
  components: {
    Logo,
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
    percent,
    yesNo,
    toInt,
    numeralsSuffix
  },
  data () {
    let data = Object.assign({}, defaultData)
    data.center = {
      top: 0,
      left: 0
    }
    data.abs = {
      left: 0,
      top: 0,
      width: 0,
      height: 0
    }
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
    data.bigDataFields = [
      'bestBlock',
      'lastBlockTime',
      'avgBlockTime',
      'lastDifficulty',
      'avgHashrate',
      'uncles',
      'gasPrice',
      'gasLimit'
    ]
    return data
  },
  created () {
    let savedOptions = storage.get('options')
    if (savedOptions) this.options = Object.assign({}, savedOptions)
    let savedSnapshots = storage.get('snapshots')
    this.$store.dispatch('init', { snapshots: savedSnapshots })
  },
  mounted () {
    let vm = this
    this.$nextTick(() => {
      vm.onResize()
    })
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
      now: 'getDate',
      types: 'app/getTypes'
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
    },
    absStyle () {
      return this.addPx(this.abs)
    }
  },
  methods: {
    tableLoaded (data) {
      let dialog = this.$refs.table
      dialog.center()
      if (dialog.top < 0) dialog.top = 0
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
      'isLinkSelected',
      'isVisibleDialog'
    ]),
    onResize () {
      let size = { w: this.$el.clientWidth, h: this.$el.clientHeight }
      this.setSize(size)
      if (this.showTable) this.$refs.table.center()

      let main = document.querySelector('#main')
      let vW = window.innerWidth
      let width = this.$el.clientWidth
      let height = main.scrollHeight + main.offsetTop
      let left = 0
      let top = 0
      let x = 10
      let y = 0
      if (vW > 900 && vW < 1200) {
        x = main.offsetLeft / 2
      }

      this.abs = { width, height, left, top }
      this.center.left = (main.clientWidth / 2) + main.offsetLeft
      this.center.top = (main.clientHeight / 2) + main.offsetTop

      let options = this.options
      options.size = { w: width, h: height }
      options.offset = { x, y }
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
    addPx (style) {
      Object.keys(style).map((key) => {
        style[key] += 'px'
      })
      return style
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

<style lang="stylus">
@import './lib/styl/vars.styl'
@import './lib/styl/app.styl'
@import './lib/styl/nodes.styl'
 
   #app
    min-height: 100%

  .iface-back
    position: absolute
    top: 0 
    left: 0
    border 0
    margin 0
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
  
  .mini-chart, .big-data
    z-index: 50
    position:relative
    pointer-events all
  
  .options
    padding: .5em 2em
    text-align: center
    display flex
    justify-content center
    align-items: center
    z-index: 100
    margin-top: 1em
    position: relative
    left:0
      button
          font-size: 2em
          width 2em
          height 2em
    .selected *
      fill: $color2
  

</style>

<template lang="pug">
#app.wrapper(@keyup.esc='keyEsc')
    //- snapshots hint
    .snapshot-hint(v-if='!isLive')
      small.hint.color2 running in snapshot mode
      button.btn.live(@click='goLive()') go Live
    
    .header-wrapper
      header
        .head-1  
          logo#logo-head
        .head-2
          button.btn.big.main-menu(@click='showMenu=!showMenu' aria-label="main menu")
            icon(name='equalizerh')
       
          .menu(v-if='showMenu')
            button.btn(@click="showConfig = !showConfig")
              icon(name='settings')
            button.btn.badge(@click='showSnapshots = !showSnapshots')
              icon(name='versions')
              span.badge(v-if='totalSnapshots') {{ totalSnapshots }}
            button.btn(v-for='t,tool in tools' @click='setTool(tool)' :class='buttonClass(tool)' aria-label="tools")
              icon(:name='t.icon')
        .head-3
    .content
      //- COl-A
      .col-a
        .col-content
          logo#logo-col
          .node-box.big-data(@touchstart.prevent='showHideTable()')
            .bd-main
              button.btn.badge.big(@click.stop='showHideTable()' aria-label="table")
                icon(name='table')
                span.badge {{ activeNodes.length }}
              button.big-txt(@click.stop='showHideTable()'  aria-label="table") tracked nodes {{ nodes.length }} 
          big-data(v-for='name,index in bigDataFields ' 
          v-if='!isVisibleDialog()(types.TOTAL,name)'
          :key='name'
          :name='name'
          :options='{minimized:(name === "gasLimit" || name === "gasPrice" || name ==="uncles")}'
          )
          miners-chart
          
      //- COl-B Main
      .col-b#main
        //- Not connected 
        .loading(v-if='!connected')
          h2.center requesting server data...
      //- COl-C
      .col-c
        .col-content
          //- CHARTS --------------------------
          .box(v-for='show,name,index in charts')
            //- v-if fails in firefox
            mini-chart(v-if='show' v-show='show' :name='name' :key='index')
    
    //-  footer
        p rsk
    d3-network#network(v-if='connected'
      :netNodes="nodes"
      :netLinks="links"
      :selection="selection"
      :node-sym='nodeSym'
      :options="options"
      :nodeCb='nodeFilter'
      @node-click="nodeClick"
      @link-click="linkClick"
      class="net"
      :style='mainStyle'
      )    
      //- interface background 
    iface-back(:size='options.size'  :style='mainStyle' :center='center')
      
      //- Dialogs
    .dialogs
      main-dialog(v-for="(dialog,index) in dialogs" :key='dialog.type + "-" + dialog.id' :dialog='dialog')
      
    //- Config
    .over
      stats-menu(v-if="showConfig" :nodes="nodes" :links="links" :options="options" @options="changeOptions" @reset="resetOptions")
        button.close(@click="showConfig = false" slot="header" aria-label="close")
          icon(name='close')
    
    //- Snapshots 
    dialog-drag(v-if='showSnapshots' id="snapshots" title="Snapshots"
      :key='"dialog-snaps"'
      :options="{top:0, left:0,centered:true}" 
      @close='showSnapshots = false')
      icon(name="close" slot="button-close")
      
      snapshots-list( id='snapshots-list')       
      
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { locStorage as storage } from './lib/js/io.js'

import D3Network from 'vue-d3-network'
import StatsMenu from './components/StatsMenu'
import DialogDrag from 'vue-dialog-drag'
import Logo from './components/Logo.vue'
import IfaceBack from './components/ifaceBack.vue'
import NodeWatcher from './components/NodeWatcher.vue'
import NodeData from './components/NodeData.vue'
import BigData from './components/BigData.vue'
import MiniChart from './components/MiniChart.vue'
import MinersChart from './components/MinersChart.vue'
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
    MainDialog,
    MinersChart
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
    data.mainVp = {
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
    data.showMenu = false
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
      snapshots: state => state.snapshots
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
      charts: 'app/charts/showCharts'
    }),
    ...mapGetters('app/', {
      selection: 'selection',
      dialogs: 'getDialogs',
      types: 'getTypes'
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
    mainStyle () {
      return this.addPx(Object.assign({}, this.mainVp))
    },
    center () {
      let mvp = this.mainVp
      let x = mvp.width / 2 + this.options.offset.x
      let y = mvp.height / 2 + this.options.offset.y
      return { x, y }
    }
  },
  methods: {
    keyEsc (event) {
      if (!this.isLive) this.goLive()
    },
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
      'isVisibleDialog',
      'getDialog'
    ]),
    onResize () {
      let size = { w: this.$el.clientWidth, h: this.$el.clientHeight }
      this.setSize(size)
      let vm = this
      this.$nextTick(() => {
        let main = document.querySelector('#main')
        let vW = window.innerWidth
        let width = vm.$el.clientWidth
        let height = main.scrollHeight
        let left = 0
        let top = 0
        let x = 0
        let y = 0
        if (vW > 900 && vW < 1200) {
          x = main.offsetLeft / 2
        }

        this.mainVp = { width, height, left, top }
        let options = vm.options
        options.size = { w: width, h: height }
        options.offset = { x, y }
        vm.changeOptions(options)
      })
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
  #network
    z-index 99  
  .main-menu
    z-index 500
  .menu
    display inline-block
    margin-top 5rem
    button
      display block
  .over
    position: absolute
    top: 0
    right: 0
    z-index: 100
    padding: 1em

  .iface-back
    position: absolute
    top: 0 
    left: 0
    border 0
    margin 0
    z-index: 1
    pointer-events: none

  .snapshot-hint
    position: absolute
    min-height: 99.5%
    min-width: 99.5%
    display inline-block
    text-align: center
    box-sizing border-box
    top: 0
    left: 0
    border: $warn dashed 1px
    z-index 900
    pointer-events none
  .live
    position: absolute
    pointer-events all
    z-index: 1000 !important
    .hint
      color: $color2
  
  .mini-chart, .big-data
    z-index: 50
    position:relative
    pointer-events all
  
 
  

</style>

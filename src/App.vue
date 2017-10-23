<template lang="pug">
#app(@keyup.esc='keyEsc')
  .wrapper
    //- snapshots hint
    .snapshot-hint(v-if='!isLive')
      small.hint.color2 running in snapshot mode
      button.btn.live(@click='goLive()') go Live
    //- Menu
    app-menu(v-if='showMenu' @close='menuShow(false)')
    .header-wrapper
      header
        .head-1  
          logo 
        .head-2
       
        .head-3
          //- Menu Button & tools
          transition(name='menu-buttons')
            .main-menu(v-if='!showMenu')
              button.btn.dark.big(v-for='t,tool in tools' @click='setTool(tool)' :class='toolClass(tool)' aria-label="tools")
                icon(:name='t.icon')
              button.btn.big.dark( @click='menuShow' aria-label="main menu")
                icon(name='equalizerh')
    .content
      //- COl-A
      .col-a#col-a
        .col-content
          .node-box.big-data.mini(v-if='hasNodes' @touchstart.passive='showHideTable()')
            .bd-main
              button.btn.dark.badge(@click.prevent='showHideTable()' aria-label="table")
                icon(name='table')
                span.badge {{ activeNodes.length }}
              button.big-txt(@click.prevent='showHideTable()' aria-label="table") &nbsp;&nbsp;tracked nodes {{ nodes.length }} 
          //-Miners
          miners-chart
          //- Totals
          big-data( v-for='bd,name,index in bigDataFields ' 
          v-if='bd.show && !isVisibleDialog()(types.TOTAL,name)'
          :key='name'
          :name='name'
          :options='{minimized:bd.minimized}'
          )

          
      //- COl-B Main
      .col-b#main
        //- Not connected 
        .loading(v-if='!hasNodes')
          h2.center(v-if='!connected') connecting to server...
          h2.center(v-else) requesting server data...
          
      //- COl-C
      .col-c#col-c
        .col-content
          //- charts
          .box(v-if='connected' v-for='show,name,index in charts')
            //- v-if fails in firefox
            mini-chart(v-if='show'  :name='name' :key='index+name')
    
    //-  footer
        p rsk
    //- Node data
    transition(name='fade-nodes')
      #node-data(v-if='hasNodes && config.showNodeInfo')
        node-data(v-for='node,id in nodes' :node='node' :size='options.nodeSize' :key='id')        
    transition(name='fade-nodes')
      d3-network#network.net(
      v-if='hasNodes'
      :netNodes="nodes"
      :netLinks="links"
      :selection="selection"
      :node-sym='nodeSym'
      :options='options'
      :nodeCb='nodeFilter'
      @node-click="nodeClick"
      @link-click="linkClick"
      :class='netClass'
      :style='mainStyle'
      )    

      //- interface background 
    iface-back(:size='options.size'  :style='mainStyle' :center='center')
    //-transition(name='apply-mask')
      iface-mask(v-if='hasNodes' :size='options.size'  :style='mainStyle' :center='center')  
      //- Dialogs
    .dialogs
      main-dialog(v-for="(dialog,index) in dialogs" :key='dialog._key' :dialog='dialog')
      
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { locStorage as storage } from './lib/js/io.js'

import D3Network from 'vue-d3-network'
import DialogDrag from 'vue-dialog-drag'
import Logo from './components/Logo.vue'
import IfaceBack from './components/ifaceBack.vue'
import NodeWatcher from './components/NodeWatcher.vue'
import NodeData from './components/NodeData.vue'
import BigData from './components/BigData.vue'
import MiniChart from './components/MiniChart.vue'
import MinersChart from './components/MinersChart.vue'
import NodesTable from './components/NodesTable.vue'
import MainDialog from './components/MainDialog.vue'
import AppMenu from './components/AppMenu.vue'
import IfaceMask from './components/IfaceMask.vue'
import { nodeFilter } from './filters/nodes.js'
import { tSecondsAgo, mSecondsAgo, sSeconds } from './filters/TimeFilters.js'
import { nodeType, yesNo } from './filters/TextFilters.js'
import { percent, numerals, toInt, numeralsSuffix } from './filters/NumberFilters.js'

import nodeIcon from '!!raw-loader!./assets/node.svg'
import './icons'
export default {
  name: 'rsk-stats',
  components: {
    Logo,
    D3Network,
    DialogDrag,
    NodeWatcher,
    BigData,
    MiniChart,
    NodesTable,
    IfaceBack,
    NodeData,
    MainDialog,
    MinersChart,
    AppMenu,
    IfaceMask
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
    return {
      mainVp: {
        left: 0,
        top: 0,
        width: 0,
        height: 0
      },
      tools: {
        pointer: {
          tip: 'Select',
          icon: 'pointer'
        },
        pin: {
          tip: 'click on node to pin it',
          icon: 'pin'
        }
      },
      tool: 'pointer',
      nodeSym: nodeIcon,
      nodeFilter: nodeFilter,
      showMenu: false,
      resizeTimeout: null
    }
  },
  created () {
    let config = storage.get('config')
    let snapshots = storage.get('snapshots')
    this.$store.dispatch('init', { snapshots, config })
  },
  mounted () {
    this.onResize()
    window.addEventListener('resize', this.resizeThrottler, false)
  },
  beforeDestroy () {
    window.removeEventListener('resize', this.resizeThrottler)
  },
  computed: {
    ...mapState({
      state: state => state,
      snapshots: state => state.snapshots,
      breakpoints: state => state.mediaBreakpoints
    }),
    ...mapGetters({
      connected: 'isConnected',
      size: 'getSize',
      activeNodes: 'getActivesNodes',
      nodes: 'getNodesArr',
      links: 'getLinksArr',
      isLive: 'isLive',
      totalSnapshots: 'totalSnapshots',
      options: 'getNetOptions',
      snapshotsListOptions: 'getSnapshotsListOptions',
      now: 'getDate',
      config: 'getConfig'
    }),
    ...mapGetters('app/', {
      selection: 'selection',
      dialogs: 'getDialogs',
      types: 'getTypes',
      charts: 'charts/showCharts',
      bigDataFields: 'bigDataFields'
    }),
    ...mapGetters('app/nodesTable', {
      tableOptions: 'options'
    }),
    netClass () {
      return (this.tool === 'pin') ? 'cross-cursor' : ''
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
    },
    hasNodes () {
      return this.nodes.length
    }
  },
  methods: {
    ...mapActions([
      'setSize',
      'takeSnapshot',
      'loadSnapshot',
      'goLive',
      'updateCols'
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
    resizeThrottler () {
      // ignore resize events as long as an actualResizeHandler execution is in the queue
      if (!this.resizeTimeout) {
        let vm = this
        this.resizeTimeout = setTimeout(() => {
          vm.resizeTimeout = null
          vm.onResize()
        }, 66)
      }
    },
    menuShow (show) {
      show = (undefined === show) ? !this.showMenu : show
      this.showMenu = show
    },
    keyEsc (event) {
      if (!this.isLive) this.goLive()
    },
    tableLoaded (data) {
      let dialog = this.$refs.table
      dialog.center()
      if (dialog.top < 0) dialog.top = 0
    },
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
        if (vW > vm.breakpoints.medium && vW < vm.breakpoints.large) {
          x = main.offsetLeft / 2
        }

        this.mainVp = { width, height, left, top }
        let options = vm.options
        options.size = { w: width, h: height }
        options.offset = { x, y }
        vm.changeOptions(options)
        let cols = { a: this.getCol('col-a'), c: this.getCol('col-c') }
        this.updateCols(cols)
      })
    },
    getCol (id) {
      let el = document.querySelector('#' + id)
      if (el) {
        return { w: el.clientWidth, h: el.clientHeight }
      }
    },
    showSelection () {
      return Object.keys(this.selection.nodes).length + Object.keys(this.selection.links).length
    },
    toolClass (tool) {
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
    },
    changeOptions (options) {
      this.$store.commit('SET_CONFIG_GROUP', ['netOptions', options])
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
  @import './lib/styl/vars.styl';
  @import './lib/styl/app.styl';
  @import './lib/styl/nodes.styl';

  #network {
    z-index: 90;
    overflow: hidden;
  }

  #node-data {
    z-index: 91;
  }

  .main-menu {
    z-index: 190;
  }

  .app-menu {
    z-index: 200;
  }

  .iface-back, .iface-mask {
    position: absolute;
    top: 0;
    left: 0;
    border: 0;
    margin: 0;
    z-index: 1;
  }

  // -pointer-events: none
  .iface-mask {
    z-index: 91;
    mix-blend-mode: multiply;
    opacity: 1;
    will-change: opacity;
  }

  .apply-mask-enter-active {
    transition: opacity 0.5s ease-out;
  }

  .apply-mask-enter, .apply-mask-leave-to {
    will-change: opacity;
    opacity: 0;
  }

  .fade-nodes {
    will-change: opacity;
  }

  .fade-nodes-enter-active {
    transition: opacity 3s ease-out;
    opacity: 1;
  }

  .fade-nodes-enter, .fade-nodes-leave-to {
    opacity: 0;
  }

  .menu-buttons-enter-active {
    transition: opacity 0.5s ease;
    opacity: 1;
  }

  .menu-buttons-enter, .menu-buttons-leave-to {
    opacity: 0;
  }

  .snapshot-hint {
    position: absolute;
    min-height: 99.5%;
    min-width: 99.5%;
    display: inline-block;
    text-align: center;
    box-sizing: border-box;
    top: 0;
    left: 0;
    border: $warn dashed 1px;
    z-index: 900;
    pointer-events: none;
  }

  .live {
    position: absolute;
    pointer-events: all;
    z-index: 1000 !important;

    .hint {
      color: $color2;
    }
  }

  .loading {
    position: relative;
    z-index: 1000;
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 100%;
    min-height: 100%;
  }

  .mini-chart, .big-data {
    z-index: 50;
    position: relative;
    pointer-events: all;
  }
</style>

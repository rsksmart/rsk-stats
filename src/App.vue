<template>
  <div id="app" @keyup.esc="keyEsc">
    <div class="wrapper">
      <div class="snapshot-hint" v-if="!isLive"><small class="hint color2">running in snapshot mode</small>
        <button class="btn live" @click="goLive()">go Live</button>
      </div>
      <app-menu v-if="showMenu" @close="menuShow(false)"></app-menu>
      <header id="header" class="header-wrapper">
        <logo />
        <div class="hint" v-if="showHint">
          <p>This page does not represent the entire state of the RSK Network</p>
          <button @click="showHint=false">
            <icon class="color2" name="close"></icon>
          </button>
        </div>
        <div class="content-network">
          <a :href="isNetworkmainnet ? DOMAIN_TESTNET : 'javascript:void(0)'" class="btn" :class="!isNetworkmainnet ? 'btn-active' : 'btn-go'">
            <span class="large-text">Testnet</span>
            <span class="short-text">TN</span>
            <img v-if="isNetworkmainnet" src="@/assets/svg/arrow-go.svg" alt="">
          </a>
          <a :href="isNetworkmainnet ? 'javascript:void(0)' : DOMAIN_MAINNET" class="btn" :class="isNetworkmainnet ? 'btn-active' : 'btn-go'">
            <span class="large-text">Mainnet</span>
            <span class="short-text">MN</span>
            <img v-if="!isNetworkmainnet" src="@/assets/svg/arrow-go.svg" alt="">
          </a>
        </div>
      </header>
      <div class="content" v-if="connected && hasNodes">
        <div class="content-blocks" id="col-a">
          <div class="col-content">
            <div class="node-box" v-if="hasNodes">
              <div class="tracked-nodes" @click="showHideTable()">
                <!-- pending Table -->
                <button class="chart-title" @click="showHideTable()">
                <!-- <div class="chart-title"> -->
                  Tracked Nodes {{ nodes.length }}
                </button>
                <div class="content-img">
                  <icon name="server" />
                </div>
              </div>
            </div>
            <miners-chart />
            <template v-for="(bd, name) in bigDataFields">
              <big-data v-if="bd.show && !isVisibleDialog()(types.TOTAL, name)"
                :key="name"
                :name="name"
                :options="{minimized: bd.minimized}">
              </big-data>
            </template>
          </div>
        </div>
        <div class="content-nodes" id="main">
          <div class="loading" v-if="!hasNodes">
            <h2 class="center" v-if="!connected">connecting to server...</h2>
            <h2 class="center" v-else>requesting server data...</h2>
          </div>
          <div v-else class="container-nodes">
            <div class="nodes-title">List of Nodes</div>
            <div class="items">
              <div class="item" v-for="node, i in nodes" :key="i">
                <div class="info">
                  <div>{{ node.name.substring(0, 20) }}...</div>
                  <button class="detail" @click="nodeClick('', node)">see detail</button>
                </div>
                <img src="@/assets/svg/world.svg" alt="">
              </div>
            </div>
          </div>
        </div>
        <div class="content-chart" id="col-c" v-if="connected">
          <div class="col-content">
            <div class="box" v-for="show,name,index in charts" :key="index">
              <mini-chart v-if="show" :name="name" :key="index+name" />
            </div>
          </div>
        </div>
      </div>
      <div class="content-spiner" v-else>
        <spinner :height="300" :width="300" :border="5" />
      </div>
      <main-dialog v-for="(dialog) in dialogs" :key="dialog._key" :dialog="dialog"></main-dialog>
      <Footer v-if="connected && hasNodes" />
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import { locStorage as storage } from './lib/js/io.js'
import { DOMAIN_TESTNET, DOMAIN_MAINNET, isNetworkmainnet } from './config/network'
import Logo from './components/Logo.vue'
import BigData from './components/BigData.vue'
import MiniChart from './components/MiniChart.vue'
import MinersChart from './components/MinersChart.vue'
import MainDialog from './components/MainDialog.vue'
import AppMenu from './components/AppMenu.vue'
import { nodeFilter } from './filters/nodes.js'
import { tSecondsAgo, mSecondsAgo, sSeconds } from './filters/TimeFilters.js'
import { nodeType, yesNo } from './filters/TextFilters.js'
import { percent, numerals, toInt, numeralsSuffix } from './filters/NumberFilters.js'
import Footer from './components/Footer.vue'
import nodeIcon from './assets/node.svg?raw'
import './icons'
import Spinner from './components/Loaders/Spinner.vue'
export default {
  name: 'rsk-stats',
  components: {
    Logo,
    BigData,
    MiniChart,
    MainDialog,
    MinersChart,
    AppMenu,
    Spinner,
    Footer
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
      DOMAIN_MAINNET,
      DOMAIN_TESTNET,
      isNetworkmainnet,
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
      resizeTimeout: null,
      showHint: true
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
      let { width, height } = this.mainVp
      let { offset } = this.options
      offset = offset || { x: 0, y: 0 }
      let x = width / 2 + offset.x
      let y = height / 2 + offset.y
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
      let size = {
        w: this.$el.clientWidth,
        h: this.$el.clientHeight
      }
      this.setSize(size)
      let vm = this
      this.$nextTick(() => {
        let main = document.querySelector('#main')
        let header = document.querySelector('#header')
        let vW = window.innerWidth
        let width = vm.$el.clientWidth
        let height = main?.scrollHeight || 0
        let left = 0
        let top = 0
        let x = 0
        let y = 0
        if (vW > vm.breakpoints.medium && vW < vm.breakpoints.large) {
          x = main.offsetLeft / 2
        }
        // set top for small
        if (vW < vm.breakpoints.medium) {
          top = header.clientHeight
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
  // @import './lib/styl/vars.styl'
  // @import './lib/styl/app.styl'
  // @import './lib/styl/nodes.styl'

  // #network
  //   z-index 90
  //   overflow hidden

  // #node-data
  //   position absolute
  //   pointer-events none
  //   z-index 91

  // .main-menu
  //   z-index 190

  // .app-menu
  //   z-index 200

  // .iface-back, .iface-mask
  //   position absolute
  //   top 0
  //   left 0
  //   border 0
  //   margin 0
  //   z-index 1

  // // -pointer-events: none
  // .iface-mask
  //   z-index 91
  //   mix-blend-mode multiply
  //   opacity 1
  //   will-change opacity

  // .apply-mask-enter-active
  //   transition opacity 0.5s ease-out

  // .apply-mask-enter, .apply-mask-leave-to
  //   will-change opacity
  //   opacity 0

  // .fade-nodes
  //   will-change opacity

  // .fade-nodes-enter-active
  //   transition opacity 3s ease-out
  //   opacity 1

  // .fade-nodes-enter, .fade-nodes-leave-to
  //   opacity 0

  // .menu-buttons-enter-active
  //   transition opacity 0.5s ease
  //   opacity 1

  // .menu-buttons-enter, .menu-buttons-leave-to
  //   opacity 0

  // .hint
  //   display flex
  //   align-items center
  //   justify-content center
  //   color $color2

  //   button
  //     margin 0.25em 0.5em

  // .snapshot-hint
  //   position absolute
  //   min-height 99.5%
  //   min-width 99.5%
  //   display inline-block
  //   text-align center
  //   box-sizing border-box
  //   top 0
  //   left 0
  //   border $warn dashed 1px
  //   z-index 900
  //   pointer-events none

  // .live
  //   position absolute
  //   pointer-events all
  //   z-index 1000 !important

  // .loading
  //   position relative
  //   z-index 1000
  //   display flex
  //   justify-content center
  //   align-items center
  //   min-width 100%
  //   min-height 100%

  // .mini-chart, .big-data
  //   z-index 50
  //   position relative
  //   pointer-events all
</style>

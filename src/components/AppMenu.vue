<template lang="pug">
  transition(name='slide-r')
    .app-menu.dark.panels
      .panel
        button.big(@click='emit("close")')
          icon(name='close')
      .panel.tabs
        ul.tabs
          li(:class='panelClass(config)')
            button.dark.big(@click='show(config)')
              icon(name='settings')
          li(:class='panelClass(snapshots)')
            button.dark.big(@click='show(snapshots)')
              icon(name='versions')
              span.badge(v-if='totalSnapshots') {{ totalSnapshots }}    
        //-button.btn.dark.big.badge(@click='show(charts)')
          icon(name='graph')
      .panel.snapshots(v-if='panel(snapshots)' :class='panelClass(snapshots)')
        h3 Snapshots & Layouts
        snapshots-list(id='snapshots-list')
      .panel.config(v-if='panel(config)' :class='panelClass(config)')
        h3 Configuration
        ul.list.dark
          li
            label Nodes spread: {{opts.force}}
            input(type="range" v-model.number="opts.force" @input='change' min="1" max="7000" step="10") 
          li
            label Node Size: {{opts.nodeSize}}
            input(type="range" v-model.number="opts.nodeSize" @input='change' min="5" max="200" step="1")
          li
            input(type="checkbox" @change='change' v-model="opts.nodeLabels")
            label Node names   
          li(v-if="opts.nodeLabels")
            label Font Size: 
              span {{ opts.fontSize }} 
            input(type="range" v-model="opts.fontSize" @input='change' min="5" max="30" step="1")
          li  
            button.reset(@click="reset" title="reset options" aria-label="reset options") 
              span Reset to default &nbsp;
              icon(name='reload-alt' scale='1.5')

</template>
<script>
import defaultData from '../data.js'
import { mapGetters } from 'vuex'
import SnapshotsList from './SnapShotsList.vue'
import '../icons/graph'
export default {
  name: 'app-menu',
  props: ['options'],
  components: {
    SnapshotsList
  },
  data () {
    let data = Object.assign({}, defaultData)
    data.options.offset = { x: 0, y: 0 }
    return {
      snapshots: 'snapshots',
      config: 'config',
      charts: 'charts',
      opts: data.options,
      activePanel: ''
    }
  },
  created () {
    this.opts = this.options
    this.activePanel = this.config
  },
  computed: {
    ...mapGetters({
      totalSnapshots: 'totalSnapshots'
    })
  },
  methods: {
    emit (name, args) {
      this.$emit(name, args)
    },
    show (name) {
      this.activePanel = name
    },
    panel (name) {
      return this.activePanel === name
    },
    panelClass (panel) {
      return (panel === this.activePanel) ? 'active' : ''
    },
    change () {
      this.$emit('options', this.opts)
    },
    reset () {
      this.$emit('reset', this.options)
    }
  }
}
</script>
<style lang="stylus">
@import '../lib/styl/vars.styl'
@import '../lib/styl/media_queries.styl'
  
.app-menu  
  .panel.tools
    padding-bottom 1em
    button.badge
      margin-top 0

.slide-r 
  border red solid 2px
.slide-r-enter-active, .slide-r-leave-active
  will-change transform
  transition all .5s ease
  position fixed
  
.slide-r-enter, .slide-r-leave-to
  transform translateX(100%)

</style>


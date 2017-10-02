<template lang="pug">
  transition(name='slide-r')
    .app-menu.dark.panels
      .panel
        button.big(@click='emit("close")')
          icon(name='close')
      .panel.tabs
        ul.tabs
          li(:class='panelClass(t.config)')
            button.dark.big(@click='show(t.config)')
              icon(name='settings')
          li(:class='panelClass(t.snapshots)')
            button.dark.big(@click='show(t.snapshots)')
              icon(name='versions')
              span.badge(v-if='totalSnapshots') {{ totalSnapshots }}    
        //-button.btn.dark.big.badge(@click='show(charts)')
          icon(name='graph')
      .panel.snapshots(v-if='panel(t.snapshots)' :class='panelClass(t.snapshots)')
        h3 Snapshots & Layouts
        snapshots-list(id='snapshots-list')
      .panel.config(v-if='panel(t.config)' :class='panelClass(t.config)')
        h3 Configuration
        ul.list.dark
          li 
            input(type="checkbox"  v-model='config.showNodeInfo' @change='update')
            label Show node info
          li
            label Nodes spread: {{opts.force}}
            input(type="range" v-model='opts.force' @input='update' min="1" max="7000" step="10") 
          li
            label Node Size: {{opts.nodeSize}}
            input(type="range" v-model='opts.nodeSize' @input='update'  min="5" max="200" step="1")
          li
            input(type="checkbox"  v-model="opts.nodeLabels" @change='update')
            label Node names   
          li(v-if="opts.nodeLabels")
            label Font Size: 
              span {{ opts.fontSize }} 
            input(type="range" v-model="opts.fontSize" @input='update' min="5" max="30" step="1")
          li  
            button.reset(@click="resetConfig" title="reset options" aria-label="reset options") 
              span Reset to default &nbsp;
              icon(name='reload-alt' scale='1.5')

</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import SnapshotsList from './SnapshotsList.vue'
import '../icons/graph'
export default {
  name: 'app-menu',
  components: {
    SnapshotsList
  },
  data () {
    return {
      t: {
        snapshots: 'snapshots',
        config: 'config',
        charts: 'charts'
      },
      activePanel: ''
    }
  },
  created () {
    this.activePanel = this.t.config
  },
  computed: {
    ...mapGetters({
      totalSnapshots: 'totalSnapshots',
      appConfig: 'getConfig'
    }),
    config () {
      return Object.assign({}, this.appConfig)
    },
    opts () {
      return this.config.netOptions
    }
  },
  methods: {
    ...mapActions([
      'resetConfig',
      'updateConfig'
    ]),
    update () {
      this.updateConfig(this.config)
    },
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


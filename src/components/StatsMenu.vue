<template lang="pug">
  #menu
    .header
      slot(name="header" scoped='')
    ul.setts-menu
      li
        label Nodes spread: 
        input(type="range" v-model.number="opts.force" @input="change" min="1" max="5000" step="10")  
      //-li
        label Offset X: 
          span {{ opts.offset.x }}
        input(type="range" v-model.number="opts.offset.x" @input="change" min="-100" max="100" step="1") 
      //-li
        label Offset Y: 
          span {{ opts.offset.y }}
        input(type="range" v-model.number="opts.offset.y" @input="change" min="-100" max="100" step="1") 
    ul.setts-menu
      li
        label Node Size: {{opts.nodeSize}}
        input(type="range" v-model.number="opts.nodeSize" @input="change" min="5" max="100" step="1")
      li
        input(type="checkbox" v-model="opts.nodeLabels" @change="change")
        label Node names   
      li(v-if="opts.nodeLabels")
        label Font Size: 
          span {{ opts.fontSize }} 
        input(type="range" v-model.number="opts.fontSize" @input="change" min="5" max="30" step="1")
      li  
        button.reset(@click="reset" title="reset options")
          span.icon-reset

</template>
<script>
import defaultData from '../data.js'
export default {
  name: 'stats-menu',
  props: ['links', 'nodes', 'settings', 'options'],
  data () {
    let data = Object.assign({}, defaultData)
    data.options.offset = { x: 0, y: 0 }
    return {
      opts: data.options,
      showNodeValues: false,
      showLinkValues: false,
      setts: null
    }
  },
  created () {
    this.opts = this.options
    this.setts = this.settings
  },
  watch: {
    options (newvalue) {
      this.opts = newvalue
    }
  },
  methods: {
    change () {
      this.$emit('options', this.opts)
    },
    reset () {
      // this.options.width = this.$el.clientWidth
      // this.options.height = this.$el.clientHeight
      this.$emit('reset', this.options)
    }
  }
}
</script>
<style lang="stylus" scoped>
 @import '../lib/styl/vars.styl'
 
 #menu 
  display inline-block

.debug 
  font-size: 0.5em
  list-style: none

.header
  background: $light
  button.close
    position absolute
    right -2.5em
    background: $light
    height $action-btn-size
    width $action-btn-size
    line-height $action-btn-size
    border-radius 50%
.setts-menu
  display: table-cell
  padding: 1em
  border: $border
  list-style: none
  box-shadow: $hard-sh
  background: $light
  li
    margin: 0.5em 0
    label
      font-weight: bold
      font-size: 0.85em
      display: block
      span
        font-weight: normal
    input + label
      display: inline
      margin-left: .5em
label
  font-weight: bold

$mbr = .4em

ul.test-menu + ul.test-menu
  border-left: none

.menu ul.test-menu:first-child
  border-radius: $mbr 0 0 $mbr  

.menu ul.test-menu:last-child
  border-radius: 0 $mbr $mbr 0    

</style>  


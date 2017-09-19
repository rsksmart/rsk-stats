<template lang="pug">
  .stats-menu
    .header
      slot(name="header" scoped='')
    ul.setts-menu
      li
        label Nodes spread: {{opts.force}}
        input(type="range" v-model.number="opts.force" @input="change" min="1" max="7000" step="10")  
      li
        label Node Size: {{opts.nodeSize}}
        input(type="range" v-model.number="opts.nodeSize" @input="change" min="5" max="200" step="1")
      li
        input(type="checkbox" v-model="opts.nodeLabels" @change="change")
        label Node names   
      li(v-if="opts.nodeLabels")
        label Font Size: 
          span {{ opts.fontSize }} 
        input(type="range" v-model.number="opts.fontSize" @input="change" min="5" max="30" step="1")
      li  
        button.reset(@click="reset" title="reset options") 
          icon(name='reload-alt' scale='1.5')
          

</template>
<script>
import defaultData from '../data.js'
import '../icons/reload-alt'
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

.stats-menu
  border: $border
  background: $light
  box-shadow: $hard-sh
  .header 
    text-align right 
    margin 0
    padding 0 .5em
  .setts-menu
    display: table-cell
    padding: 0 1em
    list-style: none
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


$mbr = .4em

ul.test-menu + ul.test-menu
  border-left: none

.menu ul.test-menu:first-child
  border-radius: $mbr 0 0 $mbr  

.menu ul.test-menu:last-child
  border-radius: 0 $mbr $mbr 0    

button.reset 
  padding:0.0625em
  border-radius: 50%
  float:right
  background-color: white
  margin-bottom .5em
</style>  


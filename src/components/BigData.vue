<template lang="pug">
  .big-data(v-if='' @mousedown='startTimer' @mouseleave='stopTimer')
    entity-icon.bd-icon(:entity='entity' :value='value')
    .bd-main
      .bd-title {{entity.title}}
      entity-value.bd-data(:entity='entity' :value='value')
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import EntityMixin from '../mixins/Entity'
export default {
  name: 'big-data',
  mixins: [
    EntityMixin
  ],
  props: {
    name: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      timer: null,
      time: 0,
      seconds: 4
    }
  },
  computed: {
    ...mapGetters('app/', {
      types: 'getTypes'
    }),
    entity () {
      return this.getEntity()(this.name)
    },
    value () {
      return this.getTotalEntity()(this.name)
    },
    dialog () {
      return this.getDialog()(this.types.TOTAL, this.name)
    },
    isMaximized () {
      if (this.dialog) return this.dialog.length
      return 0
    }
  },
  methods: {
    ...mapGetters('app/entity', [
      'getEntity',
      'getTotalEntity'
    ]),
    ...mapGetters('app/', [
      'getDialog'
    ]),
    ...mapActions('app/', [
      'createDialog'
    ]),
    // open dialog if pressed by x seconds
    startTimer (event) {
      if (!this.timer) {
        let vm = this
        let ms = 333
        this.timer = setInterval(() => {
          if (vm.time >= vm.seconds / ms) {
            if (vm.time) vm.toDialog()
            vm.stopTimer()
          } else {
            vm.time++
          }
        }, ms)
      }
    },
    stopTimer (event) {
      if (this.timer) {
        clearInterval(this.timer)
      }
      this.time = 0
    },
    toDialog () {
      let id = this.name
      let type = this.types.TOTAL
      let width = this.$el.clientWidth
      let height = this.$el.clientHeight
      let rect = this.$el.getBoundingClientRect()
      let left = rect.left + 10
      let top = rect.top + 10
      this.createDialog({ id, type, width, height, left, top })
    }
  }
}
</script>
<style lang="stylus">
@import '../lib/styl/vars.styl'
.big-data
  color: $midlight
  user-select none
  width: 100%
  height: auto
  display: flex
  align-items center
  border: dashed alpha($color,.5) 1px
  margin-top: .5em
  z-index: 100
  pointer-events all
  background lighten($bg-color,1%)
  
  .bd-icon
    width: 3vmax
    height: 3vmax 
    color: $color
    box-sizing:content-box
    margin-right .5vmax
    margin-left: 1em
    opacity: .5
    .svg-icon
      width 3vmax
      height 3vmax
      
  .bd-main
    width: auto
    display: inline-block
    margin-left: 1em
    opacity: .7
    // border: blue solid 1px
    .bd-data
      font-size: 2.25vmax

.totals-dialog
  background none
  box-shadow none
  .big-data
    margin-top: 0
    background lighten($bg-color,3%)
  .buttons , .dialog-header
    position absolute
    top:1em
    right 0
    height 1em
    margin:0
   button.close
      position absolute
      z-index: 1000
      pointer-events all
      width: 2em
      height: 2em
      right 0
      top -1em

  .dialog-body
    padding 0    
</style>

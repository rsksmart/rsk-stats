<template lang="pug">
  .tooltip(@mouseleave='show=false' @mouseenter='show=true' @touchend='touch')
    .trim(v-if='trim') {{trimed}}
    slot(v-else)
    .points(v-if='trim' :class='[(opts.trimend) ? "left": "right", (clicked) ? "clicked" : "" ]')
        button(v-if='!show') 
          span.icon {{ opts.trimTxt }}
        button(v-if='show  && opts.copy' @click='copyText' @touchend.stop='copyText')
          icon(name='copy')
    //- Tooltip
    .tip(v-if='show' :class='opts.pos' :style='tipPos')
      //- value
      .value(:class=' (clicked) ? "clicked" : ""' )
        .msg(v-if='show && opts.copyMsg' :class='(anim) ? "anim" : ""') copied!
        .copy-txt(@touchend.stop='show = !show' @click.stop='show = !show')
          .tip-txt(:class='(anim) ? "copying" : ""') {{value}}
          textarea(ref='cptxt' rows='1' :cols='value.length' ) {{ value }}
</template>
<script>
import '../icons/copy'
export default {
  name: 'tool-tip',
  props: [
    'value',   // tooltip content
    'trim',    // trim position: Number | 0 to not trim
    'options' // copy, pos: top | bottom | left | right
  ],
  data () {
    return {
      show: false,
      clicked: false,
      anim: false,
      closer: null,
      opts: {
        pos: 'top',
        copy: true,
        trimend: false,
        copyMsg: true,
        trimTxt: '...'
      }
    }
  },
  created () {
    if (this.options) {
      for (let op in this.options) {
        this.$set(this.opts, op, this.options[op])
      }
    }
  },
  computed: {
    trimed () {
      let trimed = this.value
      if (this.trim) {
        if (this.opts.trimend) {
          trimed = trimed.substring(trimed.length - this.trim, trimed.length)
        } else {
          trimed = trimed.substring(0, this.trim)
        }
      }
      return trimed
    },
    tipPos () {
      let pos = this.opts.pos
      if (pos === 'bottom' || pos === 'top') {
        let p = (pos === 'top') ? 'bottom' : 'top'
        return p + ':' + this.$el.clientHeight + 'px; left:0'
      }
      if (pos === 'left' || pos === 'right') {
        let p = (pos === 'left') ? 'right' : 'left'
        return p + ':' + this.$el.clientWidth + 'px;  bottom: -50%;'
      }
    }
  },
  methods: {
    touch (value) {
      if (!value) value = !this.clicked
      this.clicked = value
      this.show = !this.show
      // timeout to close tip after, not for trimmeds
      if (this.show && !this.trim) {
        if (!this.closer) {
          let vm = this
          this.closer = setTimeout(() => {
            vm.show = false
          }, 3000)
        }
      }
    },
    copyText () {
      let text = this.$refs.cptxt
      text.value = this.value
      text.select()
      try {
        document.execCommand('copy')
        this.anim = true
        text.value = ''
        let vm = this
        // restart animation
        setTimeout(() => {
          vm.anim = false
        }, 600)
      } catch (err) {
        console.info('Unable to copy')
      }
      this.$emit('copy', this.value)
    }
  }
}
</script>
<style lang="stylus">
@import '../lib/styl/vars.styl'
  $tip-arrow-size = 5px
  $tip-bg = white 
  $tip-bc = $color
  $tip-border = 1px
  
  
  .tooltip, .trim
    position: relative
    display: inline-block
    overflow visible
 
  // Arrow mixin
  arrow(pos)
    if pos == 'top' || pos == 'bottom'  
      v = 'left'
      vv = 50%
    else
      v = 'bottom'
      vv = 50%
    &:after, &:before
      {pos}: 100%
      {v}: vv
    &:after 
      border-{pos}-color: $tip-bg
      margin-{v}: $tip-arrow-size * -1
    &:before
      border-{pos}-color: $tip-bc
      margin-{v}: -($tip-arrow-size + $tip-border)
.tooltip
  position relative
  .tip
      position: absolute
      filter: drop-shadow($box-sh)
      width: 100%
      font-size: 0.7em
      color: $dark
      display: flex
      justify-content flex-start // arrow on start
      flex
      .value 
        border-radius: 3px
        background-color: $tip-bg
        word-break: break-all
        display: flex
        justify-content center
        align-items center
      .tip-txt
        padding: .25em
        display inline
        overflow visible
        margin: 0
  .tip:after 
  .tip:before
    border: solid transparent
    content: " "
    height: 0
    width: 0
    position: absolute
    z-index 100

  .tip:after 
    border-width: $tip-arrow-size

  .tip:before
    border-width: $tip-arrow-size + $tip-border

  // generates tip classes  
  for pos in top bottom left right
    .tip.{pos}
      arrow(pos)

  .points
    display: inline-block
    box-shadow: none
    margin: 0 .25em
    line-height: .5em
    margin-top: .25em
    button
      height: 1em
      line-height: 1em 

  .points.left
    float: left

  .points.right
    float: right

  button.copy
    display: block
    position:absolute
    left:0
    top: .25em
    line-height: 1em
    font-size: 1em
    margin: 0 .5em
    .icon
       font-size: 1em

  .copy-txt
    display:inline
    textarea
      border: none
      margin:0
      padding:0
      background-color: inherit
      opacity: 0
      width: 1px
      heigth: 1px

  button.close 
    line-height: 1em
    height: 1em
    &:after
      top: .25em !important
      right: .25em !important
      border-radius: 50%
      line-height: 1em
      height: 1em
      width: 1em
      padding: .25em
.head
  display: block
.msg
  color: $color
  position:absolute
  top: -1.5em
  left: 0
  width: 100%
  opacity: 0

// Copy Animations
.anim  
  animation-duration: 0.5s
  animation-name: copya
  animation-timing-function: ease-in-out
  opacity: 0

  @keyframes copya
    0%
      opacity: 0
    75%
      transform: translateY(-1em) 
    80%
       opacity: 1
    100%
      opacity: 0  
      transform: translateY(-5em)
  
.copying
    animation-duration: 1s
    animation-name: copyb

  @keyframes copyb 
    0%
      color: $color
    100%     
      color: inherit  
</style>  


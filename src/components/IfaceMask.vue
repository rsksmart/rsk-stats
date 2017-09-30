<template lang="pug">
  .iface-mask(:style='styleObj')
    svg(:width='size.w' :height='size.h' id="mask-svg" )
      radialGradient#mask-gradient(:cx='gCenter.x' :cy='gCenter.y' gradientUnits='userSpaceOnUse' )
        stop.stop-white(stop-color='white' stop-opacity='1' offset='0')
        stop.stop-white(stop-color='white' stop-opacity='.5' offset='20%')
        stop.stop-black(stop-color='black' stop-opacity='.2' offset='70%')
        stop.stop-black(stop-color='black' stop-opacity='.1' offset='100%')
      rect(:width='size.w' :height='size.h' fill='url(#mask-gradient)')
</template>
<script>
export default {
  name: 'iface-mask',
  props: ['size', 'center'],
  computed: {
    styleObj () {
      let width = this.size.w + 'px'
      let height = this.size.h + 'px'
      return { width, height }
    },
    gCenter () {
      let x = this.center.x * 100 / this.size.w + '%'
      let y = this.center.y * 100 / this.size.h + '%'
      return { x, y }
    }
  }
}
</script>
<style lang="stylus">
@import '../lib/styl/vars.styl'
  .stop-white
    stop-color white
  .stop-black
    stop-color $bg-color
</style>


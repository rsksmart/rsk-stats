<template lang="pug">
  .iface-back(:style='styleObj')
    svg(:width='1350' :height='950' id="iface-back-svg" )
      radialGradient#bg-gradient(:cx='gCenter.x' :cy='gCenter.y' gradientUnits='userSpaceOnUse' )
        stop.stop-1(stop-color='white' offset='0')
        stop.stop-2(stop-color='black' offset='90%')
        stop.stop-3(stop-color='black' offset='100%')
      rect(:width='1350' :height='950' fill='url(#bg-gradient)')
      //- selection lines
      g(id="selections" class="selection-lines")
        path(v-for='dialog,key in dialogs' :key='key' :d='quadCurve(dialog)' )
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'iface-background',
  props: ['size', 'center'],
  computed: {
    ...mapGetters({
      dialogs: 'app/getNodeDialogs',
      nodes: 'getNodes'
    }),
    styleObj () {
      // let width = this.size.w + 'px'
      // let height = this.size.h + 'px'
      return { width: '1350px', height: '970px' }
    },
    gCenter () {
      let x = this.center.x * 100 / 1350 + '%'
      let y = this.center.y * 100 / 950 + '%'
      return { x, y }
    }
  },
  methods: {
    ...mapGetters([
      'getNode'
    ]
    ),
    nodeBlockStyle (node) {
      return 'left:' + node.x + 'px; top:' + node.y + 'px'
    },
    quadCurve (dialog) {
      let node = this.getNode()(dialog.id)
      let t = 0.6 + (0.1 / this.size.w * (dialog.x - dialog.w))
      let xx = (dialog.x < node.x) ? (dialog.x + dialog.w) : dialog.x
      let xy = dialog.y + (dialog.h / 2)
      let qx = ((1 - t) * (1 - t) * node.x + t * t * xx) / (2 * (1 - t) * t)
      let qy = ((1 - t) * (1 - t) * node.y + t * t * xy) / (2 * (1 - t) * t)
      let d = {
        M: [node.x, node.y],
        Q: [qx, qy],
        X: [xx, xy]
      }
      return 'M ' + d.M + ' Q ' + d.Q.join(' ') + ' ' + d.X
    }
  }
}
</script>
<style lang="stylus">
@import '../lib/styl/vars.styl'
  .stop-1
    stop-color lightness($bg-color,14%)
  .stop-2
    stop-color $bg-color
  .stop-3
    stop-color $bg-color
/*   .iface-back
    background-image:
      radial-gradient(circle closest-corner,
        lightness($bg-color,14%) 0, $bg-dark 60vw
      )  */

</style>

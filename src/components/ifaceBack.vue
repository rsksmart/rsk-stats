<template lang="pug">
  .iface-back(:width='size.w + "px"' :height='size.h + "px"')
    .node-block(v-for='node,id in nodes' :key='id' :style='nodeBlockStyle(node)')
      transition(name="block-number" type="animation"  appear )
        span.block-number( :key='node.stats.block.number') {{nodes[id].stats.block.number}}
    svg(:width='size.w' :height='size.h')
      //- selection lines
      g(id="selections" class="selection-lines" v-for='dialog,key in dialogs')
        path(:d='quadCurve(dialog)')
</template>
<script>
import { mapState, mapGetters } from 'vuex'
export default {
  name: 'iface-background',
  props: ['size'],
  computed: {
    ...mapState({
      dialogs: state => state.app.nodeDialogs,
      nodes: state => state.backendData.nodes
    })
  },
  methods: {
    ...mapGetters([
      'getNode'
    ]),
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
  .node-block
    position: absolute
    font-size: .8em
  .block-number-enter-active
    color: $color
    position: absolute
    top:0
    left:0
    animation-name: blocknumber-anim
    animation-duration: 2s
    animation-iteration-count: 1
    opacity: 0
  .block-number
    opacity:0 
  @keyframes blocknumber-anim
    0%
      opacity: 0
    10%
      opacity: 1  
    100%     
      opacity: 0
      transform: translateY(-100px)

</style>


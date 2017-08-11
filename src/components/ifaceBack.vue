<template lang="pug">
  .iface-back
    svg(:width='size.w' :height='size.h')
      //- selection lines
      g(id="selections" class="selection-lines" v-for='dialog,key in dialogs')
        path(:d='quadCurve(dialog)')
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'iface-background',
  props: ['size'],
  computed: {
    ...mapState({
      state: state => state,
      dialogs: state => state.app.nodeDialogs
    })
  },
  methods: {
    quadCurve (dialog) {
      let node = dialog.node
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

<template lang="pug">
  .entity-icon(v-if='entity' :class='($slots.badge) ? "w-badge" : ""' )
    tool-tip(v-if='tooltip' :value='entity.title' :options='toolTipOptions')
      icon(:name='entity.icon' :style='iconStyle || ""')
    .icon.tooltip(v-else)
      icon(:name='entity.icon' :style='iconStyle || ""')
    slot  
    .badge(v-if='$slots.badge')
      slot(name="badge")
    
</template>
<script>
import EntityCommon from '../mixins/EntityCommon'
import ToolTip from './ToolTip.vue'
export default {
  name: 'entity-icon',
  props: ['options'],
  mixins: [EntityCommon],
  components: {
    ToolTip
  },
  data () {
    return {
      toolTipOptions: {
        copy: false,
        pos: 'top'
      },
      tooltip: true
    }
  },
  created () {
    let options = this.options
    if (options) {
      if (options.hideTooltip) this.tooltip = false
    }
  },
  computed: {
    iconStyle () {
      let color = this.color
      return { color, fill: color }
    }
  }
}
</script>
<style lang="stylus">

</style>


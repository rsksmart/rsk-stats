<template lang="pug">
  .entity-icon(v-if='entity' :class='($slots.badge) ? "w-badge" : ""' )
    tool-tip(:value='entity.title' :options='toolTipOptions')
      icon(:name='entity.icon' :style='iconStyle')
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
      }
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
  .entity-icon, .icon
    .tip
      overflow visible
      word-break: unset
      .value
        word-break: none
        min-width: 10em
</style>


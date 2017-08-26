<template lang="pug">
  .entity-icon(v-if='entity' :class='($slots.badge) ? "w-badge" : ""' )
    tool-tip(:value='entity.title')
      .icon(:class='entity.icon')
    slot  
    .badge(v-if='$slots.badge')
      slot(name="badge")
    
</template>
<script>
import ToolTip from './ToolTip.vue'
export default {
  name: 'entity-icon',
  props: ['entity'],
  components: {
    ToolTip
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


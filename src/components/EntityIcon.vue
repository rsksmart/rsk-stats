<template lang="pug">
  .entity-icon
    tool-tip(:value='entity.title')
      .icon(v-if='entity' :class='entity.icon')
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
  .entity-icon
    .tip
      overflow visible
      word-break: unset
      .value
        word-break: unset
        min-width: 10em
</style>


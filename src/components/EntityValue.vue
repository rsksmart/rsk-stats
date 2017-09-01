<template lang="pug">
  .entity-value(v-if='entity' :style='styleObj' :class='(color) ? "colored" :""') {{ filteredValue }}
    span.suffix(v-if='entity.suffix') {{ entity.suffix }}
    slot
</template>
<script>
import EntityCommon from '../mixins/EntityCommon'

export default {
  name: 'entity-value',
  mixins: [EntityCommon],
  computed: {
    styleObj () {
      let style = {}
      if (this.color) style.color = this.color
      return style
    }
  }
}
</script>


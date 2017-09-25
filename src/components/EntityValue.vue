<template lang="pug">
  .entity-value(v-if='entity' :style='styleObj' :class='valueClass') {{ filteredValue }}
    span.suffix(v-if='entity.suffix') {{ entity.suffix }}
    slot
</template>
<script>

export default {
  name: 'entity-value',
  props: ['entity', 'value', 'fields'],
  computed: {
    styleObj () {
      let style = {}
      if (this.color) style.color = this.color
      return style
    },
    valueClass () {
      let cssClass = this.entity.cssClass || ''
      if (this.color) cssClass += ' colored'
      return cssClass
    },
    filteredValue () {
      return this.entity.filteredValue(this.value)
    },
    color () {
      return this.entity.color(this.value, this.fields)
    }
  }
}
</script>


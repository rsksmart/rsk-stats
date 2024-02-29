<template>
  <div class="entity-value" v-if="entity" :class="valueClass">
    {{ filteredValue }}
    <span class="suffix" v-if="entity.suffix">
      {{ entity.suffix }}
    </span>
    <slot></slot>
  </div>
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
      return this.entity.formatValue(this.value, true, true)
    },
    color () {
      return this.entity.color(this.value, this.fields)
    }
  }
}
</script>

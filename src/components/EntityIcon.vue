<template>
  <div v-if="entity" class="entity-icon">
    <tool-tip v-if="tooltip" :value="entity.title" :options="toolTipOptions">
      <icon :name="entity.icon"></icon>
    </tool-tip>
    <div v-else class="icon tooltip">
      <icon :name="entity.icon"></icon>
    </div>
    <slot></slot>
    <div v-if="$slots.badge" class="badge">
      <slot name="badge"></slot>
    </div>
  </div>
</template>

<script>
import ToolTip from './ToolTip.vue'
export default {
  name: 'entity-icon',
  props: ['entity', 'fields', 'value', 'options'],
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
      let { color } = this
      // color = color || 'red'
      return { color, fill: color }
    },
    color () {
      return this.entity.color(this.value, this.fields)
    }
  }
}
</script>
<style lang="stylus"></style>

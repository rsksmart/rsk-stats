<template lang="pug">
  .entity(v-if='entity' :style='styleObj' :class='(color) ? "colored" :""') {{ filteredValue }}
    span.suffix(v-if='entity.suffix') {{ entity.suffix }}
    slot
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: 'entity-value',
  props: ['entity', 'value'],
  data () {
    return {
      colorFunc: null
    }
  },
  created () {
    let threshold = this.entity.threshold
    let cf = this.thresholdColors()(threshold)
    if (cf) this.colorFunc = cf
  },
  computed: {
    filteredValue () {
      return this.filterValue()(this.entity, this.value)
    },
    color () {
      let cf = this.colorFunc
      return (cf) ? cf(this.value) : ''
    },
    styleObj () {
      let style = {}
      if (this.color) style.color = this.color
      return style
    }
  },
  methods: {
    ...mapGetters('app/entity', [
      'thresholdColors',
      'filterValue'
    ])
  }
}
</script>
<style lang="stylus">
  .colored
    opacity: .8
</style>


<template lang="pug">
  .entity(v-if='entity') {{ filteredValue }}
    span.suffix(v-if='entity.suffix') {{ entity.suffix }}
    slot
</template>
<script>
import { percent, numerals } from '../filters/NumberFilters.js'
import { nodeType } from '../filters/TextFilters.js'
import { tSecondsAgo, mSecondsAgo, sSeconds } from '../filters/TimeFilters.js'
export default {
  name: 'entity-value',
  props: ['entity', 'value'],
  filters: {
    percent,
    numerals,
    nodeType,
    tSecondsAgo,
    mSecondsAgo,
    sSeconds
  },
  computed: {
    filteredValue () {
      let value = this.value
      let filters = this.entity.filters
      if (filters) {
        filters = (typeof (filters) === Array) ? filters : [filters]
        for (let filterName of filters) {
          let filter = this.$options.filters[filterName]
          if (filter) value = filter(value)
          else console.info('The entity ' + this.entity.id + ' call unknown filter ' + filterName)
        }
      }
      return value
    }
  }
}
</script>

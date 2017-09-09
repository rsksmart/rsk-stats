import { mapGetters } from 'vuex'
export default {
  props: ['entity', 'value', 'fields'],
  computed: {
    filteredValue () {
      return this.filterEntityValue()(this.entity, this.value)
    },
    color () {
      let cf = this.colorFunc
      let value = (this.thValue !== null) ? this.thValue : this.value
      value = this.thFilter(value)
      let color = (cf && (undefined !== this.value)) ? cf(value) : ''
      return color
    },
    threshold () {
      if (this.entity) return this.entity.threshold
      return
    },
    colorFunc () {
      if (this.entity && this.entity.thresholdObj) {
        return this.entity.thresholdObj.colorFunc
      }
    },
    thValue () {
      let entity = this.entity
      let fields = this.fields
      if (entity && fields) {
        let th = entity.thField
        if (th) {
          let thValue = fields[th]
          return thValue
        }
      }
      return null
    }
  },
  methods: {
    ...mapGetters('app/entity', [
      'filterEntityValue',
      'applyFilter'
    ]),
    thFilter (value) {
      let threshold = this.entity.thresholdObj
      if (threshold) {
        let filters = threshold.filters
        value = this.applyFilter()(filters, value)
      }
      return value
    }
  }
}

import { mapGetters } from 'vuex'
export default {
  props: ['entity', 'value', 'fields'],
  data () {
    return {
      colorFunc: null
    }
  },
  created () {
    let threshold = this.threshold
    if (this.threshold) {
      let cf = this.thresholdColors()(threshold)
      if (cf) this.colorFunc = cf
    }
  },
  computed: {
    filteredValue () {
      return this.filterEntityValue()(this.entity, this.value)
    },
    color () {
      let cf = this.colorFunc
      let value = this.thField || this.value
      value = this.thFilter(value)
      return (cf && value) ? cf(value) : ''
    },
    threshold () {
      return this.entity.threshold
    },
    thValue () {
      let entity = this.entity
      let fields = this.fields
      if (entity && fields) {
        let th = entity.thField
        if (th) {
          let thField = fields[th]
          return thField
        }
      }
    }
  },
  methods: {
    ...mapGetters('app/entity', [
      'thresholdColors',
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

import { mapGetters } from 'vuex'
export default {
  props: ['entity', 'value'],
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
      return this.filterValue()(this.entity, this.value)
    },
    color () {
      let cf = this.colorFunc
      return (cf && this.value) ? cf(this.value) : ''
    },
    threshold () {
      return this.entity.threshold
    }
  },
  methods: {
    ...mapGetters('app/entity', [
      'thresholdColors',
      'filterValue'
    ])
  }
}

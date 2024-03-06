<template>
  <div class="big-data" v-if="value" :class="(options.minimized) ? 'mini': ''">
    <div class="bd-main">
      <div class="bd-title">{{entity.title}}
        <small class="subtitle" v-if="entity.subtitle">{{entity.subtitle}}</small>
      </div>
      <entity-value class="bd-data" :entity="entity" :value="value"></entity-value>
    </div>
    <entity-icon class="bd-icon" :entity="entity" :value="value" :options="{ hideTooltip:true }"></entity-icon>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import EntityMixin from '../mixins/Entity'
export default {
  name: 'big-data',
  mixins: [
    EntityMixin
  ],
  props: {
    name: {
      type: String,
      required: true
    },
    options: {
      type: Object,
      default () {
        return {
          minimized: false
        }
      }
    }
  },
  data () {
    return {
      timer: null,
      time: 0,
      seconds: 4
    }
  },
  computed: {
    ...mapGetters('app/', {
      types: 'getTypes'
    }),
    entity () {
      return this.getEntity()(this.name)
    },
    value () {
      return this.getTotalEntity()(this.name)
    },
    dialog () {
      return this.getDialog()(this.types.TOTAL, this.name)
    },
    isMaximized () {
      if (this.dialog) return this.dialog.length
      return 0
    },
    color () {
      return this.entity.color(this.value)
    },
    titleStyle () {
      let style = {}
      let color = this.color
      if (color) style.color = color
      return style
    }
  },
  methods: {
    ...mapGetters('app/entity', [
      'getEntity',
      'getTotalEntity'
    ]),
    ...mapGetters('app/', [
      'getDialog'
    ]),
    ...mapActions('app/', [
      'createDialog'
    ]),
    toDialog () {
      let id = this.name
      let type = this.types.TOTAL
      let width = this.$el.clientWidth
      let height = this.$el.clientHeight
      let rect = this.$el.getBoundingClientRect()
      let left = rect.left + 10
      let top = rect.top + 10
      this.createDialog({ id, type, width, height, left, top })
    }
  }
}
</script>

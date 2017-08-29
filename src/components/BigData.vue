<template lang="pug">
  .big-data
    entity-icon.bd-icon(:entity='entity')
    .bd-main
      .bd-title {{entity.title}}
      entity-value.bd-data(:entity='entity' :value='value')
</template>
<script>
import { mapGetters } from 'vuex'
import EntityMixin from '../mixins/Entity.vue'
export default {
  name: 'big-data',
  mixins: [
    EntityMixin
  ],
  props: {
    name: {
      type: String,
      required: true
    }
  },
  computed: {
    entity () {
      return this.getEntity()(this.name)
    },
    value () {
      return this.getTotalEntity()(this.name)
    }
  },
  methods: {
    ...mapGetters('app/entity', [
      'getEntity',
      'getTotalEntity'
    ])
  }
}
</script>
<style lang="stylus">
@import '../lib/styl/vars.styl'
.big-data
  color: $midlight
  padding-left: 1em
  margin-top: 1em
  min-width: 100%
  width: 100%
  height: auto
  .bd-icon
    font-size: 3vmax 
    width: 1em
    display: inline-block
    color: $color
    box-sizing:content-box
    // border: white solid 1px
   .bd-main
    width: auto
    display: inline-block
    margin-left: 1em
    // border: blue solid 1px
    .bd-data
      font-size: 2.5em
    .bd-title
      font-weight: bold  
</style>

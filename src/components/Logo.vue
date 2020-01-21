<template lang="pug">
  .logo-cont(v-once)
    .logo
      icon.iso(name='rsk' scale='1')
      h1 rsk network
</template>
<script>
import '../icons/rsk'
export default {
  name: 'logo'
}
</script>
<style lang="stylus">
@import '../lib/styl/vars.styl'
  .logo-cont
    display flex
    justify-content center
    align-items center
    padding  0
    min-height $min-box-height

    .logo
      display flex
      align-items center
      flex-flow row nowrap
      color $color
      margin 0 .5em
      padding 0
      white-space nowrap
      font-size: 1.75em
      position relative
      .iso
        fill @color
        display flex
        margin 0
        position relative
        top .125em
      h1
        font-size 1em
        font-weight normal
        margin 0 0 0 .25em
        padding 0
        display flex

</style>

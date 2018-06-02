<template lang="pug">
  .logo-cont(v-once)
    .logo
      icon.iso(name='rsk' scale='1')
      span &nbsp; rsk network
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
    padding:  0
    min-height $min-box-height
    .logo

      color $color
      margin:0 .5em
      white-space:nowrap
      font-size: 1.75em

</style>

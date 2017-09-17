<template lang="pug">
  .logo-cont
    .logo
      icon.iso(name='rsk' scale='1')
      span &nbsp; rsk network
</template>
<script>
import '../icons/rsk'
export default {
  name: 'log'
}
</script>
<style lang="stylus">
@import '../lib/styl/vars.styl'
  .logo-cont
    justify-content center
    padding:  0
    .logo
      color $color
      margin:0 .5em
      white-space:nowrap
      font-size: 1.75em
    
</style>

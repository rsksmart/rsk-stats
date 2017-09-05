<template lang="pug">
  .logo-cont
    h1.logo
      icon.iso(name='rsk' scale='1.2')
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
    padding: 1em 0
    .logo
      margin:0 .5em
      white-space:nowrap
      font-size: 2em
    
</style>

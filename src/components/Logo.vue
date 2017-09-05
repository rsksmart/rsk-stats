<template lang="pug">
  .logo-cont
    h1.logo
      icon.iso(name='rsk')
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
    display flex
    padding: 1em
    .logo
      margin:0 .5em
      white-space:nowrap
    .iso 
      width: 1em
      height: 1em

</style>

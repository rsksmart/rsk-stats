<template lang="pug">
  .test
    h1 {{connected}}
</template>
<script>
export default {
  name: 'app',
  computed: {
    connected () {
      return this.$store.state.socketConnected
    }
  }
}
</script>

<style lang="stylus">

</style>


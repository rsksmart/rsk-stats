<template lang="pug">
  .big-data
    .bd-icon
      span(:class="icon")
    .bd-main
      .bd-title {{title}}
      .bd-data {{data}}
        small {{sufix}}
</template>
<script>
export default {
  name: 'big-data',
  props: ['data', 'title', 'icon', 'sufix']
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

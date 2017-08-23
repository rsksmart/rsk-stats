<template lang="pug">
  .icon(:class='entity.icon' :title='entity.title')
</template>
<script>
export default {
  name: 'entity-icon',
  props: ['entity']
}
</script>

<template lang="pug">
  .entity(v-if='entity') {{ value }}
    span.suffix(v-if='entity.suffix') &nbsp; {{ entity.suffix }}  
</template>
<script>
export default {
  name: 'entity-value',
  props: ['entity', 'value']
}
</script>

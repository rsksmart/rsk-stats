<template lang="pug">
    svg(:x='xx' :y='yy' :width='size+"px"' :height='size+"px"' viewBox='10 15 30 30')
      g.cube
        path.shadow(v-if='shadow' fill='none', d='m 24.853203,2.9357662 c 0,0 -14.577404,4.6071848 -23.8719888,7.5356078 l 0.0910875,29.400269 23.7809013,7.613462 23.89186,-7.78049 -0.04156,-29.226136 z')
        path.bg(fill='white', d='m 24.853203,2.9357662 c 0,0 -14.577404,4.6071848 -23.8719888,7.5356078 l 0.0910875,29.400269 23.7809013,7.613462 23.89186,-7.78049 -0.04156,-29.226136 z')
        path.fill(:fill='color', opacity='.9', d='m 24.853203,2.9357662 c 0,0 -14.577404,4.6071848 -23.8719888,7.5356078 l 0.0910875,29.400269 23.7809013,7.613462 23.89186,-7.78049 -0.04156,-29.226136 z')
        path.front(fill='rgba(0,0,0,.3)' d='M 24.853203,47.485105 1.0723017,39.871643 0.9812142,10.471374 l 16.7437408,5.225635 7.128248,2.224714 z')
        path.top(fill='rgba(255,255,255,.2)' d='M 24.853203,17.921723 12.156786,13.959867 0.9812142,10.471374 24.853203,2.9357662 48.703509,10.478479 Z')
        path.side(fill='rgba(0,0,0,.15)' d='m 48.745063,39.704615 -23.89186,7.78049 V 17.921723 l 23.850306,-7.443244 z')
</template>
<script>
export default {
  name: 'svg-cube',
  props: ['x', 'y', 'size', 'color', 'shadow'],
  computed: {
    fs () {
      let fs = this.size / 2
      return (fs > 10) ? fs : 10
    },
    cx () {
      return this.size / 2
    },
    yy () {
      let { y, cx } = this
      return (y) ? (y - cx) + 'px' : undefined
    },
    xx () {
      let { x, cx } = this
      return (x) ? (x - cx) + 'px' : undefined
    },
    viewBox () {
      return [0, 0, this.size, this.size].join(' ')
    }
  }
}
</script>

<template>
  <div id="app">
    <MHeader></MHeader>
    hello word
  </div>
</template>

<script>
import MHeader from 'components/m-header/m-header'

export default {
  name: 'App',
  components: {
    MHeader
  }
}
</script>

<style scoped lang="stylus">
  @import "common/stylus/variable.styl";
  #app
    color: $color-theme
</style>

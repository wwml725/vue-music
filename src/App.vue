<template>
  <div id="app">
    <MHeader></MHeader>
     <Tab></Tab>

    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
import MHeader from 'components/m-header/m-header'
import Tab from 'components/tab/tab'

export default {
  // name: 'App',
  components: {
    MHeader,Tab
  }
}
</script>

<style scoped lang="stylus">
  @import "./common/stylus/variable.styl";
  #app
    color: $color-theme
</style>

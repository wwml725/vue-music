<template>
  <div id="app">
    <MHeader></MHeader>
    <Tab></Tab>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
    <!--播放页面（组件）-->
    <player></player>

  </div>
</template>

<script>
  import MHeader from 'components/m-header/m-header'
  import Tab from 'components/tab/tab'
  import Player from 'components/player/player'

  export default {
    // name: 'App',
    components: {
      MHeader, Tab,Player
    }
  }
</script>

<style scoped lang="stylus">
  @import "./common/stylus/variable.styl";
  #app
    color: $color-theme
</style>

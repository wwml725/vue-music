<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @query="onQueryChange"></search-box>
    </div>
    <!--根据关键词搜索出来的推荐列表-->
    <div class="search-result" v-show="query" ref="searchResult">
      <suggest ref="suggest" @select="saveSearch" :query="query"  @listScroll="blurInput"></suggest>
    </div>

    <!--热门搜索和搜索历史-->
    <div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
      <div ref="shortcut" class="shortcut">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li @click="addQuery(item.k)" class="item" v-for="item in hotKey">
                <span>{{item.k}}</span>
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <span class="clear">
                <i class="icon-clear"></i>
              </span>
            </h1>
            <search-list @select="addQuery" @delete="deleteOne"  :searches="searchHistory"></search-list>
          </div>
        </div>
      </div>
    </div>

    <!--显示歌手详情，或者播放页面-->
    <router-view></router-view>

  </div>
</template>

<script type="text/ecmascript-6">

  import SearchBox from 'base/search-box/search-box'
  import SearchList from 'base/search-list/search-list'

  //获取热门搜索数据
  import {getHotKey} from 'api/search'
  import {ERR_OK} from 'api/config'


  import Suggest from 'components/suggest/suggest'
  import Scroll from 'base/scroll/scroll'

  import {mapActions,mapGetters} from "vuex"

  // import {playlistMixin} from 'common/js/mixin'



  export default {
    // mixins: [playlistMixin],
    data() {
      return {
        hotKey: [],//热门搜索关键词
        query: ''//这个query用来设置suggest组件是否出现（实质上就是子组件给父组件传递了一个数据）
      }
    },
    created() {
      this._getHotKey()//获取热门搜索数据
    },
    computed: {
      ...mapGetters([
        'searchHistory'
      ]),
    },

    methods: {
      ...mapActions([
        'saveSearchHistory',
        'deleteSearchHistory'
      ]),
      // handlePlaylist(playlist) {
      //   const bottom = playlist.length > 0 ? '60px' : ''
      //
      //   this.$refs.searchResult.style.bottom = bottom
      //   this.$refs.suggest.refresh()
      //
      //   this.$refs.shortcutWrapper.style.bottom = bottom
      //   this.$refs.shortcut.refresh()
      // },

      deleteOne(item){
        this.deleteSearchHistory(item)
      },

      saveSearch(){
        this.saveSearchHistory(this.query)
      },

      blurInput(){
        this.$refs.searchBox.blur()
        console.log(this.$refs.searchBox);
        //但是这个方法不能在pc端验证
      },

      //给搜索框添加搜索内容，也就是设置input框的value值
      addQuery(query) {
        console.log(11);
        //调用实例searchBox上的setQuery方法
        //this.$refs.searchBox在这里获取的是实例，因为当前作用域是search的作用域（也就是父组件作用域），searchBox是子组件的标签，ref放在子组件的标签上，在父组件通过this.$refs获取的数据就是子组件的实例
        this.$refs.searchBox.setQuery(query)
      },

      onQueryChange(query) {
        //将当前组件的query设置成子组件中的query
        this.query = query
      },

      //获取热门搜索数据
      _getHotKey() {
        getHotKey().then((res) => {
          if (res.code === ERR_OK) {
            //将热门搜索数据的前十条放在当前实例的数据上
            this.hotKey = res.data.hotkey.slice(0, 10)
          }
        })
      },
    },
    watch: {},
    components: {
      SearchBox,
      Scroll,
      Suggest,
      SearchList
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px

    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%

      .shortcut
        height: 100%
        overflow: hidden

        .hot-key
          margin: 0 20px 20px 20px

          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l

          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d

        .search-history
          position: relative
          margin: 0 20px

          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l

            .text
              flex: 1

            .clear
              extend-click()

              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d

    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>

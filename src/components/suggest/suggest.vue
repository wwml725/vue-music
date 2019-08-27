<template>
  <scroll ref="suggest"
          class="suggest"
          :data="result"
          :pullup="pullup"
          @scrollToEnd = 'searchMore'
          :beforeScroll="beforeScroll"
          @beforeScroll="listScroll"


  >
    <ul class="suggest-list">
      <li class="suggest-item"
          v-for="item in result"
          @click="selectItem(item)"
      >
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>

    </ul>
    <div v-show="!hasMore && !result.length" class="no-result-wrapper">
      <no-result title="抱歉，暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script type="text/ecmascript-6">
  import {search} from "api/search"
  import {ERR_OK} from "api/config"
  import {createSong} from 'common/js/song'
  import Scroll from "base/scroll/scroll"
  import Loading from "base/loading/loading"
  import NoResult from 'base/no-result/no-result'

  import Singer from 'common/js/singer'
  import {mapMutations, mapActions} from 'vuex'





  const TYPE_SINGER = 'singer'
  //每一页的条数
  const perpage = 20




  export default {
    props: {
      query:{
        type:String,
        default:''
      },
      showSinger:{
        type:Boolean,
        default:true
      }
    },
    data() {
      return {
        page:1,
        result: [],
        pullup:true,
        hasMore:true,
        beforeScroll: true,

      }
    },
    methods: {
      ...mapMutations({
        setSinger: 'SET_SINGER'
      }),
      ...mapActions([
        'insertSong'
      ]),
      refresh() {
        this.$refs.suggest.refresh()
      },

      listScroll() {
        this.$emit('listScroll')
      },

      selectItem(item) {
        if (item.type === TYPE_SINGER) {
          const singer = new Singer({
            id: item.singermid,
            name: item.singername
          });
          this.$router.push({
            //跳转至详情页，在详情页中会调用一个方法，获取数据，这个方法需要传入的参数就是singer.id
            path: `/search/${singer.id}`

          });
          //将歌手信息存放在vuex中
          this.setSinger(singer)
        } else {
          this.insertSong(item)
        }
        this.$emit('select', item)
      },


      //验证是否有更多
      _checkMore(data) {
        const song = data.song
        //先看获取的结果再判断是否还有更多，如果这次获取一条数据都没有就是没有更多，2、当前这一次获取的数据条数加上之前获取的几页数据总和大于歌曲总数
        //song.curnum是当前调用接口获取的数据条数,最多获取的是设置的条数，也可能一条没有
        //song.curpage
        if (!song.list.length || (song.curnum + song.curpage * perpage) > song.totalnum) {
          this.hasMore = false
        }
      },

      //加载更多
      searchMore() {
        if (!this.hasMore) {
          return
        }
        this.page++;
        //调用接口，传入相关参数
        search(this.query, this.page, this.showSinger, perpage).then((res) => {
          if (res.code === ERR_OK) {
            // console.log(res);
            this.result = this.result.concat(this._genResult(res.data))
            // console.log(this.result);
            this._checkMore(res.data)
          }
        })
      },


      search(){
        this.page = 1
        this.hasMore = true
        this.$refs.suggest.scrollTo(0, 0)

        //关键词、第几页、是否显示歌手、一页显示几条
        search(this.query,this.page,this.showSinger,perpage).then((res)=>{
          // console.log(res);
          if (res.code === ERR_OK) {
            this.result = this._genResult(res.data)
            this._checkMore(res.data)
          }
        })
      },

      //将获取到的数据过滤，并且进行加工
      _genResult(data) {
        let ret = []
        // console.log(data);
        // data.zhida ：是什么？
        if (data.zhida && data.zhida.singerid) {
          ret.push({...data.zhida, ...{type: TYPE_SINGER}})
        }

        if (data.song) {
          ret = ret.concat(this._normalizeSongs(data.song.list))
          // console.log(ret);
        }
        return ret
      },
      _normalizeSongs(list) {
        // console.log(list);
        let ret = []
        list.forEach((musicData) => {
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      },



      getDisplayName(item) {
        if (item.type === TYPE_SINGER) {
          // console.log(item.singername);
          return item.singername
        } else {
          return `${item.name}-${item.singer}`
        }
      },

      getIconCls(item) {
        if (item.type === TYPE_SINGER) {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },



    },
    watch: {
      //监听query，query每次变化都会触发search事件
      query(newQuery){
        this.search(newQuery)
        console.log("search");
      }
    },
    components: {
      Scroll,
      Loading,
      NoResult
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>

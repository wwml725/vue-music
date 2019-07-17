<template>
  <transition name="fade">
    <div class="singer-detail-container">
      <music-list
        :songs="songs"
        :title="title"
        :bg-image="bgImage"
      >
      </music-list>
    </div>
  </transition>
</template>

<script>

  import MusicList from 'components/music-list/music-list'

  import {getSingerDetail} from 'api/singer'
  import {ERR_OK} from 'api/config'
  import {createSong} from 'common/js/song'

  import {mapGetters} from 'vuex'



  export default {
    // name: "singer-detail",
    data() {
      return {
        songs:[]
      }
    },
    created() {
      this._getDetail()

    },
    methods: {
      _getDetail(){
        // console.log(this.singer.id);
        //这个id还有一个办法，就是直接从路径中获取,但是这个办法的缺点就是，可以通过输入url直接访问这个页面？而this.singer.id这个方法是通过点击的时候将id放进了vuex，传递给了子组件
        if(!this.singer.id){
          this.$router.push('/singer')
        }
        getSingerDetail(this.singer.id).then((res)=>{
          if(res.code===ERR_OK){
            this.songs = this._normalizeSongs(res.data.list)
          }
        })
      },
      _normalizeSongs(list) {
        let ret = []
        list.forEach((item) => {
          let {musicData} = item
          if (musicData.songid && musicData.albummid) {
            ret.push(createSong(musicData))
          }
        })
        return ret
      }
    },
    computed: {
      title(){
        return this.singer.name
      },
      bgImage(){
        return this.singer.avatar
      },
      ...mapGetters(['singer'])
      //singer：包含的数据有：avatar/singerName/id
    },
    components: {
      MusicList,
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin";
  .singer-detail-container
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background


  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>

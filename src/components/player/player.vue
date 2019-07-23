<template>
  <div class="player" v-show="playList.length>0">

    <transition
      name="normal"
      @enter="enter"
      @after-enter="afterEnter"
      @leave="leave"
      @after-leave="afterLeave"
    >
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img width="100%" height="100%" :src="currentSong.image">
        </div>

        <div class="top">
          <div class="back" @click="back">
            <i class="icon-back"></i>
          </div>
          <h1 class="title" v-html="currentSong.name"></h1>
          <h2 class="subtitle" v-html="currentSong.singer"></h2>
        </div>

        <div class="middle">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.image">
              </div>
            </div>
          </div>
        </div>

        <div class="bottom">
          <div class="operators">
            <div class="icon i-left">
              <i class="icon-sequence"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i class="icon-prev"  @click="prev"></i>
            </div>
            <div class="icon i-center"  :class="disableCls">
              <i @click="togglePlaying" :class="playIcon"></i>
            </div>
            <div class="icon i-right" :class="disableCls">
              <i class="icon-next" @click="next"></i>
            </div>
            <div class="icon i-right">
              <i class="icon icon-not-favorite"></i>
            </div>
          </div>
        </div>
      </div>

    </transition>

    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen" @click="open">
        <div class="icon">
          <img width="40" height="40" :src="currentSong.image">
        </div>
        <div class="text">
          <h2 class="name" v-html="currentSong.name"></h2>
          <p class="desc" v-html="currentSong.singer"></p>
        </div>
        <div class="control">
          <i @click.stop="togglePlaying" :class="miniIcon"></i>
        </div>
        <div class="control">
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <!--
        <audio ref="audio" src="http://aqqmusic.tc.qq.com/amobile.music.tc.qq.com/C400003iHc0e2UIgMC.m4a?guid=4325748206&vkey=C89FE1749286FA6A6046ED4FDD88B5A0005A5FF62C42ECD6086F8BCF659A149A65362142414EA27C774CBCCA3981E87B9CB1ECDA120B59F8&uin=0&fromtag=38"></audio>-->

    <audio
      ref="audio"
      :src="currentSong.url"
    @canplay="ready" @error="error"></audio>

  </div>
</template>


<script>
  import {mapGetters, mapMutations} from 'vuex'
  import animations from 'create-keyframe-animation'
  import {prefixStyle} from 'common/js/dom'//处理前缀问题

  const transform = prefixStyle('transform')
  // const transitionDuration = prefixStyle('transitionDuration')

  // debugger
  export default {
    data() {
      return {
        songReady: false,


      }
    },
    created() {

    },
    mounted() {
      this.$nextTick(() => {
        console.log(this.currentSong.url);
      })
    },
    computed: {
      ...mapGetters([
        'fullScreen',
        'playList',
        'currentSong',
        'playing',
        'currentIndex'
      ]),

      cdCls() {//控控制大图的旋转
        //如果正在播放旋转，暂停不旋转
        return this.playing ? 'play' : 'play pause'
      },

      playIcon() {//播放暂停按钮的icon字体
        return this.playing ? 'icon-pause' : 'icon-play'
      },
      miniIcon() {
        return this.playing ? 'icon-pause-mini' : 'icon-play-mini'
      },
      disableCls() {//就是说获取的了歌曲数据，按钮高亮，没有就是暗淡的
        return this.songReady ? '' : 'disable'
      },
      // percent() {
      //   return this.currentTime / this.currentSong.duration
      // },
    },

    methods: {
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN',
        setPlayingState: 'SET_PLAYING_STATE',
        setCurrentIndex: 'SET_CURRENT_INDEX'
      }),
      back() {
        this.setFullScreen(false)
      },
      open() {
        this.setFullScreen(true)

      },

      //获取两个图标的缩放比例和偏移距离
      _getPosAndScale() {

        const targetWidth = 40//小图实际宽度
        const paddingLeft = 40//小图中心坐标
        const paddingBottom = 30//小图中心坐标
        const paddingTop = 80//大图到顶部的距离
        const width = window.innerWidth * 0.8//大图宽度
        const scale = targetWidth / width//缩放比例
        //初始的x坐标  这是要偏移的水平距离
        const x = -(window.innerWidth / 2 - paddingLeft)//横轴坐标的距离
        //偏移的垂直距离
        const y = window.innerHeight - paddingTop - width / 2 - paddingBottom//纵轴坐标的距离
        return {
          x,
          y,
          scale
        }
      },
      //这个动画效果操作的就是那个大图
      //1、动画的起始位置和小图重合了
      //2、动画结束为止就是大图的位置
      //3、需要计算缩放比例  和  偏移距离
      enter(el, done) {//dom元素和回调函数

        const {x, y, scale} = this._getPosAndScale()

        let animation = {
          0: {//动画的起始位置
            transform: `translate3d(${x}px,${y}px,0) scale(${scale})`
          },
          60: {//动画某一个阶段的位置
            transform: `translate3d(0,0,0) scale(1.1)`
          },
          100: {//动画结束为止
            transform: `translate3d(0,0,0) scale(1)`
          }
        }

        //注册
        animations.registerAnimation({
          name: 'move',
          animation,
          presets: {
            duration: 400,
            easing: 'linear'
          }
        })

        //使用
        animations.runAnimation(this.$refs.cdWrapper, 'move', done)
      },
      afterEnter() {
        //为什么要清空animation
        //添加动画是添加了一些class，动画执行完毕之后清空这些class
        animations.unregisterAnimation('move')
        this.$refs.cdWrapper.style.animation = ''
      },
      leave(el, done) {
        this.$refs.cdWrapper.style.transition = 'all 0.4s'
        const {x, y, scale} = this._getPosAndScale()
        this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
        this.$refs.cdWrapper.addEventListener('transitionend', done)
      },
      afterLeave() {
        this.$refs.cdWrapper.style.transition = ''
        this.$refs.cdWrapper.style[transform] = ''
      },

      togglePlaying() {
        if (!this.songReady) {
          //没有获取到歌曲mp3数据，，就直接结束这个函数
          return
        }
        this.setPlayingState(!this.playing)
        // if (this.currentLyric) {
        //   this.currentLyric.togglePlay()
        // }
      },

      //下一首和上一首
      next() {
        if(!this.songReady){
          return
        }
        let index = this.currentIndex + 1
        if (index === this.playList.length) {
          index = 0
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
        this.songReady=false
        //问题1：切换太快的时候会报错？？
        //
      },
      prev() {
        if(!this.songReady){
          return
        }
        let index = this.currentIndex - 1
        if (index === -1) {
          index = this.playList.length - 1
        }
        this.setCurrentIndex(index)
        if (!this.playing) {
          this.togglePlaying()
        }
        this.songReady=false
      },
      ready(){
        this.songReady=true
      },
      error(){//就是说，如果没有夏一首歌曲，或者没有网的情况下，这样设置，也不会影响按钮的正常使用
        this.songReady=true
      }


    },

    watch: {
      currentSong() {
        this.$nextTick(() => {
          this.$refs.audio.play()
        })
      },
      playing(newPlaying) {
        const audio = this.$refs.audio
        this.$nextTick(() => {
          newPlaying ? audio.play() : audio.pause()
        })
      }


    }


  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background

      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)

      .top
        position: relative
        margin-bottom: 25px

        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50

          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)

        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text

        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text

      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0

        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%

          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%

            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%

              &.play
                animation: rotate 20s linear infinite

              &.pause
                animation-play-state: paused

              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center

            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l

        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden

          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center

            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium

              &.current
                color: $color-text

      .bottom
        position: absolute
        bottom: 50px
        width: 100%

        .dot-wrapper
          text-align: center
          font-size: 0

          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l

            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll

        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0

          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px

            &.time-l
              text-align: left

            &.time-r
              text-align: right

          .progress-bar-wrapper
            flex: 1

        .operators
          display: flex
          align-items: center

          .icon
            flex: 1
            color: $color-theme

            &.disable
              color: $color-theme-d

            i
              font-size: 30px

          .i-left
            text-align: right

          .i-center
            padding: 0 20px
            text-align: center

            i
              font-size: 40px

          .i-right
            text-align: left

          .icon-favorite
            color: $color-sub-theme

      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s

        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)

      &.normal-enter, &.normal-leave-to
        opacity: 0

        .top
          transform: translate3d(0, -100px, 0)

        .bottom
          transform: translate3d(0, 100px, 0)

    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background

      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s

      &.mini-enter, &.mini-leave-to
        opacity: 0

      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px

        img
          border-radius: 50%

          &.play
            animation: rotate 10s linear infinite

          &.pause
            animation-play-state: paused

      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden

        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text

        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d

      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px

        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d

        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>

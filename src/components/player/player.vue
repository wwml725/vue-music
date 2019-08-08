<template>
  <!--这个组件是放在app组件中的，因为这个播放器，不管在哪一个页面的可以存在，这样才可以不管在哪一个页面都可以播放音乐（说白了，就是翻看其他页面的时候不影响音乐的播放）-->
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

        <div class="middle"
             @touchstart.prevent="middleTouchStart"
             @touchmove.prevent="middleTouchMove"
             @touchend="middleTouchEnd">
          <div class="middle-l" ref="middleL">
            <div class="cd-wrapper" ref="cdWrapper">
              <div class="cd" :class="cdCls">
                <img class="image" :src="currentSong.image">
              </div>
              <div class="playing-lyric-wrapper">
                <div class="playing-lyric">{{playingLyric}}</div>
              </div>
            </div>
          </div>
          <scroll class="middle-r" ref="lyricList" :data="currentLyric&&currentLyric.lines">
            <div class="lyric-wrapper">
              <div v-if="currentLyric">
                <p class="text"
                   :class="{'current': currentLineNum ===index}"
                   ref="lyricLine"
                   v-for="(line,index) in currentLyric.lines">
                  {{line.txt}}
                </p>

              </div>

            </div>
          </scroll>
        </div>

        <div class="bottom">

          <div class="dot-wrapper">
            <span class="dot" :class="{'active':currentShow=='cd'}"></span>
            <span class="dot" :class="{'active':currentShow=='lyric'}"></span>
          </div>
          <div class="progress-wrapper">
            <span class="time time-l">{{format(currentTime)}}</span>
            <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @percentChange="onProgressBarChange"></progress-bar>
            </div>
            <span class="time time-r">{{format(currentSong.duration)}}</span>
          </div>
          <div class="operators">
            <div class="icon i-left" @click="changeMode">
              <i :class="iconMode"></i>
            </div>
            <div class="icon i-left" :class="disableCls">
              <i class="icon-prev" @click="prev"></i>
            </div>
            <div class="icon i-center" :class="disableCls">
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
          <progress-circle :radius="radius" :percent="percent">
            <i @click.stop="togglePlaying" class="icon-mini" :class="miniIcon"></i>
          </progress-circle>
        </div>

        <div class="control">
          <!--列表页-->
          <i class="icon-playlist"></i>
        </div>
      </div>
    </transition>
    <!--
        <audio ref="audio" src="http://aqqmusic.tc.qq.com/amobile.music.tc.qq.com/C400003iHc0e2UIgMC.m4a?guid=4325748206&vkey=C89FE1749286FA6A6046ED4FDD88B5A0005A5FF62C42ECD6086F8BCF659A149A65362142414EA27C774CBCCA3981E87B9CB1ECDA120B59F8&uin=0&fromtag=38"></audio>-->

    <audio
      ref="audio"
      :src="currentSong.url"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="end"
    ></audio>

  </div>
</template>


<script>
  import {mapGetters, mapMutations} from 'vuex'
  import animations from 'create-keyframe-animation'
  import {prefixStyle} from 'common/js/dom'//处理前缀问题
  const transform = prefixStyle('transform')
  const transitionDuration = prefixStyle('transitionDuration')
  import ProgressBar from 'base/progress-bar/progress-bar'
  import ProgressCircle from 'base/progress-circle/progress-circle'
  import {playMode} from 'common/js/config'
  import {shuffle} from 'common/js/util'
  import Lyric from 'lyric-parser'//>>>>????
  import Scroll from "base/scroll/scroll"


  // debugger
  export default {
    data() {
      return {
        songReady: false,//是否准备好播放
        currentTime: 0,//当前播放到的事件
        radius: 32,//通过这个值来控制，圆圈进度条的圆角
        currentLyric: null,//当前的这首歌的歌词
        currentLineNum: 0,//歌词高亮
        currentShow: "cd",//控制dots高亮
        playingLyric: ''
      }
    },
    created() {
      //触摸点的集合
      this.touch = []
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
        'currentIndex',
        'mode',
        'sequenceList'
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
      percent() {
        return this.currentTime / this.currentSong.duration
      },
      //播放模式图标
      iconMode() {
        return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
      }
    },

    methods: {
      ...mapMutations({
        setFullScreen: 'SET_FULL_SCREEN',
        setPlayingState: 'SET_PLAYING_STATE',
        setCurrentIndex: 'SET_CURRENT_INDEX',
        setPlayMode: 'SET_PLAY_MODE',
        setPlayList: 'SET_PLAYLIST'
      }),
      middleTouchStart(e) {
        //是否开始触摸，有什么用
        // this.touch.initiated = true
        // // 用来判断是否是一次移动
        // this.touch.moved = false
        const touch = e.touches[0]
        //触摸点的其实位置
        this.touch.startX = touch.pageX
        this.touch.startY = touch.pageY
      },
      middleTouchMove(e) {
        // if (!this.touch.initiated) {
        //   return
        // }
        const touch = e.touches[0]
        const deltaX = touch.pageX - this.touch.startX
        const deltaY = touch.pageY - this.touch.startY
        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          return
        }
        // if (!this.touch.moved) {
        //   this.touch.moved = true
        // }
        //如果展现的是cd页面，左边偏移量
        const left = this.currentShow === 'cd' ? 0 : -window.innerWidth
        //
        const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
        this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricList.$el.style[transitionDuration] = 0;
        this.$refs.middleL.style.opacity = 1 - this.touch.percent;
        this.$refs.middleL.style[transitionDuration] = 0;

        console.log(this.touch);
      },
      middleTouchEnd() {
        // if (!this.touch.moved) {
        //   return
        // }
        let offsetWidth
        let opacity
        if (this.currentShow === 'cd') {
          if (this.touch.percent > 0.1) {
            offsetWidth = -window.innerWidth
            opacity = 0
            this.currentShow = 'lyric'
          } else {
            offsetWidth = 0
            opacity = 1
          }
        } else {
          if (this.touch.percent < 0.9) {
            offsetWidth = 0
            this.currentShow = 'cd'
            opacity = 1
          } else {
            offsetWidth = -window.innerWidth
            opacity = 0
          }
        }
        const time = 300
        this.$refs.lyricList.$el.style[transform] = `translate3d(${offsetWidth}px,0,0)`
        this.$refs.lyricList.$el.style[transitionDuration] = `${time}ms`
        this.$refs.middleL.style.opacity = opacity
        this.$refs.middleL.style[transitionDuration] = `${time}ms`
        // this.touch.initiated = false
      },

      getLyric() {
        this.currentSong.getLyric().then((lyric) => {
          if (this.currentSong.lyric !== lyric) {
            return
          }
          this.currentLyric = new Lyric(lyric, this.handleLyric)
          if (this.playing) {
            this.currentLyric.play()
          }
        }).catch(() => {
          this.currentLyric = null
          this.playingLyric = ''
          this.currentLineNum = 0
        })
      },

      handleLyric({lineNum, txt}) {
        this.currentLineNum = lineNum
        if (lineNum > 5) {
          let lineEl = this.$refs.lyricLine[lineNum - 5]
          this.$refs.lyricList.scrollToElement(lineEl, 1000)
        } else {
          this.$refs.lyricList.scrollTo(0, 0, 1000)
        }
        this.playingLyric = txt


      },
      back() {
        this.setFullScreen(false)
      },
      open() {
        this.setFullScreen(true)

      },
      //获取两个图标的缩放比例和偏移距离
      _getPosAndScale() {
        //由于是响应式布局，窗口大小不同的时候，两图之间的距离不同，缩放比例不同，所以需要计算出来，所以使用之前那种css动画方式不准确，只能使用js方法，添加动画，那么就是用到了transition动画的js钩子函数 和  插件npm install create-keyframe-animation --save
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

      //播放或者暂停
      togglePlaying() {
        if (!this.songReady) {
          //没有获取到歌曲mp3数据，，就直接结束这个函数
          return
        }
        this.setPlayingState(!this.playing)
        if (this.currentLyric) {
          this.currentLyric.togglePlay()
        }
      },
      //下一首和上一首
      next() {
        if (!this.songReady) {
          return
        }
        if (this.playList.length === 1) {
          this.loop()
        } else {
          let index = this.currentIndex + 1
          if (index === this.playList.length) {
            index = 0
          }
          this.setCurrentIndex(index)
          if (!this.playing) {
            this.togglePlaying()
          }
          this.songReady = false
          //问题1：切换太快的时候会报错？？
          //
        }

      },
      prev() {
        if (!this.songReady) {
          return
        }
        if (this.playList.length === 1) {
          this.loop()

        } else {
          let index = this.currentIndex - 1
          if (index === -1) {
            index = this.playList.length - 1
          }
          this.setCurrentIndex(index)
          if (!this.playing) {
            this.togglePlaying()
          }
          this.songReady = false
        }
      },
      end() {
        if (this.mode === playMode.loop) {
          this.loop()
        } else {
          this.next()
        }
      },
      loop() {
        console.log(this.$refs.audio.currentTime);
        this.$refs.audio.currentTime = 0;
        this.$refs.audio.play()
        if (this.currentLyric) {
          this.currentLyric.seek(0)
        }
      },
      ready() {
        this.songReady = true
      },
      error() {//就是说，如果没有夏一首歌曲，或者没有网的情况下，这样设置，也不会影响按钮的正常使用
        this.songReady = true
      },

      updateTime(e) {
        // console.log(e.target.currentTime);
        // console.dir(e.target);
        this.currentTime = e.target.currentTime;//currentTime:是可读取的属性，是一个时间戳
      },
      format(interval) {
        interval = interval | 0;
        const minute = interval / 60 | 0;
        const second = this._pad(interval % 60);
        return `${minute}:${second}`
      },
      //将数值补零
      _pad(num, n = 2) {
        let len = num.toString()
        // while(len<n){
        //   num='0'+num
        //   len++
        // }

        // len.padEnd(2,'0')
        return len.padStart(2, '0')
      },
      //控制播放的进度
      onProgressBarChange(percent) {
        const currentTime = this.currentSong.duration * percent
        this.$refs.audio.currentTime = currentTime
        if (!this.playing) {
          this.togglePlaying()
        }
        if (this.currentLyric) {
          this.currentLyric.seek(currentTime * 1000)
        }
      },
      //播放模式
      changeMode() {
        const mode = (this.mode + 1) % 3
        this.setPlayMode(mode)
        let list = null;
        if (mode === playMode.random) {
          list = shuffle(this.sequenceList)
        } else {
          list = this.sequenceList
        }
        this.resetCurrentIndex(list)
        this.setPlayList(list)

      },
      resetCurrentIndex(list) {
        let index = list.findIndex((item) => {
          return item.id === this.currentSong.id
        })
        this.setCurrentIndex(index)
      },
    },

    watch: {
      currentSong(newSong, oldSong) {
        if (newSong.id === oldSong.id) {
          return
        }
        if (this.currentLyric) {
          this.currentLyric.stop()
        }

        //为什么不能使用$nextTick
        //当我们从微信中，播放的时候，微信到后台，实际上js是不会执行的？？？
        //不明白
        setTimeout(() => {
          this.$refs.audio.play()
          this.getLyric()
        },1000)
      },
      playing(newPlaying) {
        const audio = this.$refs.audio
        this.$nextTick(() => {
          newPlaying ? audio.play() : audio.pause()
        })
      }
    },
    components: {
      ProgressBar,
      ProgressCircle,
      Scroll
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
        /*这个使用transition组件实现过渡*/
        transition: all 0.4s

        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)

      &.normal-enter, &.normal-leave-to
        opacity: 0

        .top
          /*这个就是使用过度效果*/
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

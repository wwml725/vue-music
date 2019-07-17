import {playMode} from 'common/js/config'
const state = {
  singer: {},//歌手信息
  //播放器所需数据
  playing:false,//是否正在播放
  fullScreen:false,//是否显示全屏面板（或者小面板）
  playList:[],//播放列表
  sequenceList:[],//随机播放列表相关
  //顺序播放的时候playList和sequenceList列表是一样的
  mode:playMode.sequence,//播放模式  是顺序还是随机
  currentIndex:-1,//当前播放的歌曲索引
  //如果想播放下一首，只需要控制currentIndex
}

export default state

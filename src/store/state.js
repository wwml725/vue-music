import {playMode} from 'common/js/config'
import {loadSearch,loadPlay} from 'common/js/cache'


const state = {
  //歌手信息 （这条信息为什么要保存在vuex中？需要在另外一个页面使用singer中的id值获取某一位歌手的歌曲列表）
  singer: {},
  //播放器所需数据
  playing:false,//是否正在播放
  fullScreen:false,//是否显示全屏面板（或者小面板）
  playList:[],//播放列表 实际播放的是这个列表
  sequenceList:[],//播放列表的顺序，顺序播放列表  （他始终存放的都是那个顺序播放列表）
  //顺序播放的时候playList和sequenceList列表是一样的
  mode:playMode.sequence,//播放模式  是顺序还是随机
  currentIndex:-1,//他始终显示的都是当前播放歌曲的索引值（playList列表中当前歌曲索引值，由于点击随机播放按钮列表顺序会打乱，所以索引值也会随之改变）
  //如果想播放下一首，只需要控制currentIndex
  disc: {},
  topList: {},
  searchHistory: loadSearch(),
  playHistory:loadPlay(),//播放历史
  
};

//sequenceList是顺序列表，播放列表是playList,
//1、第一次获取歌曲列表的时候，放到了playList和sequenceList中
//2、随机播放的时候，是将sequenceList列表打乱之后放到playList，但是不改变sequenceList原数组
//3、再次点击到顺序播放的时候，将sequenceList列表的数据复制放到playList中，并且在palyList中找到当前播放的这首歌曲，设置为currentSong



export default state

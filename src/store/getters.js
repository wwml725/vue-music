export const singer = state => state.singer;

export const playing = state => state.playing;

export const fullScreen = state => state.fullScreen;

export const playList = state => state.playList;

export const sequenceList = state => state.sequenceList;

export const mode = state => state.mode;

export const currentIndex = state => state.currentIndex;

//getter除了起一个代理的作用，还可以作为一个计算属性来使用
//当前歌曲
export const currentSong = (state)=>{
  return state.playList[state.currentIndex]||{}
};
//推荐歌单详情页
export const disc = state => state.disc
//排行页面
export const topList = state => state.topList




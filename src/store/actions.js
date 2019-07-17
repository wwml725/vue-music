import * as types from "./mutation-types"

//点击播放
export const selectPlay = function({commit,state},{list,index}){
  //提交这个mutation并且传入参数list
  commit(types.SET_PLAYING_STATE,true);//是否播放
  commit(types.SET_FULL_SCREEN,true);//是否全屏
  commit(types.SET_PLAYLIST,list);//播放列表
  commit(types.SET_SEQUENCE_LIST,list);//播放列表
  commit(types.SET_CURRENT_INDEX,index);//当前歌曲索引，也就是点击的那一首歌的索引
  
  //就差一个播放状态，随机还是顺序
 
};

import * as types from "./mutation-types"
import {shuffle} from 'common/js/util'
import {playMode} from 'common/js/config'
function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}

//点击播放歌曲
//为什么要以state为参数，需要传入state吗？？
export const selectPlay = function({commit,state},{list,index}){
  //提交这个mutation并且传入参数list
  commit(types.SET_PLAYING_STATE,true);//是否播放
  commit(types.SET_FULL_SCREEN,true);//是否全屏
  if (state.mode === playMode.random) {
    let randomList = shuffle(list)
    commit(types.SET_PLAYLIST, randomList)
    index = findIndex(randomList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_SEQUENCE_LIST,list);//播放列表
  commit(types.SET_CURRENT_INDEX,index);//当前歌曲索引，也就是点击的那一首歌的索引
  
  //就差一个播放状态，随机还是顺序
 
};


//点击随机播放按钮
export const randomPlay = function ({commit}, {list}) {
  commit(types.SET_PLAY_MODE, playMode.random)//点击这个按钮首先将播放模式改为这个reandom
  commit(types.SET_SEQUENCE_LIST, list)//播放列表
  let randomList = shuffle(list)
  commit(types.SET_PLAYLIST, randomList)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

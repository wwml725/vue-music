import * as types from "./mutation-types"
import {shuffle} from 'common/js/util'
import {playMode} from 'common/js/config'

//findIndex返回满足条件的数据的索引值，如果都不符合条件返回-1
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

//点击搜索推荐列表的歌曲，修改相应的属性
export const insertSong = function ({commit, state}, song) {
  //将vuex中原有的数据复制一份，因为修改数据只能在mutation中修改，否则会报错
  let playList = state.playList.slice()
  let sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  // 记录当前歌曲
  let currentSong = playList[currentIndex]
  // 查找当前列表中是否有待插入的歌曲并返回其索引
  //判断对应数据是否存在，如果存在返回哪一项的索引值，不存在返回-1
  let fpIndex = findIndex(playList, song)
  // 因为是插入歌曲，所以索引+1
  currentIndex++
  // 插入这首歌到当前索引位置（在这个索引后面添加这首歌曲）
  playList.splice(currentIndex, 0, song)
  //插入之后，再判断，如果已经包含了这首歌，就>-1,所以的删除哪一项存在的，并且维护索引偏移量
  // 如果已经包含了这首歌
  if (fpIndex > -1) {//>-1说明存在
    // 如果当前插入的序号大于列表中的序号
    if (currentIndex > fpIndex) {
      playList.splice(fpIndex, 1)
      currentIndex--
    } else {
      //因为添加了一项，所以索引值后移一位，删除存在的哪一项
      playList.splice(fpIndex + 1, 1)
    }
  }
  
  
  //获得要插入的位置
  let currentSIndex = findIndex(sequenceList, currentSong) + 1
  //判断对应数据是否存在，如果存在返回哪一项的索引值，不存在返回-1
  let fsIndex = findIndex(sequenceList, song)
  console.log(fsIndex+"aaaaaaaaaaaaa");
  sequenceList.splice(currentSIndex, 0, song)
  
  if (fsIndex > -1) {
    if (currentSIndex > fsIndex) {
      sequenceList.splice(fsIndex, 1)
    } else {
      //因为这样添加，查找的数据被向后推移了一位
      sequenceList.splice(fsIndex + 1, 1)
    }
  }
  
  commit(types.SET_PLAYLIST, playList)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}





import * as types from  './mutation-types'
const mutations = {
  //第一个参数就是state，第二个参数是传进来的数据
  [types.SET_SINGER](state,singer){
    state.singer = singer
  },
  //这些函数传入的第二个参数就是state中要变成的数据
  [types.SET_PLAYING_STATE](state,flag){
    state.playing = flag
  },
  [types.SET_FULL_SCREEN](state,flag){
    state.fullScreen = flag
  },
  [types.SET_PLAYLIST](state,list){
    state.playList = list
  },
  [types.SET_SEQUENCE_LIST](state,list){
    state.sequenceList = list
  },
  [types.SET_PLAY_MODE](state,mode){
    state.mode = mode
  },
  [types.SET_CURRENT_INDEX](state,currentIndex){
    state.currentIndex = currentIndex
  },
  [types.SET_DISC](state, disc) {
    state.disc = disc
  },
  [types.SET_TOP_LIST](state, topList) {
    state.topList = topList
  },
  [types.SET_TOP_LIST](state, topList) {
    state.topList = topList
  },
};
export default mutations

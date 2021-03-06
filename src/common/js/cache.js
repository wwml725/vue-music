import storage from 'good-storage'
const SEARCH_KEY = '__search__'
const SEARCH_MAX_LEN = 15 //设置最大存储空间

const PLAY_KEY = '__play__'
const PLAY_MAX_LEN = 200 //设置最大存储条数

const FAVORITE_KEY = '__favorite__'
const FAVORITE_MAX_LEN = 200



//因为localStroage的api是需要操作字符串的所以比较麻烦
//把数组转化为字符串在存入
//插入数组
/**
 *
 * @param arr 数组
 * @param val 需要插入的值
 * @param compare  要比较的值，确切的说是一个条件
 * @param maxLen  最大值
 */
function insertArray(arr, val, compare, maxLen) {
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}
function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}

//保存搜索历史，保存的是搜索关键字
export function saveSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, (item) => {return item === query}, SEARCH_MAX_LEN)
  storage.set(SEARCH_KEY, searches)
  return searches
}
//从缓存中获取已有的数据
export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}
//删除某一项历史
export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}
//清空搜索历史
export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}


//播放历史存储
export function savePlay(song) {
  //把这个歌曲保存在storage中，兵器
  let songs = storage.get(PLAY_KEY,[])
  insertArray(songs,song,(item)=>{
    return item.id===song.id
  },PLAY_MAX_LEN)
  storage.set(PLAY_KEY,songs)
  return songs
}

export function loadPlay() {
  return storage.get(PLAY_KEY,[])
}


//收藏设置
export function saveFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  insertArray(songs, song, (item) => {
    return song.id === item.id
  }, FAVORITE_MAX_LEN)
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function deleteFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  deleteFromArray(songs, (item) => {
    return item.id === song.id
  })
  storage.set(FAVORITE_KEY, songs)
  return songs
}

export function loadFavorite() {
  return storage.get(FAVORITE_KEY, [])
}

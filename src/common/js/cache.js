import storage from 'good-storage'
const SEARCH_KEY = '__search__'
const SEARCH_MAX_LEN = 15 //设置最大存储空间

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


export function saveSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, (item) => {return item === query}, SEARCH_MAX_LEN)
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}

export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}


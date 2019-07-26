import {commonParams} from './config'
import axios from 'axios'

//获取歌词，通过传入歌曲的id获取某一个歌曲的歌词
export function getLyric(mid) {
  const url = '/lyric'

  const data = Object.assign({}, commonParams, {
    songmid: mid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    pcachetime: +new Date(),//当前的时间戳
    format: 'json',
    g_tk:67232076
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

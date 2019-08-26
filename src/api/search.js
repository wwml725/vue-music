import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
import axios from "axios";

export function getHotKey() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

  const data = Object.assign({}, commonParams, {
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  })

  return jsonp(url, data, options)
}


//搜索接口说明，每一个参数是什么意思？
/**
 *
 * @param query 关键词
 * @param page  加载第几页
 * @param zhida 什么意思？？？
 * @param perpage 每页设置几条数据
 * @returns {Promise<AxiosResponse<T> | never>}
 */
export function search(query, page, zhida, perpage) {
  const url = '/getSearch'

  const data = Object.assign({}, commonParams, {
    w: query,
    p: page,
    perpage,
    n: perpage,
    catZhida: zhida ? 1 : 0,
    zhidaqu: 1,
    t: 0,
    flag: 1,
    ie: 'utf-8',
    sem: 1,
    aggr: 0,
    remoteplace: 'txt.mqq.all',
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  })
  
  return axios.get(url,{params:data}).then((res) => {
    // console.log(res);
    return Promise.resolve(res.data)
  })}

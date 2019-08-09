import jsonp from 'common/js/jsonp'
import {commonParams, options} from './config'
import axios from "axios"

//获取推荐列表的轮播图数据
//轮播图数据地址：https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&platform=h5&uin=0&needNewCode=1&jsonpCallback=jp0
//为什么不将地址写全了，而是传入查询字符串，获取数据
//直接写全了不是更简单明了吗？
export function getRecommend() {//jsonp方法不需要跨域
  //明明这个基本路径就返回了数据，为什么还要添加那些查询字符串呢？？
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'
  //data是一个对象，传入jsonp函数之后，会自动转换为查询字符串就是?后面的那一部分
  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 0
  });

  //返回执行jsonp获取的结果
  return jsonp(url, data, options)
}

//获取推荐页面，歌单列表
export function getDiscList() {
  const url = '/getDiscList'//这是在本地设置的一个代理路径，真正从服务端获取数据，是在webpack.dev.config文件中的devServer中设置的
  const data = Object.assign({}, commonParams, {
    platform: 'yqq',
    hostUin: 0,
    sin: 0,
    ein: 29,
    sortId: 5,
    needNewCode: 0,
    categoryId: 10000000,
    rnd: Math.random(),
    format: 'json'
  });
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}

//http://ustbhuangyi.com/music/api/getCdInfo?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&disstid=7122411755&type=1&json=1&utf8=1&onlysong=0&platform=yqq&hostUin=0&needNewCode=0
export function getSongList(disstid) {
  console.log('getSongList');
  const url = '/getCdInfo'
  
  const data = Object.assign({}, commonParams, {
    disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0
  })
  
  return axios.get(url,{params:data}).then((res) => {
    // console.log(res);
    return Promise.resolve(res.data)
  })
}





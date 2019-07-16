// import {getLyric} from 'api/song'
import {ERR_OK} from 'api/config'
import {Base64} from 'js-base64'

//这个类用来做标准化代码，也就是从后台数据中挑拣出有用的数据
export default class Song {
  constructor({id, mid, singer, name, album, duration, image, url}) {
    this.id = id  //通过id找到歌曲的真实路径
    this.mid = mid
    this.singer = singer //歌手
    this.name = name  //歌曲名称
    this.album = album  //专辑名称
    this.duration = duration  //歌曲的进度
    this.image = image  //歌曲列表的图片
    this.url = url   //歌曲的真实路径
  }

/*
  getLyric() {
    if (this.lyric) {
      return Promise.resolve(this.lyric)
    }

    return new Promise((resolve, reject) => {
      getLyric(this.mid).then((res) => {
        if (res.retcode === ERR_OK) {
          this.lyric = Base64.decode(res.lyric)
          resolve(this.lyric)
        } else {
          reject('no lyric')
        }
      })
    })
  }
*/
}

//通过工厂方法，创建所需要的对象
export function createSong(musicData) {
  return new Song({
    id: musicData.songid,  //必须要传的
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    //https://y.gtimg.cn/music/photo_new/T001R300x300M000003LaMHm42u7qS.jpg?max_age=2592000
    //songmid(图片地址参数)
    //musicData.albummid
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    url: `http://ws.stream.qqmusic.qq.com/${musicData.songid}.m4a?fromtag=46`
  })
}

function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}


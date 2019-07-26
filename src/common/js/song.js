import {getLyric} from 'api/song'
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
  
  getLyric() {
    // if (this.lyric) {
    //   return Promise.resolve(this.lyric)
    // }
    
    getLyric(this.mid).then((res) => {
      if (res.retcode === ERR_OK) {
        this.lyric = res.lyric
        console.log(this.lyric);
      }
    })
    
  }

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
    // url: `http://aqqmusic.tc.qq.com/amobile.music.tc.qq.com/c400${musicData.songmid}.m4a?fromtag=46`
    
    //由于现在歌曲的说地址改变了所以需要重新设置这个路径
    
    //http://aqqmusic.tc.qq.com/amobile.music.tc.qq.com/C400${musicData.songmid}.m4a?guid=538763426&vkey=354EF7B19DAFFE2CF40F8205D76DE996094DAF656EC004A6A9966A798CCEF24A78081E0D14DFE1356EF30E53F0E7F345D54658F46FDB9019&uin=0&fromtag=38
    
    //因为很多歌曲的设置了vip才可以收听，所以查询字符串中有登陆的用户，和vip密匙
    url: `http://aqqmusic.tc.qq.com/amobile.music.tc.qq.com/C400${musicData.songmid}.m4a?guid=538763426&vkey=354EF7B19DAFFE2CF40F8205D76DE996094DAF656EC004A6A9966A798CCEF24A78081E0D14DFE1356EF30E53F0E7F345D54658F46FDB9019&uin=0&fromtag=38`
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


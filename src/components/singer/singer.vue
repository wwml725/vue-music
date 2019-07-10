<template>
  <div class="singer" ref="singer">
    <list-view @select="selectSinger" :data="singers" ref="list"></list-view>
    <!--<list-view @select="selectSinger" :data="singers" ref="list"></list-view>-->

    <transition name="slide">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
  import ListView from 'base/listview/listview'
  import {getSingerList} from 'api/singer'
  import {ERR_OK} from 'api/config'
  //这个是一个构造函数，用来批量创建我们需要的数据
  import Singer from 'common/js/singer'
  import {mapMutations} from 'vuex'

  const HOT_SINGER_LEN = 10;
  const HOT_NAME = '热门';

  export default {
    data() {
      return {
        singers: []
      }
    },
    created() {
      this._getSingerList()
    },
    methods: {
      selectSinger(singer) {
        this.$router.push({
          path: `/singer/${singer.id}`
        });
        this.setSinger(singer)
      },

      _getSingerList() {
        //https://c.y.qq.com/v8/fcg-bin/v8.fcg?g_tk=1928093487&inCharset=utf-8&outCharset=utf-8&notice=0&format=jsonp&channel=singer&page=list&key=all_all_all&pagesize=100&pagenum=1&hostUin=0&needNewCode=0&platform=yqq&jsonpCallback=__jp0
        //获取后台接口的数据
        getSingerList().then((res) => {
          if (res.code === ERR_OK) {
            console.log(res);
            console.log(res.data.list);
            this.singers = this._normalizeSinger(res.data.list)
            console.log(this.singers);
          }
        })
      },

      _normalizeSinger(list) {
        //将后台数据处理成我们所需要的数据，格式
        //将数据规范化
        let map = {
          //因为后台数据中没有热门，所以我们自己创建一个热门，比如前十条数据
          hot: {
            title: HOT_NAME,
            items: []
          }
        };

        list.forEach((item, index) => {
          if (index < HOT_SINGER_LEN) {
            //在这里要获取去图片地址是要拼接的所以构造了一个函数，可以批量生产，传入name，和id，通过new方法执行函数，就可以生产处不同的头像地址，和name
            //用一个对象{name: item.Fsinger_name,id: item.Fsinger_mid}作为实际参数
            map.hot.items.push(new Singer({
              name: item.Fsinger_name,
              id: item.Fsinger_mid
            }))
          }

          const key = item.Findex;
          if (!map[key]) {
            map[key] = {
              title: key,
              items: []
            }
          }
          // console.log(key);
          // console.log(map[key]);
          map[key].items.push(new Singer({
            name: item.Fsinger_name,
            id: item.Fsinger_mid
          }))

        })
        console.log(map);

        // 为了得到有序列表，我们需要处理 map
        let ret = []
        let hot = []
        for (let key in map) {
          let val = map[key]
          //筛选出title是字母的对象
          if (val.title.match(/[a-zA-Z]/)) {
            ret.push(val)
          } else if (val.title === HOT_NAME) {
            hot.push(val)
          }
        }

        console.log(ret);
        ret.sort((a, b) => {
          return a.title.charCodeAt(0) - b.title.charCodeAt(0)
        })
        return hot.concat(ret)
      },

      ...mapMutations({
        setSinger:'SET_SINGER'
      })
    },

    components: {
      ListView
    }
  }

</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>

<template>

  <div class="singer-detail-container">

    {{msg}}
    <p>1</p>
    <p>1</p>
    <p>1</p>
    <p>1</p>
    <p>1</p>
    <p>1</p>
    <p>1</p>
    <p>1</p>
    <p>1</p>
    <p>1</p>
    <p>1</p>
    <p>1</p>
    <p>1</p>
    <p>1</p>
    <p>1</p>
    <p>1</p>
    <p>1</p>
    <p>1</p>
    <p>1</p>
    <p>1</p>
    <p>1</p>
    <p>1</p>
  </div>

</template>

<script>

  import {mapGetters} from 'vuex'
  import {getSingerDetail} from 'api/singer'
  import {ERR_OK} from 'api/config'

  export default {
    // name: "singer-detail",
    data() {
      return {
        msg: "singer-detail"
      }
    },
    created() {
      // console.log('11');
      // console.log(this.singer);
      this._getDetail()

    },
    methods: {
      _getDetail(){
        if(!this.singer.id){
          this.$router.push('/singer')
        }
        getSingerDetail(this.singer.id).then((res)=>{
          if(res.code===ERR_OK){
            console.log(res.data.list);
          }
        })
      }


    },
    computed: {
      ...mapGetters(['singer'])
    },
    components: {}
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin";
  .singer-detail-container
    position: fixed
    z-index: 100
    top: 0
    left: 0
    bottom: 0
    right: 0
    background: $color-background


  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>

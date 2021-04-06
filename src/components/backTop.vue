<template>
  <div class="backTop">
      <div class="icon" v-show="show"></div>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  data() {
    return {
        begin:0,
        end:0,
        timer:null,
        show:false
    }
  },
  props:[
      'scroll'
  ],
  mounted() {
    //   监听页面滚动的高度
      window.addEventListener('scroll',() =>{
          if(parseInt(this.my_scroll().top)>this.scroll){
              this.show = true
          }else{
              this.show = false
          }
          this.begin = this.my_scroll().top
      })

    //   监听返回顶部控件的点击
    document.querySelector('.icon').addEventListener('click',() => {
        clearInterval(this.timer)
        this.timer = setInterval(() => {
            this.begin = this.begin + (this.end - this.begin)*0.2
            window.scrollTo(0,this.begin)
            if(parseInt(this.begin)===0){
                clearInterval(this.timer)
            }
        }, 20);
    })
  },
  methods: {
      my_scroll() {
            if(window.pageYOffset!==null){
                return {top : window.pageYOffset}
            }else if(document.compatMode==="CSS1Compat"){
                return { top : document.documentElement.scrollTop}
            }
            return { top : document.body.scrollTop}

        },
       my_client() {
            if(window.innerWidth){
                return{
                    width : window.innerWidth,
                    height : window.innerHeight
                }
            }else if (document.compatMode==='CSS1Compat'){
                return{
                    width : document.documentElement.clientWidth,
                    height : document.documentElement.clientHeight
                }
            }
            return{
                width : document.body.clientWidth,
                height : document.body.clientHeight
            }
        }
  },
}
</script>

<style scoped >
    .icon{
        width: 10%;
        height: 18%;
        max-height: 146px;
        max-width: 40px;
        background-image: url(../img/scrolltop.png);
        position: fixed;
        background-size: 100% 100%;
        right: 10%;
        bottom: 80px;
        z-index: 99;
    }
</style>

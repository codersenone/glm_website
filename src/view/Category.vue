<template>
  <div class="page">
      <van-tabs v-model="activeName" sticky>
        <van-tab title="数码" name="数码">
            <ul>
                <van-cell  v-for="item in goodsList" :key="item.id">
                <template>
                    <div class="lazy-load-item" :id="item.id" @click="toDetail(item.id)">
							<img class="mui-pull-left pro_icon" :src=url+item.id>
							<span class="title"><p>{{item.title}}</p></span>
							<div class="labs"><span>{{item.label[0]}}</span><span>{{item.label[1]}}</span></div>
							<span class='price'>￥{{item.price}}</span>				
					</div>
                </template>
            </van-cell>
            </ul>
        </van-tab>
        <van-tab title="超市" name="超市">
            <ul>
                <van-cell  v-for="item in goodsList" :key="item.id">
                <template>
                    <div class="lazy-load-item" :id="item.id" @click="toDetail(item.id)">
							<img class="mui-pull-left pro_icon" :src=url+item.id>
							<span class="title"><p>{{item.title}}</p></span>
							<div class="labs"><span>{{item.label[0]}}</span><span>{{item.label[1]}}</span></div>
							<span class='price'>￥{{item.price}}</span>				
					</div>
                </template>
            </van-cell>
            </ul>
        </van-tab>
        <van-tab title="奶粉" name="奶粉">
            <ul>
                <van-cell  v-for="item in goodsList" :key="item.id">
                <template>
                    <div class="lazy-load-item" :id="item.id" @click="toDetail(item.id)">
							<img class="mui-pull-left pro_icon" :src=url+item.id>
							<span class="title"><p>{{item.title}}</p></span>
							<div class="labs"><span>{{item.label[0]}}</span><span>{{item.label[1]}}</span></div>
							<span class='price'>￥{{item.price}}</span>				
					</div>
                </template>
            </van-cell>
            </ul>
        </van-tab>
        <van-tab title="服装" name="服装">
            <ul>
                <van-cell  v-for="item in goodsList" :key="item.id">
                <template>
                    <div class="lazy-load-item" :id="item.id" @click="toDetail(item.id)">
							<img class="mui-pull-left pro_icon" :src=url+item.id>
							<span class="title"><p>{{item.title}}</p></span>
							<div class="labs"><span>{{item.label[0]}}</span><span>{{item.label[1]}}</span></div>
							<span class='price'>￥{{item.price}}</span>				
					</div>
                </template>
            </van-cell>
            </ul>
        </van-tab>
      </van-tabs>
  </div>
</template>

<script type="text/ecmascript-6">
import {request} from '../network/request';
export default {
  data() {
    return {
        url:this.$store.state.url+'/images?id=',
        activeName: '数码',
        goodsList:[],
        scroll:null
    }
  },
  watch:{
      activeName(nVal,oVal){
          this.getGoods()
      }
  },
  methods: {
      getGoods(){
          request('/goods/category?key='+this.activeName)
            .then(res => {
                this.goodsList = res.data
            })
            .catch(err => {
                this.$toast('网络错误')
            })
      },
      toDetail(id){
          this.$router.push({
              path:'/detail',
              query:{gid:id}
          })
      }
  },
  mounted() {
      this.getGoods()
      window.addEventListener('scroll',() => {
          let scroll = window.pageYOffset || document.documentElement.scrollTop
          if(scroll!=0){
              this.scroll = scroll
          }
      })
  }, 
  deactivated() {
      sessionStorage.setItem('cateScroll',this.scroll)
  }, 
  activated() {
      let scroll = sessionStorage.getItem('cateScroll')||0
      window.scrollTo(0,parseFloat(scroll))
  },  
}
</script>

<style scoped>
    .title{		
        position: absolute;
        left: 110px!important;
        margin-left: 5px;    
	}
    .title>p{
        color: black;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal ！important;
        display: -webkit-box;
        -webkit-line-clamp: 2;     /* 显示2行，为auto时不隐藏 */
        -webkit-box-orient: vertical;
    }
    .pro_icon{
        width: 66px;
        height: 66px;
        margin: 12px 0 0 22px;
    }
    .price{
        font-size: 15px;
        height: 20px;
        color: red;
        position: absolute !important;
        left: 110px!important;
        top:unset;
        bottom: 5px;
    }
    .labs{
        position: absolute;
        bottom: 5px;
        right: 10px;
    }
    .labs>span{
        padding: 0px 3px 0px 3px; 
        font-size: 12px;
        border-radius: 5px;
        color: #AAAAAA;
        border: #AAAAAA 1px solid;
        margin-left: 5px;
    }
</style>

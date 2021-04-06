<template>
  <div class="page">
    <van-sticky>
      <van-nav-bar
            title="搜索结果"
            left-text="返回"
            left-arrow
            @click-left="back()" 
      />
     </van-sticky>
     <!-- 搜索栏 -->
     <van-search
          v-model="key"
          show-action
          label="商品"
          placeholder="请输入搜索关键词"
          @search="onSearch"
      >
          <template #action>
              <div @click="onSearch">搜索</div>
          </template>
      </van-search>
      <!-- 显示内容 -->
      <div class="content">
        <div v-show="showEmpty">
            <p class='noSearch'>抱歉，暂时没有销售 {{key}} 商品<br/><img src='../img/sorry.png'></p>
        </div>
        <div>
            <ul>
            <van-cell  v-for="item in result" :key="item.id">
                <template>
                    <a href="" class="lazy-load-item" :id="item.id" @click="toDetail(item.id)">
                        <img class="mui-pull-left pro_icon" :src='item.imgUrl'>
                        <span class="title"><p>{{item.title}}</p></span>
                        <div class="labs"><span>{{item.label[0]}}</span><span>{{item.label[1]}}</span></div>
                        <span class='price'>￥{{item.price}}</span>				
                    </a>
                </template>
            </van-cell>
          </ul>
        </div>
      </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { request } from '../network/request'
export default {
  data() {
    return {
      key:'',
      result:[],
      showEmpty:false
    }
  },
  deactivated() {
    this.$destroy()
  },
  activated() {
    this.key = this.$route.query.key
    this.onSearch()
  },
  watch:{
    key:{
      handler(newVal, objVal){
        if(newVal==''){
          this.result = []
          this.showEmpty = false
        }
      }
    }
  },
  methods: {
    back(){
      this.$router.back()
    },
    onSearch(){
      this.result = []
      request('/goods/search?key='+this.key)
        .then(res => {
          let data = res.data
          for(let item of data){
            item.imgUrl = this.$store.state.url+'/images?id='+item.id
            this.result.push(item)
          }
          if(this.result.length!=0){
            this.showEmpty = false
          }else if(this.result.length==0&&this.key!=''){
            this.showEmpty = true
          }else{
            this.showEmpty = false
          }
        })
    },
    toDetail(gid){
      this.$router.push({
        path:'/detail',
        query:{
          gid:gid
        }
      })
    }
  },
}
</script>

<style scoped >
    .page{
      position: relative;
      height: 100vh;
      background-color: #fff;
      z-index: 9;
    }
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

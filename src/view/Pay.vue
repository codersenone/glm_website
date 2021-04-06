<template>
  <div class="page">
    <!-- 标题栏 -->
      <van-sticky>
        <van-nav-bar
          title="确认订单"
          left-text="返回"
          left-arrow
          @click-left="back()"
        />
      </van-sticky>
    <!-- 内容 -->
      <div class="content">
				<p>您正在为订单{{oid}}付款</p>
				<div class="showPrice">
					<span>订单总价：</span>
					<span>￥{{order.totalPrice}}</span>
				</div>
				<van-divider :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }">商品列表</van-divider>
				<ul class="showList">
					<li class="li_normal" v-for="item in order.goods" @click="toDetail(item.gid)">
						<img :src=item.imgURL>
						<div class="title">{{item.title}}</div>
						<span class="price">￥{{item.price}}</span>
						<span class="num">数量：{{item.num}}</span>
					</li>
				</ul>
				<button @click="finish" class="pay">付款 ￥{{order.totalPrice}}</button>
			</div>

       <!-- 遮罩层 -->
      <van-overlay :show="show">
        <div class="wrapper">
          <div class="block">正在加载数据<van-loading style="margin-top:50px;" /></div>
        </div>
      </van-overlay>
  </div>
</template>

<script type="text/ecmascript-6">
import {request} from '../network/request';
export default {
  data() {
    return {
      oid:'',
      order:[],
			goods:[],
      show:true
    }
  },
  watch:{
    oid(){
      this.getOrder()
    }
  },
  deactivated() {
    this.$destroy()
  },
  created() {
    this.oid = this.$route.query.oid
  },
  methods: {
    // 返回上一级
    back(){
      this.$router.go(-2)
    },
    // 获取订单信息
    getOrder(){
      request('/getOrderByOid?oid='+this.oid)
        .then((res)=>{
          let data = res.data
          // 获取订单商品的信息
          for(let item of data.goods){
            request('/detail?id='+item.gid)
              .then(res2 => {
                let data2 = res2.data
                item.price = data2.price
                item.title = data2.title
                item.imgURL = this.$store.state.url+'/images?id='+item.gid
                this.goods.push(item)
              })
          }
          this.order = data
          this.order.goods = this.goods
          // 数据加载完成关闭遮罩层
          this.show = false
        })
    },
    // 付款完成
    finish(){
      request('/doPay?oid='+this.oid)
        .then((res)=>{
          if(res.data.flag==1){
            this.$toast('付款完成，购物愉快！')
            this.$router.go(-2)
          }
        })
    },
    // 去商品详情
    toDetail(id){
      this.$router.push({
        path:'/detail',
        query:{
          gid:id
        }
      })
    }
  },
}
</script>

<style scoped >
      .page{
        position: relative;
        min-height: 100vh;
        background-color: #fff;
        z-index: 10;
      }
      *{
				padding: 0;
				margin: 0;
				list-style: none;
			}
			.showPrice{
				width: 60%;
				margin: 20px auto;
			}
			.showPrice :nth-child(2){
				display: inline-block;
				position: relative;
				width: 80px;
				left: 10px;
				font-size: 30px;
				color: red;
			}
			.showList{
				margin-bottom: 75px;
        height: calc(100vh - 300px);
        overflow: scroll;
			}
			.pay{
				position: fixed;
				background-color: red;
				color: white;
				width: 150px;
				height: 35px;
				border-radius: 20px;
				left: 50%;
				bottom: 30px;
				margin-left: -75px;
			}			
			.li_normal{
				list-style: none;
				width: 100%;
				height: 100px;
				position: relative;
			}
			.title{
				font-size: 12px;
				margin-left: 30px;
				width: 60%;
				position: absolute;
				left: 90px;
        color: black;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal ！important;
        display: -webkit-box;
        -webkit-line-clamp: 3;     /* 显示3行，为auto时不隐藏 */
        -webkit-box-orient: vertical;
			}
			.li_normal>img{
				width: 80px;
				height: 80px;
				position: absolute;
				left: 10px;
				top: 50%;
				margin-top: -40px;
			}
			.price{
				position: absolute;
				left: 120px;
				top: 80px;
			}
			.num{
				position: absolute;
				right: 10px;
				top: 80px;
				font-size: 12px;
				color: darkgray;
				vertical-align: middle;
			}
      .wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
      }
      .block {
        width: 120px;
        height: 120px;
        background-color: #fff;
        border-radius: 10px;
      }
</style>

<template>
  <div class="page">
    <!-- 标题栏 -->
       <van-sticky>
        <van-nav-bar
          title="全部订单"
          left-text="返回"
          left-arrow
          @click-left="back()"
        />
       </van-sticky>
      <!-- 内容 -->
        <van-tabs v-model="activeName" sticky >
        <van-tab title="待付款" name="1">
            <div v-if="filterList.length!=0" >
              <li class="li_normal" v-for="(item,i) in filterList" @click="toDetail(item.orderId)">
                <span class="oid" >订单编号：{{item.orderId}}</span>
                <ul class="imgList">
                  <li v-for="img in item.goods"><img class="img" :src=img.imgUrl /></li>
                </ul>
                <span class="status">{{getStatus(item.status)}}</span>
                <span class="totalNum" >共{{item.num}}件</span>
                <span class="time" >下单时间：{{item.submitTime}}</span>
                <span class="price" >价格：￥{{item.totalPrice}}</span>
              </li>
					  </div>
            <div v-else style="width: 100%; height: 100%;" >
              <div class="noOrder">
                <p>暂无订单</p>
              </div>
            </div>
        </van-tab>
        <van-tab title="已付款" name="2">
             <div v-if="filterList.length!=0" >
              <li class="li_normal" v-for="(item,i) in filterList" @click="toDetail(item.orderId)">
                <span class="oid" >订单编号：{{item.orderId}}</span>
                <ul class="imgList">
                  <li v-for="img in item.goods"><img class="img" :src=img.imgUrl /></li>
                </ul>
                <span class="status">{{getStatus(item.status)}}</span>
                <span class="totalNum" >共{{item.num}}件</span>
                <span class="time" >下单时间：{{item.submitTime}}</span>
                <span class="price" >价格：￥{{item.totalPrice}}</span>
              </li>
					  </div>
            <div v-else style="width: 100%; height: 100%;" >
              <div class="noOrder">
                <p>暂无订单</p>
              </div>
            </div>
        </van-tab>
        <van-tab title="已取消" name="0">
             <div v-if="filterList.length!=0" >
              <li class="li_normal" v-for="(item,i) in filterList" @click="toDetail(item.orderId)">
                <span class="oid" >订单编号：{{item.orderId}}</span>
                <ul class="imgList">
                  <li v-for="img in item.goods"><img class="img" :src=img.imgUrl /></li>
                </ul>
                <span class="status">{{getStatus(item.status)}}</span>
                <span class="totalNum" >共{{item.num}}件</span>
                <span class="time" >下单时间：{{item.submitTime}}</span>
                <span class="price" >价格：￥{{item.totalPrice}}</span>
              </li>
					  </div>
            <div v-else style="width: 100%; height: 100%;" >
              <div class="noOrder">
                <p>暂无订单</p>
              </div>
            </div>
        </van-tab>
        <van-tab title="全部订单" name="3">
             <div v-if="filterList.length!=0" >
              <li class="li_normal" v-for="(item,i) in filterList" @click="toDetail(item.orderId)">
                <span class="oid" >订单编号：{{item.orderId}}</span>
                <ul class="imgList">
                  <li v-for="img in item.goods"><img class="img" :src=img.imgUrl /></li>
                </ul>
                <span class="status">{{getStatus(item.status)}}</span>
                <span class="totalNum" >共{{item.num}}件</span>
                <span class="time" >下单时间：{{item.submitTime}}</span>
                <span class="price" >价格：￥{{item.totalPrice}}</span>
              </li>
					  </div>
            <div v-else style="width: 100%; height: 100%;" >
              <div class="noOrder">
                <p>暂无订单</p>
              </div>
            </div>
        </van-tab>
        </van-tabs>
      
     
  </div>
</template>

<script type="text/ecmascript-6">
import { request } from '../network/request'
export default {
    data() {
      return {
        uid:'',
        activeName:'',
        orderList:[],
        filterList:[]
      }
    },
    deactivated() {
      this.$destroy()
    },
    created() {
      this.uid = localStorage.getItem('uid')||''
      this.activeName = this.$route.query.status+''
      if(this.uid!=''){
        request('/getOrders?uid='+this.uid)
						.then((res)=>{
							let data = res.data
              for(let item of data){
                for(let iitem of item.goods){
                  iitem.imgUrl = this.$store.state.url+"/images?id="+iitem.gid
                }
              }
							this.orderList = data	
              this.getList(this.activeName)
						})
      }
    },
    methods: {
      //返回
      back(){
        this.$router.back()
      },
      //去订单详情页面
      toDetail(oid){
        this.$router.push({
          path:'/orderdetail',
          query:{
            oid:oid
          }
        })
      },
      //获取列表
      getList(nval){
        if(nval == 3){
							this.filterList = []
							for(let item of this.orderList){
								item.num = 0
								for(let item2 of item.goods){
									item.num += item2.num
								}
								this.filterList.push(item)
							}
						}else{
							this.filterList = this.orderList.filter(val => val.status == nval)
							let cpList = this.filterList.slice(0)
							this.filterList = []
							for(let item of cpList){
								item.num = 0
								for(let item2 of item.goods){
									item.num += item2.num
								}
								this.filterList.push(item)
							}
						}
      }
    },
    computed:{
      getStatus:function(){
        return function(status){
          if(status == 0){
            return '已取消'
          }else if(status == 1){
            return '待付款'
          }else if(status == 2){
            return '已付款'
          }
        }
      }
    },
    watch:{
      activeName(nval,oval){
        this.getList(nval)
      }
    },
    mouted(){
      
      
    }
}
</script>

<style scoped >
    *{
				margin: 0;
				padding: 0;
				list-style: none;
			}
      .page{
        position: relative;
        background-color: #fff;
        z-index: 9;
      }
      .oid{
        float: left;
        font-size: 12px;
        margin-top: 5px;
        font-weight: 900;
      }
			.labelList>li{
				padding: 10px 0 10px 0;
				text-align: center;
				border-radius: 20px;
				width: 24%;
				display: inline-block;
			}
			.select{
				background-color: red;
			}
			.labelList{
				padding: 0!important;
				margin: 0!important;
				background-color:#efeff4;
				position: fixed;
				top: 44px;
				z-index: 9;
				width: 100%;
				height: 30px;
				
			}
			.showList{
				margin-top: 90px;
			}
			.li_normal{
				list-style: none;
				width: 100%;
				height: 150px;
				position: relative;
			}
			.time{
				position: absolute;
				bottom: 5px;
				left: 10px;
				font-size: 12px;
				color: darkgray;
			}
			.price{
				position: absolute;
				bottom: 5px;
				font-size: 14px;
				color: red;
				right: 20px;
			}
			.img{
				width: 65px;
				height: 65px;
			}
			.imgList{
				width: 235px;
				height: 70px;
				overflow: hidden;
				position: absolute;
				bottom: 30px;
			}
			.imgList>li{
				margin-left: 10px;
				width: 65px;
				height: 65px;
				display: inline-block;
        float: left;
			}
			.totalNum{
				position: absolute;
				left:260px;
				top: 50%;
				color: darkgray;
			}
			.status{
				position: absolute;
				right:20px;
				top: 30%;
				color: red;
			}
			.noOrder{
				margin:50% auto;
				width: 200px;
				height: 200px;
				background-image: url(../img/noOrder.png);
				background-size: 100% 100%;
			
			}
			.noOrder>p{
				text-align: center;
				position: relative;
				top: 170px;
			}
</style>

<template>
  <div class="page">
    <!-- 标题栏 -->
      <van-sticky>
        <van-nav-bar
          title="订单信息"
          left-text="返回"
          left-arrow
          @click-left="back()"
        />
      </van-sticky>
    <!-- 内容 -->
      <div class="content">
					<span class="gray oid">订单号：{{order.orderId}}</span>
					<div class="status"><span class="mui-icon mui-icon-info"></span>{{showText}}</div>
					<div class="totalPrice">总价：{{order.totalPrice}}</div>
					<div class="person">
						收件信息：
						<p>姓名：{{order.addr.name}} &nbsp;&nbsp;联系方式：{{order.addr.phone}}</p>
						<p>详细地址：{{order.addr.address}}</p>
					</div>
          <van-divider  :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }" >商品列表</van-divider>
					<ul class="showList">
						<li class="li_normal" v-for="item in order.goods" @click="toDetail(item.gid)">
							<img :src=item.imgUrl >
							<div class="title">{{item.title}}</div>
							<span class="price">￥{{item.price}}</span>
							<span class="num">数量：{{item.num}}</span>
						</li>
					</ul>
					<span class="gray time">下单时间：{{order.submitTime}}</span><br>
					<span class="gray time" v-cloak v-if="order.PayTime">付款时间：{{order.PayTime}}</span><br >
					<span class="gray time" v-cloak v-if="order.CancleTime">取消订单时间：{{order.CancleTime}}</span>
					<button @click="toPay" class="pay" v-show="order.status==1">去付款</button><button @click="toCancle" class="cancle" v-show="order.status!=0">取消订单</button>
				</div>
  </div>
</template>

<script type="text/ecmascript-6">
import { request } from '../network/request'
export default {
    data() {
      return {
        oid:'',
        goods:[],
        order:[]
      }
    },
    deactivated() {
      this.$destroy()
    },
    created() {
      // let temp_oid = this.$route.query.oid
      // console.log(temp_oid);
      this.oid = this.$route.query.oid||sessionStorage.getItem('cancleID')
      
      if(this.oid!=''){
        this.getOrderMsg()
      }
    },
    computed:{
      showText(){
        if(this.order.status==1){
          return "待付款"
        }else if(this.order.status==2){
          return "已付款"
        }else if(this.order.status==0){
          return "已取消"
        }
      }
    },
    methods: {
        //返回
        back(){
          this.$router.back()
        },
        // 去商品详情
        toDetail(id){
          this.$router.push({
            path:'/detail',
            query:{
              gid:id
            }
          })
        },
        toPay(){
           this.$router.push({
            path:'/pay',
            query:{
              oid:this.oid
            }
          })
        },
        toCancle(){
          this.$dialog.confirm({
            title: '警告',
            message: '是否取消该订单',
          })
            .then(() => {
              this.$toast('订单已取消')
              //取消订单
              request('/cancleOrder?oid='+this.oid)
                .then(res => {
                  if(res.data.flag==1){
                      //修改库存
                      request({
                        method:'post',
                        url:'/stockChange',
                        data:{
                            goods:this.goods,
                            flag:1
                        }
                      }).then(res2 => {
                        if(res2.data.flag==1){
                            this.$toast('订单已取消')
                            sessionStorage.setItem('cancleID','')
                            sessionStorage.setItem('cancleID',this.oid)
                            this.$router.push('/empty')
                            this.$router.go(-1)
                        }
                      })
                  }
                })
            })
            .catch(() => {
              // on cancel
            });
          
        },
        //获取订单信息
        getOrderMsg(){
            this.goods = []
            request('/getOrderByOid?oid='+this.oid)
              .then((res)=>{
                let data = res.data
                for(let item of data.goods){
                  request('/detail?id='+item.gid)
                    .then((res)=>{
                      item.price = res.data.price
                      item.title = res.data.title
                      item.imgUrl = this.$store.state.url+'/images?id='+item.gid
                      this.goods.push(item)
                    })
                }
                this.order = data
                this.order.goods = this.goods
              })
        }
    },
    mounted() {
      
    },
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
        height: 100vh;
      }
      .person{
        text-align: left;
      }
			.status{
				width: 100%;
				height: 50px;
				text-align: center;
				line-height: 50px;
				font-size: 30px;
				color: red;
			}
			.li_normal{
				list-style: none;
				width: 100%;
				height: 100px;
				position: relative;
			}
			.title{
        text-align: left;
        font-size: 12px;
        width: 50%;
        position: absolute;
        margin-top: 10px;
        left: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: normal ！important;
        display: -webkit-box;
        -webkit-line-clamp: 2;     /* 显示2行，为auto时不隐藏 */
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
				right: 20px;
				top: 80px;
				font-size: 12px;
				color: darkgray;
				vertical-align: middle;
			}
			.showList{
				margin-bottom: 10px;
				height: 250px;
				overflow: scroll;	
			}
			.gray{
				color: darkgray;
			}
			.pay{
				position: fixed;
				width: 150px;
				background-color: red;
				color: white;
				bottom: 20px;
				right: 120px;
				border-radius: 20px;
			}
			.cancle{
				position: fixed;
				width: 100px;
				color:red;
				bottom: 20px;
				right: 10px;
				font-weight: 900;
				border-radius: 20px;
			}
			.person p{
				color: #000000;
				font-size: 15px
			}
			.totalPrice{
				display: block;
				margin: 0 auto;
				width: 300px;
				text-align: center;
				color: red;
			}
      .oid{
          text-align: left;
          font-size: 12px;
      }
      .time{
        float: left;
        font-size: 12px;
      }
</style>

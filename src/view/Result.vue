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
				<span>收货地址：</span>
				<div v-if="addrList.length!=0">
					<select v-model="selectAddr" class="selectAddr">
						<option v-for="item in addrList" :value="item.aid">姓名：{{item.name}},联系方式：{{item.phone}} ,详细地址：{{item.addr}}</option>
					</select>
				</div>
				<div v-else>你还没有创建地址信息<button class="toAddAddress" @click="toAddAddress">去创建地址信息</button></div>
				<ul class="showList">
					<li class="li_normal mui-table-view-cell mui-media" v-for="(item,i) in list">
						<p class="gid">商品编号：{{item.gid}}</p>
						<img :src=item.imgUrl>
						<div class="title">{{item.title}}</div>
						<span class="price">￥{{item.price}}</span>
						<span class="num">
							<span @click="numDec(i)">-</span>
							<input class="numshow" type="number" @change="getTotal()" v-model="item.num">
							<span @click="numAdd(i)">+</span>
						</span>
					</li>
				</ul>
				<div class="button_nav">
					<span class="totalPrice">总价：￥{{totalPrice}}</span>
					<button class="toPost" @click="toPost($event)">提交订单</button>
				</div>
			</div>
      <!-- 遮罩层 -->
      <van-overlay :show="show">
        <div class="wrapper">
          <div class="block">正在提交订单<van-loading style="margin-top:50px;" /></div>
        </div>
      </van-overlay>
  </div>
</template>

<script type="text/ecmascript-6">
import {request} from '../network/request';
export default {
  data() {
    return {
        list:[],
        addrList:[],
        selectAddr:null,
        uid:'',
        totalPrice:0,
        oid:0,
        show:false
    }
  },
  created() {
      // 获取用户选购的商品
      let goods = JSON.parse(sessionStorage.getItem('goods'))
      this.list = goods||[]
      this.uid = localStorage.getItem('uid')||''
      // 获取用户地址信息
      if(this.uid!=''){
          request('/getAddress?uid='+this.uid)
            .then(res => {
              let data = res.data
              this.addrList = data
            })
        }      
  },
  deactivated() {
    this.$destroy()
  },
  watch:{
    list(){
      this.getTotal()
    }
  },
  methods: {
    back(){
      this.$router.back()
    },
    // 去添加地址信息
    toAddAddress(){
      this.$router.push('/addresslist')
    },
    // 减少数目
    numDec(i){
      this.list[i].num--
      this.getTotal()
    },
    // 增加数目
    numAdd(i){
      this.list[i].num++
      this.getTotal()
    },
    // 改变总价
    getTotal(){
      let result = 0
      for(let item of this.list){
        result += parseInt(item.num)*item.price
      }
      this.totalPrice = parseFloat(result.toFixed(3))
    },
    // 提交订单
    toPost(event){
      let orderId = 123
      if(this.selectAddr==null){
        this.$toast('请先选择地址再提交')
      }else{
        this.show = true
      let addrMsg = {
        name:'',
        phone:'',
        address:''
      }
      let goodsMsg = []
      // 获取用户选择的地址
      for(let item of this.addrList){
        if(item.aid==this.selectAddr){
          addrMsg.name = item.name
          addrMsg.phone = item.phone
          addrMsg.address = item.addr
        }
      }
      // 获取结算的商品列表
      let _this = this
      for(let item of this.list){
        let good={}
        good.gid = item.gid
        good.num = item.num
        goodsMsg.push(good)
      }
      function getOId(){
        // 生成订单id
        let oid = Date.now().toString(10).slice(5)+parseInt(Math.random()*100000)
        return oid
      }
      this.oid = getOId()
      // 查询用户需要的商品是否足够库存
      request({
        method:'post',
        url:'/getStock',
        data:{
          goods:goodsMsg
        }
      })
      .then(res=>{
          let unEnough = []
          let data = res.data
          for(let i=0; i<data.list.length;i++){
            if(data.list[i]<goodsMsg[i].num){
              unEnough.push(goodsMsg[i].gid)
            }
          }
          if(unEnough.length!=0){
            this.show = false
            this.$dialog.alert({message:"商品"+unEnough[0]+"库存不足!请重新选择商品"})
          }else{
            // 购买商品以后修改商品库存
            request({
              method:'post',
              url:'/stockChange',
              data:{
                goods:goodsMsg,
                flag:-1
              }
            })
            .then(res=>{
                if(res.data.flag==1){
                  // 记录订单信息
                  request({
                    method:'post',
                    url:'/recordOrders',
                    data:{
                      uid:_this.uid,
                      addr:addrMsg,
                      goods:goodsMsg,
                      orderId:_this.oid,
                      totalPrice:_this.totalPrice
                    }
                  })
                  .then((res)=>{
                  let data = res.data
                  if(data.code==1){
                    this.show = false
                    this.$toast('提交订单成功，请尽快付款')
                    this.$router.push({
                      path:'/pay',
                      query:{
                        oid:_this.oid
                      }
                    })     
                  }
                  })
                }
            })
            
          }
        })
      }
      
  
    },
    mounted() {
      // 获取用户的地址列表
      console.log('mounted');
        if(this.uid!=''){
          request('/getAddress?uid='+this.uid)
            .then(res => {
              let data = res.data
              this.addrList = data
            })
            console.log(this.addrList);
        }      
    },
  },
}
</script>

<style scoped >
  .page{
    position: relative;
    background: #fff;
    z-index: 9;
  }
  .selectAddr{
    width: 100vw !important;
    margin-bottom: 20px;
  }
  .selectAddr option{
    width: 100vw !important
  }
  .li_normal{
      list-style: none;
      width: 100%;
      height: 150px;
      position: relative;
  }
  .title{
    text-align: left;
    font-size: 12px;
    width: 50%;
    position: absolute;
    margin-top: 10px;
    left: 140px;
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
    margin-top: -50px;
  }
  .gid{
    margin: 0px;
    position: absolute;
    top: 2px;
    left: 20px;
    font-size: 12px
  }
  .price{
    position: absolute;
    left: 140px;
    top: 110px;
    color: red;
  }
  .num{
    position: absolute;
    right: 30px;
    top: 50%;
    vertical-align: middle;
  }
  .num span{
    display: inline-block;
    vertical-align: middle;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    text-align: center;
    line-height: 20px;
    border: darkgray 1px solid;
  }
  .numshow{
    width:30px!important;
    font-size: 12px !important;
    height: 20px!important; 
    text-align: center;
  }
  .totalPrice{
    position: fixed;
    font-size: 18px;
    font-weight: 900;
    bottom: 10px;
    left: 10px;
  }
  .toPost{
    position: absolute;
    width: 100px;
    height: 30px;
    background-color: red;
    border-radius: 20px;
    color: white;
    right: 10px;
    top: 50%;
    margin-top: -15px;
  }
  .showList{
    margin-bottom: 50px;
  }
  .button_nav{
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 50px;
    background-color: #efeff4;
    border-top: 2px solid #000000;
  }
  .toAddAddress{
    width: 180px;
    background-color: red;
    color: white;
    vertical-align: middle;
    border-radius: 20px;
  }
  .gid{
    position: absolute;
    top: 0;
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

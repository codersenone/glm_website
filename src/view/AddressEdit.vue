<template>
  <div class="page">
    <!-- 标题栏 -->
      <van-sticky>
        <van-nav-bar
          title="地址编辑"
          left-text="返回"
          left-arrow
          @click-left="back()"
        />
      </van-sticky>
    <!-- 内容 -->
    <div class="content">
				<p><span>收件人：</span><input type="text" v-model="address.name" placeholder="请输入收件人名字"></p>
				<p><span>联系号码：</span><input oninput="value=value.replace(/[^\d]/g,'')" type="tel" v-model="address.phone" placeholder="请输入联系号码"></p>
				<p><span>详细地址：</span>
					<textarea rows="3"  v-model="address.addr" placeholder="请输入详细收件地址"></textarea>
				</p>
				<p><button @click="doSave()">保存地址信息</button></p>
				
			</div>	
  </div>
</template>

<script type="text/ecmascript-6">
import { request } from '../network/request'
export default {
  data() {
    return {
      uid:'',
      flag:0,
      address:{
        aid:0,
        name:'',
        phone:'',
        addr:'',
      }
    }
  },
  deactivated() {
    this.$destroy()
  },
  created() {
    this.uid = localStorage.getItem('uid')||''
    this.flag = parseInt(this.$route.query.flag)
    if(this.$route.query.flag == 0){
      this.address = this.$route.query.item
    }
  },
  methods: {
    doSave(){
      if(this.address.name!=''&&this.address.phone!=''&&this.address.addr!=''){
            request({
              method:'post',
              url:'/updateAddress',
              data:{
                uid:this.uid,
                flag:this.flag,
                address:this.address
              }
            })
            this.$toast('保存成功')
            setTimeout(() => {
              this.$router.back()
            },500)
          }else{
            this.$toast("请先填写完成全部信息再保存！！")
          }
      },
      back(){
        this.$router.back()
      }
    },
}
</script>

<style scoped >
    *{
      text-align: left;
      font-size: 13px;
      font-weight: 900;
    }
    .page{
      position: relative;
      background-color: #fff;
      z-index: 9;
      height: calc(100vh);
    }
    .content{
      margin-top: 100px;
    }
    .content>p{
      margin-top: 50px;
      font-size: 18px;
    }
    input{
      width: 200px!important;
      position: absolute;
      left: 30%;
    }
    textarea{
      width: 60%;
      position: absolute;
      left: 30%;
      vertical-align: middle!important;
    }
    button{
      background-color: red;
      display: block;
      width: 40%;
      color: white;
      font-size: 18px;
      margin: 120px auto;
    }
</style>

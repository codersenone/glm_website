<template>
  <div class="page">
    <!-- 导航栏 -->
    <van-nav-bar
      title="欢迎注册"
      left-text="返回"
      left-arrow
      @click-left="back()"
      />
    <!-- 表单 -->
    <van-form @submit="onSubmit">
      <van-field
        v-model="username"
        name="用户名"
        label="用户名"
        placeholder="用户名"
        :rules="[{ required: true, message: '请填写用户名' }]"
      />
      <van-field
        v-model="password"
        type="password"
        name="密码"
        label="密码"
        placeholder="密码最短6位字符"
        :rules="[{ required: true, message: '请填写密码' }]"
        
      />
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit" :disabled="!subAble">提交</van-button>
      </div>
    </van-form>
  </div>
</template>

<script type="text/ecmascript-6">
import { request } from '../network/request'
export default {
  data() {
    return {
      username: '',
      password: '',
      subAble:false
    }
  },
  deactivated() {
    this.$destroy()
  },
  watch:{
    password(nval){
      if(nval.length>=6){
        this.subAble = true
      }else{
        this.subAble = false
      }
    }
  },
  methods: {
      back(){
        this.$router.back()
      },
      onSubmit() {
        request(`/resign?uid=${this.username}&&psw=${this.password}`)
							.then((res)=>{
								let data = res.data
								let success = data.success
								if(success==1){
									this.$dialog({message:'恭喜注册成功，请返回页面进行登录操作'})
								}else if(success==0){
									this.password = ''
                  this.$dialog({message:'抱歉该号码已被注册，你可以进行登录操作'})
								}
							})
							.catch((err)=>{
								
							})
      },
  },
}
</script>

<style scoped >
    .page{
        background-color: #fff;
        z-index: 9;
        position: relative;
        height: 100vh;
    }
</style>

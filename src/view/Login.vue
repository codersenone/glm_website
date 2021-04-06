<template>
  <div class="page">
      <van-nav-bar
        title="欢迎登录"
        left-text="返回"
        left-arrow
        @click-left="back()"
        />
        <div class="content" id="app">
			<div class="icon"></div>
			<div class="input-line">
				<span class="mui-icon-extra mui-icon-extra-phone"></span>
				<input type="number" oninput="value=value.replace(/[^\d]/g,'')" class="mui-input-clear" v-model="id"
				 placeholder="请输入您的账号">
			</div>
			<div class="input-line">
				<span class="mui-icon mui-icon-locked"></span>
				<input type="password" class="mui-input-password" v-model="password" placeholder="请输入您的密码">
			</div>
			<div class="mgb-025 pdlr-01 mui-clearfix">
				<div class="mui-pull-left">
					<label class="login-form__label">
						<input id="remember" :checked="isRemember" v-model="isRemember" type="checkbox">
						<span class="label__text">
							记住密码
						</span>
					</label>
				</div>
				<div class="mui-pull-right">
					<div class="mui-text-center">
				还没有商城账号？<span class="resign" @click="toResign">立即注册</span>
			</div>
				</div>
			</div>
			<button type="submit" :disabled="!id || !password" class="submit"
			 data-loading-text="提交中" data-loading-icon-position="right" @click="doLogin()">登录</button>
		</div>
  </div>
</template>

<script type="text/ecmascript-6">
import {request} from '../network/request';
export default {
    data(){
        return{
            id:'3001',
            password:'123456',
            isRemember:false,
            login_flag:false
        }
    },
    watch:{
        id:function(Oval,Nval){
            
        }
    },
    methods:{
        // 登录操作
        doLogin(){
            let _this = this
            request(`/login?uid=${_this.id}&&psw=${_this.password}`)
                .then(res => {
                    let data = res.data
                    let code = data.code
                    if(code==1){
                        // this.$store.commit('setUID',_this.id)
                        // this.$store.commit('setLogin_flag',true)
                        localStorage.setItem('uid',this.id)
                        setTimeout(()=>{
                            this.$router.back()
                        },500)
                        this.$toast("登录成功！")
                    }else if(code==-1){
                        this.$toast("密码错误！请重新输入密码")
                        _this.password = ''
                    }else if(code==0){
                        this.$toast("不存在该账号，请输入正确账号")
                    }
                })
                .catch( err => {

                })
           
        },
        // 返回上一级
        back(){
            this.$router.back()
        },
        //注册页面
        toResign(){
            this.$router.push('/resign')
        }
    },
    mounted() {
        
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
    .icon{
        width: 150px;
        height: 150px;
        margin: 0 auto;
        background-image: url(../img/icon.png);
        background-size: 100% 100%;	
    }
    .input-line{
        width: 80%; 
        height:50px;
        background-color: #ededed;
        border-radius: 10px;
        line-height: 50px;
        margin: 30px auto;
    }
    .input-line>span{
        display: inline-block;
        font-size: 24px;
    }.input-line>input{
        width: 80%;
            background-color: #ededed;
            border: none;
    }
    .submit{
        background-color: red;
        display: block;
        width: 50%;
        border-radius: 10px;
        margin: 30px auto;
        color: white
    }
    .resign{
        color: skyblue;
        cursor: pointer;
    }
    
</style>

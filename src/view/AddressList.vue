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
				<ul>
					<li class="contentList" v-for="(item,i) in addList">
						<p><span>姓名：</span>{{item.name}}</p>
						<p><span>联系方式：</span>{{item.phone}}</p>
						<p><span>详细地址：</span>{{item.addr}}</p>
						<button class="delBtn" type="button" @click="del(item)">删除</button>
						<button class="editBtn" type="button" @click="edit(item)">编辑</button>
					</li>
				</ul>
				<button class="addBtn" @click="add">添加新地址</button>
			</div>
  </div>
</template>

<script type="text/ecmascript-6">
import { request } from '../network/request';
export default {
  data() {
    return {
      uid:'',
			addList:[],
    }
  },
  methods: {
        back(){
          this.$router.back()
        },
        edit(item){
          this.$router.push({
            path:'/addressedit',
            query:{
              item:item,
              flag:0
            }
          })
        },
        del(item){
          let _this = this	
          this.$dialog.confirm({
              title: '提示',
              message: '是否删除该地址信息',
            })
              .then(() => {
                  request({
                    method:'post',
                    url:'/delAddress',
                    data:{
                      uid:this.uid,
                      aid:item.aid
                    }
                  }).then((res)=>{
                    let data = res.data
                    if(data.flag==1){
                      this.$toast('删除成功')
                      this.$router.push('/empty')
                    }
                  })
              })
              .catch(() => {
                // on cancel
              });
        },
        add(){
          this.$router.push({
            path:'/addressedit',
            query:{
              flag:1
            }
          })
        }
  },
  activated() {
    this.uid = localStorage.getItem('uid')||''
    if(this.uid!=0){
        request('/getAddress?uid='+this.uid)
          .then((res)=>{
            let data = res.data
            this.addList = data
          })
      }
  },
 
}
</script>

<style scoped >
    *{
      padding: 0;
      margin: 0;
    }
    .page{
      position: relative;
      background-color: #fff;
      z-index: 9;
      height: 100vh;
    }
    .content{
      height: calc(100vh - 120px);
      overflow: scroll;
    }
    .contentList{
      list-style: none;
      height: 120px;
      border-bottom: darkgray 1px solid;
      position: relative;
      text-indent: 1em;
    }
    .contentList p{
      margin-top: 10px;
      width: 80%;
      text-align: left;
      font-size: 12px;
      font-weight: 900;
    }
    .delBtn{
      position: absolute;
      right: 10px;
      top: 25%;
      width: 50px;
      height: 30px;
      margin-top: -15px;
      background-color: red;	
    }
    .editBtn{
      position: absolute;
      right: 10px;
      top: 65%;
      width: 50px;
      height: 30px;
      margin-top: -15px;
    }
    .addBtn{
      position: fixed;
      bottom: 20px;
      left: 50%;
      margin-left: -100px;
      width: 200px;
      height: 60px;
      background-color: red;
      border-radius: 50px;
      color: white;
    }
</style>

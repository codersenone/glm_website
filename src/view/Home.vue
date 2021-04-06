<template> 
        <div>
         <!-- 搜索栏 -->
         <van-sticky>
            <van-search
                v-model="search_key"
                show-action
                label="商品"
                placeholder="请输入搜索关键词"
                @search="onSearch"
            >
                <template #action>
                    <div @click="onSearch">搜索</div>
                </template>
            </van-search>
        </van-sticky>
        <!-- 轮播图 -->
        <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
            <van-swipe-item><img :src=imgURL+1 ></van-swipe-item>
            <van-swipe-item><img :src=imgURL+2 ></van-swipe-item>
            <van-swipe-item><img :src=imgURL+3 ></van-swipe-item>
        </van-swipe>
        <!-- 懒加载数据 -->
        <van-list
            class="lazy-load"
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
        >
            <van-cell  v-for="item in list" :key="item.id">
                <template>
                    <div class="lazy-load-item" :id="item.id" @click="toDetail(item.id)">
							<img class="mui-pull-left pro_icon" :src='item.imgURL'>
							<span class="title"><p>{{item.title}}</p></span>
							<div class="labs"><span>{{item.label[0]}}</span><span>{{item.label[1]}}</span></div>
							<span class='price'>￥{{item.price}}</span>				
					</div>
                </template>
            </van-cell>
        </van-list>
        <!-- 自己封装的返回顶部的组件 传入的参数scroll 用于滑动屏幕多高显示出组件 -->
        <back-top scroll=300 ></back-top>
        </div>
</template>

<script type="text/ecmascript-6">
    import {request} from '../network/request';
    import BackTop from '../components/backTop.vue';
    export default {
        data() {
            return {
                search_key:'',
                list: [],
                loading: false,
                finished: false,
                page:1,
                imgURL: this.$store.state.url+"/swipeImages?id=",
                scroll:null  
            }
        },
        components: {
            BackTop
                
        },
        methods: {
            // 搜索功能
            onSearch(){
                if(this.search_key!=''){
                    this.$router.push({
                        path:'/search',
                        query:{
                            key:this.search_key
                        }
                    })
                }else{
                    this.$toast('请先输入搜索词')
                }
            },
            // 加载商品
            onLoad() {
               request('/goods?page='+this.page++)
                .then(res => {
                    for(let item of res.data){
                        item.imgURL = this.$store.state.url+'/images?id='+item.id
                        this.list.push(item)
                    }
                    this.loading = false;
                    if(res.data.length==0){
                        this.finished = true;
                    }
                })
                .catch(err => {
                    this.$dialog({message:'网络错误,请先连接互联网！'})
                })
                
            },
            // 跳转到商品详情页面
            toDetail(gid){
                console.log(gid);
                this.$router.push({
                    path:'/detail',
                    query:{gid:gid}
                })
            },
            jupm(y){
                this.$nextTick(()=>{
                    window.scrollTo(0,y)
                })
            }
            
        },
        activated() {
            let scroll = sessionStorage.getItem('homeScroll')||0
            this.jupm(parseFloat(scroll))
        },
        deactivated() {
            sessionStorage.setItem('homeScroll',this.scroll)
        },
        mounted() {
            document.addEventListener('scroll',() => {
                let scroll = window.pageYOffset||document.documentElement.scrollTop
                if(scroll!=0){
                    this.scroll = scroll
                }

            })
        },
       
        
    }
</script>

<style scoped >
    .page{
         margin-top:0px;
    }
    .my-swipe .van-swipe-item {
        color: #fff;
        text-align: center;
    }
    .lazy-load-item{
        height: 90px;
    }
    .van-swipe-item img{
        width: 100%;
        height: 100%;
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

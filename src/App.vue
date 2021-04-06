<template>
  <div id="app">
    <keep-alive><router-view class="show" exclude='orderdetail' ></router-view></keep-alive>
      <van-tabbar route v-model="active">
        <van-tabbar-item name="home" to="/home" icon="home-o">首页</van-tabbar-item>
        <van-tabbar-item name="category" to="/category" icon="search">分类</van-tabbar-item>
        <van-tabbar-item name="car" to="/car" icon="cart-o">购物车</van-tabbar-item>
        <van-tabbar-item name="mine" to="/mine" icon="setting-o">我的</van-tabbar-item>
      </van-tabbar>
  </div>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {
      active:"home"
    }
  },
  methods: {
    
  },
}
</script>

<style>
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 0;
  }
  .show{
    margin-bottom: 50px;
  } 
</style>

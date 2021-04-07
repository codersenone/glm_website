<template>
  <div class="page">
    <!-- 导航栏 -->
    <van-sticky>
      <van-nav-bar
        title="详情页面"
        left-text="返回"
        left-arrow
        @click-left="back()"
        sticky
      />
    </van-sticky>
    <!-- 轮播图 -->
    <van-skeleton title :row="20" v-if="show" />
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item><img :src="good.imgUrl" /></van-swipe-item>
    </van-swipe>
    <van-divider />
    <div class="msg">
      <p class="price">￥{{ good.price }}</p>
      <p class="title">{{ good.title }}</p>
      <p>商品id:{{ gid }}</p>
      <p>库存数目：{{ good.stock }}</p>
      <p>
        购买数目：<button @click="reduce()">-</button
        ><input
          v-model="count"
          style="width: 50px"
          onkeyup="value=value.replace(/[^\d]/g,'')"
        /><button @click="add()">+</button>
      </p>
    </div>
    <van-goods-action class="detailBottom">
      <van-goods-action-icon
        @click="toCar"
        icon="cart-o"
        text="购物车"
        :badge="cartNum"
      />
      <van-goods-action-button
        @click="addCar"
        type="warning"
        text="加入购物车"
      />
      <van-goods-action-button @click="toBuy" type="danger" text="立即购买" />
    </van-goods-action>

    <!-- 遮罩层 -->
    <van-overlay :show="show">
      <div class="wrapper">
        <div class="block">
          正在加载数据<van-loading style="margin-top: 50px" />
        </div>
      </div>
    </van-overlay>
  </div>
</template>

<script type="text/ecmascript-6">
import { request } from "../network/request";
export default {
  data() {
    return {
      gid: "",
      good: {
        id: 1,
        title: 0,
        label: 0,
        category: 0,
        price: 0,
        stock: 0,
      },
      uid: "",
      cartNum: 0,
      count: 1,
      show: true,
    };
  },
  methods: {
    // 返回上一级
    back() {
      this.$router.back();
      this.good = {};
    },
    // 获取商品数据
    getData() {
      request("/detail?id=" + this.gid)
        .then((res) => {
          let data = res.data;
          this.good = data;
          this.good.imgUrl = this.$store.state.url + "/images?id=" + this.gid;
          this.show = false;
        })
        .catch((err) => {
          this.$dialog({ message: "网络错误,请先连接互联网！" });
        });
    },
    // 获取用户的购物车信息
    getCar() {
      request(`/getCar?uid=${this.uid}`).then((res) => {
        let data = res.data;
        for (let item of data) {
          this.cartNum += item.num;
        }
      });
    },
    // 添加数目
    add() {
      if (this.count < this.good.stock) this.count++;
    },
    // 减少数目
    reduce() {
      if (this.count > 1) this.count--;
    },
    // 加入购物车
    addCar() {
      if (this.uid != "") {
        request({
          url: "/addCar",
          method: "post",
          data: {
            uid: this.uid,
            gid: this.gid,
            num: this.count,
          },
        }).then((res) => {
          if (res.data.success) this.$toast("加入购物车成功");
        });
        this.updateNum();
      } else {
        this.$toast("您还没登录呢，请先登录再添加购物车");
        setTimeout(() => {
          this.$router.push("/login");
        }, 500);
      }
    },
    // 去结算页面
    toBuy() {
      if (this.uid != 0) {
        let goods = {
          gid: this.gid,
          num: this.count,
          imgUrl: `${this.$store.state.url}/images?id=${this.gid}`,
          title: this.good.title,
          price: this.good.price,
        };
        // 暂存购物信息
        sessionStorage.setItem("goods", "");
        sessionStorage.setItem("goods", JSON.stringify([goods]));
        // this.$router.push({
        //   path:'/result',
        //   query:{
        //     list:[goods]
        //   }
        // })
        this.$router.push("/result");
      } else {
        this.$toast("您还没登录呢，请先登录再添加购物车");
        setTimeout(() => {
          this.$router.push("/login");
        }, 500);
      }
    },
    // 更新购物车图标数目
    updateNum() {
      if (this.uid != "") {
        this.cartNum = this.cartNum + this.count;
      }
    },
    // 去购物车页面
    toCar() {
      this.$router.push("/car");
    },
  },
  watch: {
    count(newVal, oVal) {
      if (newVal < 1) this.count = 1;
    },
  },
  created() {
    this.goods = null;
    this.uid = localStorage.getItem("uid") || "";
    this.gid = this.$route.query.gid;
  },
  deactivated() {
    //
    this.$destroy();
  },
  mounted() {
    // 初始化商品信息
    this.getData();
    //  获取当前用户的购物车商品数目
    if (this.uid != "") {
      this.getCar();
    }
  },
};
</script>

<style scoped >
.page {
  position: relative;
  z-index: 9;
  background-color: #fff;
}
van-nav-bar {
  z-index: 10;
}
.my-swipe img {
  width: 100%;
}
.price {
  color: red;
  font-size: 20px;
}
.title {
  color: #000000;
  font-weight: 900;
}
.msg {
  width: 100%;
  text-align: left;
  text-indent: 1em;
  margin-bottom: 50px;
}
button,
input {
  width: 40px;
  height: 30px;
  text-align: center;
  border-radius: 10px;
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

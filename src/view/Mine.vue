<template>
  <div class="page">
    <van-nav-bar
      title="我的"
      :right-text="showText"
      @click-right="changeStatus()"
    ></van-nav-bar>
    <div class="content">
      <div class="person">
        <div class="icon"></div>
        <p v-if="uid != ''">用户id:{{ uid }}</p>
        <p v-else style="color: red" @click="changeStatus()">登录/注册</p>
      </div>
      <van-divider
        :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }"
        >订单信息</van-divider
      >
      <van-grid :column-num="4" class="orders">
        <van-grid-item
          icon="balance-pay"
          text="待付款"
          :badge="status1Item"
          flag="1"
        />
        <van-grid-item
          icon="completed"
          text="已付款"
          :badge="status2Item"
          flag="2"
        />
        <van-grid-item
          icon="failure"
          text="已取消"
          :badge="status0Item"
          flag="0"
        />
        <van-grid-item
          icon="description"
          text="全部订单"
          :badge="uid != '' ? orderList.length : 0"
          flag="3"
        />
      </van-grid>
      <van-divider
        :style="{ color: '#1989fa', borderColor: '#1989fa', padding: '0 16px' }"
        >个人信息</van-divider
      >
      <van-grid class="setting">
        <van-grid-item @click="changPsw()" icon="setting-o" text="修改密码" />
        <van-grid-item @click="editAddr()" icon="location-o" text="地址管理" />
      </van-grid>
      <van-popup
        v-model="show"
        closeable
        close-icon="close"
        position="bottom"
        :style="{ height: '50%' }"
      >
        <van-divider
          :style="{
            color: '#1989fa',
            borderColor: '#1989fa',
            padding: '0 16px',
          }"
          >修改密码</van-divider
        >
        <p style="float: left; text-indent: 1em">用户id：{{ uid }}</p>
        <van-field
          v-model="newPsw"
          type="password"
          placeholder="请输入新密码(最短6位)"
          label="密码"
        />
        <van-button
          type="danger"
          :disabled="newPsw.length < 6"
          @click="toUpDatePsw()"
          >确认修改</van-button
        >
      </van-popup>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { request } from "../network/request";
export default {
  data() {
    return {
      uid: "",
      show: false,
      newPsw: "",
      orderList: [],
    };
  },
  activated() {
    this.uid = localStorage.getItem("uid") || "";
    if (this.uid != "") {
      this.getOrder();
    }
  },
  computed: {
    //按钮显示文字
    showText() {
      if (this.uid != "") {
        return "退出";
      } else {
        return "登录";
      }
    },
    // 已经提交未付款订单
    status1Item() {
      let length = 0;
      for (let item of this.orderList) {
        if (item.status == 1) {
          length += 1;
        }
      }
      if (this.uid == "") {
        return 0;
      } else {
        return length;
      }
    },
    // 已经付款的订单
    status2Item() {
      let length = 0;
      for (let item of this.orderList) {
        if (item.status == 2) {
          length += 1;
        }
      }
      if (this.uid == "") {
        return 0;
      } else {
        return length;
      }
    },
    // 已经取消的订单
    status0Item() {
      let length = 0;
      for (let item of this.orderList) {
        if (item.status == 0) {
          length += 1;
        }
      }
      if (this.uid == "") {
        return 0;
      } else {
        return length;
      }
    },
  },
  methods: {
    // 修改登录状态
    changeStatus() {
      if (this.uid != "") {
        // 当前处于登录状态，点击后退出登录
        this.$dialog
          .confirm({
            title: "警告",
            message: "是否退出登录",
          })
          .then(() => {
            // this.$store.commit('setUID','')
            localStorage.setItem("uid", "");
            this.$router.push("/empty");
          })
          .catch(() => {});
      } else {
        // 当前处于未登录状态，点击后跳转登录页面
        this.$router.push("/login");
      }
    },
    //获取订单
    getOrder() {
      request("/getOrders?uid=" + this.uid).then((res) => {
        this.orderList = res.data;
      });
    },
    // 去订单列表
    toOrder(status) {
      this.$router.push({
        path: "/orderlist",
        query: {
          status: status,
        },
      });
    },
    // 修改密码
    changPsw() {
      if (this.uid != "") {
        // 登录后才可进入修改模块
        this.show = true;
      } else {
        // 未登录
        this.$dialog({ message: "请先登录" });
      }
    },
    //确认修改密码
    toUpDatePsw() {
      this.$dialog
        .confirm({
          title: "警告",
          message: "是否确认修改密码",
        })
        .then(() => {
          this.$dialog({ message: "修改密码成功!" });
          this.show = false;
          this.newPsw = "";
        })
        .catch(() => {
          this.$toast({ message: "取消修改", position: "bottom" });
          this.show = false;
          this.newPsw = "";
        });
    },
    //编辑地址
    editAddr() {
      if (this.uid != "") {
        // 登录后才可进入修改模块
        this.$router.push("/addresslist");
      } else {
        // 未登录
        this.$dialog({ message: "请先登录" });
      }
    },
  },
  mounted() {
    let orderItems = document.querySelector(".orders").childNodes;
    let settingItems = document.querySelector(".setting").childNodes;
    let _this = this;
    for (let item of orderItems) {
      item.addEventListener("click", function ($event) {
        if (_this.uid != "") {
          //获取点击的flag，跳转到订单列表
          _this.toOrder($event.currentTarget.getAttribute("flag"));
        } else {
          _this.$dialog({ message: "请先登录" });
        }
      });
    }
  },
};
</script>

<style scoped>
.person {
  height: 150px;
  width: 100%;
}
.icon {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: skyblue;
  margin: 0 auto;
}
.person p {
  text-align: center;
}
</style>

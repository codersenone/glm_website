<template>
  <div>
    <van-sticky><van-nav-bar title="购物车" /></van-sticky>
    <div id="content">
      <div v-show="uid != ''">
        <div v-if="cartNum == 0" class="empty_car">
          <p>购物车空空如也，商品还在等您选购呢</p>
        </div>
        <div v-else>
          <ul class="showList" style="padding: 0">
            <li class="li_normal" v-for="(item, i) in show_content">
              <span class="gid">商品编号：{{ item.gid }}</span>
              <input
                @change="
                  {
                    $set(content[i], 'select', item.select);
                    clickFlag = !clickFlag;
                  }
                "
                class="checkbox"
                v-model="item.select"
                type="checkbox"
              />
              <img :src="item.imgUrl" @click="toDetail(item.gid)" />
              <div class="title" @click="toDetail(item.gid)">
                {{ item.title }}
              </div>
              <span class="price">￥{{ item.price }}</span>
              <span class="num"
                ><span @click="numDec(i)">-</span
                ><input
                  @change="numChange(i)"
                  style="
                    width: 30px;
                    font-size: 10px;
                    height: 20px;
                    text-align: center;
                  "
                  type="number"
                  v-model="item.num"
                /><span @click="numAdd(i)">+</span></span
              >
              <span class="del" @click="doDel(i)">删除</span>
            </li>
          </ul>
        </div>
        <div class="button_nav">
          <div class="nav_span">
            全选<input
              type="checkbox"
              v-model="allFlag"
              class="checkbox nav_check"
            />
          </div>
          <span class="totalPrice">总价：￥{{ totalPrice }}</span>
          <van-button
            @click="toResult"
            :disabled="totalPrice == 0"
            round
            type="info"
            >结算</van-button
          >
        </div>
      </div>
      <div v-show="uid == ''">
        <div class="empty_car">
          <p class="nolog">
            您还没登录&nbsp;&nbsp;<van-button @click="toLogin" round type="info"
              >去登录</van-button
            >
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import { request } from "../network/request";
import axios from "axios";
export default {
  data() {
    return {
      uid: "",
      login_flag: false,
      cartNum: 0,
      content: [],
      show_content: [],
      allFlag: false,
      clickFlag: true,
      clickFlag2: true,
      totalPrice: 0,
    };
  },
  watch: {
    clickFlag() {
      let flag = true;
      for (let i = 0; i < this.show_content.length; i++) {
        if (this.show_content[i].select == false) flag = false;
      }
      this.allFlag = flag;
      this.getTotal();
    },
    clickFlag2(nval, oval) {
      if (this.allFlag == true) {
        for (let i = 0; i < this.show_content.length; i++) {
          this.show_content[i].select = false;
          this.content[i].select = false;
        }
        this.allFlag = false;
      } else if (this.allFlag == false) {
        for (let i = 0; i < this.show_content.length; i++) {
          this.show_content[i].select = true;
          this.content[i].select = true;
        }
        this.allFlag = true;
      }
      this.getTotal();
    },
    show_content() {
      // 数据加载完成以后判断全选的状态
      this.$nextTick(function () {
        this.init();
        this.getTotal();
      });
    },
  },
  activated() {
    this.uid = localStorage.getItem("uid") || "";
    // this.$router.push('/empty')
    this.getUserCar();
  },
  deactivated() {
    // 用户离开购物车时同步用户的购物车信息
    request({
      url: "/updateCar",
      method: "post",
      data: {
        uid: this.uid,
        content: this.content,
      },
    });
  },
  methods: {
    // 去登陆
    toLogin() {
      this.$router.push("/login");
    },
    // 初始化全选状态
    init() {
      let flag = true;
      for (let i = 0; i < this.show_content.length; i++) {
        if (this.show_content[i].select == false) {
          flag = false;
        }
      }
      this.allFlag = flag;
    },
    // 删除商品
    doDel(i) {
      console.log("传入的下标：" + i);
      this.$dialog
        .confirm({
          title: "提示",
          message: "是否删除该商品",
        })
        .then(() => {
          this.$toast("商品移除成功");
          this.show_content.splice(i, 1);
          this.content.splice(i, 1);
        })
        .catch(() => {
          // on cancel
        });
    },
    numChange(i) {
      this.content[i].num = this.show_content[i].num - 0;
      this.getTotal();
    },
    numAdd(i) {
      this.show_content[i].num++;
      this.content[i].num++;
      this.getTotal();
    },
    numDec(i) {
      if (this.show_content[i].num > 1) {
        this.show_content[i].num--;
        this.content[i].num--;
        this.getTotal();
      }
    },
    // 改变总价
    getTotal() {
      let result = 0;
      for (let item of this.show_content) {
        if (item.select == true) {
          result += parseInt(item.num) * item.price;
        }
      }
      this.totalPrice = result;
    },
    // 去结算
    toResult() {
      let resData = [];
      for (let item of this.show_content) {
        if (item.select == true) resData.push(item);
      }
      // 暂存购物信息
      sessionStorage.setItem("goods", "");
      sessionStorage.setItem("goods", JSON.stringify(resData));
      // this.$router.push({
      // 	path:'/result',
      // 	query:{
      // 		list:resData
      // 	}
      // })
      this.$router.push("/result");
    },
    // 去商品详情
    toDetail(id) {
      this.$router.push({
        path: "/detail",
        query: { gid: id },
      });
    },
    //获取用户购物车
    getUserCar() {
      if (this.uid != "") {
        this.content = [];
        this.show_content = [];
        request(`/getCar?uid=${this.uid}`).then((res) => {
          let data = res.data;
          if (data.length != 0) {
            let i = 0;
            for (let _item of data) {
              // 用于同步数据库中用户的购物车信息
              new Promise((resolve) => {
                request(`/detail?id=${_item.gid}`).then((res) => {
                  let data = res.data;
                  resolve(data);
                });
              }).then((res) => {
                _item.title = res.title;
                _item.price = res.price;
                _item.imgUrl = `${this.$store.state.url}/images?id=${_item.gid}`;
                this.show_content.push(_item);
                let tempContent = {
                  gid: _item.gid,
                  num: _item.num,
                  select: _item.select,
                };
                this.content.push(tempContent);
              });
            }
            for (let item of data) {
              this.cartNum += item.num;
            }
          }
        });
      }
    },
  },
  mounted() {
    this.getUserCar();
    // 添加全选按钮监听
    let _this = this;
    document.querySelector(".checkbox").addEventListener("change", function () {
      _this.clickFlag = !_this.clickFlag;
    });
    document.querySelector(".nav_check").addEventListener("click", function () {
      _this.clickFlag2 = !_this.clickFlag2;
    });
  },
};
</script>

<style scoped>
.empty_car {
  width: 300px;
  height: 300px;
  background-image: url(../img/empty.png);
  background-size: 100% 100%;
  margin: 130px auto;
}
.empty_car > p {
  text-align: center;
}
.nolog {
  text-align: center;
  vertical-align: middle;
  line-height: 33px;
}
.nolog > button {
  background-color: red;
  border-radius: 15px;
  vertical-align: middle;
}
.li_normal {
  list-style: none;
  width: 100%;
  height: 150px;
  position: relative;
}
.title {
  font-size: 12px;
  width: 50%;
  position: absolute;
  left: 135px;
  overflow: hidden;
  text-align: left;
  text-overflow: ellipsis;
  white-space: normal ！important;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 显示2行，为auto时不隐藏 */
  -webkit-box-orient: vertical;
}
.checkbox {
  position: absolute;
  left: 5px;
  top: 50%;
  height: 20px;
  width: 20px;
  margin-top: -10px;
  border: 1px solid #c5c7c7;
}
.li_normal > img {
  width: 90px;
  height: 90px;
  position: absolute;
  left: 30px;
  top: 50%;
  margin-top: -50px;
}
.gid {
  position: absolute;
  top: 2px;
  left: 20px;
  font-size: 12px;
}
.price {
  position: absolute;
  left: 135px;
  top: 110px;
  color: red;
}
.num {
  position: absolute;
  right: 10px;
  top: 45%;
  transform: translateY(-40%);
  vertical-align: middle;
}
.num span {
  display: inline-block;
  vertical-align: middle;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  text-align: center;
  line-height: 20px;
  border: darkgray 1px solid;
}
.del {
  font-size: 13px;
  position: absolute;
  right: 20px;
  top: 110px;
  color: red;
}
input[type="checkbox"] {
  -webkit-appearance: none;
  border-radius: 100%;
  background: url(../img/null.png) no-repeat;
  background-size: 100%;
  vertical-align: middle;
}
input[type="checkbox"]:checked {
  -webkit-appearance: none;
  outline-style: none;
  border-radius: 100%;
  background-size: 100%;
  vertical-align: middle;
  background: url(../img/checked.png) no-repeat !important;
  background-size: 100% !important;
}
.button_nav {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 60px;
  background-color: #efeff4;
  border-top: 2px solid #000000;
  margin-bottom: 50px;
}
.button_nav > button {
  width: 80px;
  height: 30px;
  position: absolute;
  background-color: red;
  right: 10px;
  top: 50%;
  margin-top: -15px;
  border-radius: 20px;
  color: white;
}

.box {
  display: block;
  position: absolute;
  left: 10px;
}
.nav_check {
  position: absolute;

  vertical-align: middle;
}
.nav_span {
  display: inline-block;
  position: absolute;
  text-indent: 2rem;
  top: 5px;
  left: 10px;
  font-size: 14px;
}
.totalPrice {
  position: absolute;
  font-size: 18px;
  font-weight: 900;
  bottom: 3px;
  left: 10px;
}
.showList {
  margin-bottom: 110px;
  height: 100vh-110px;
}
</style>

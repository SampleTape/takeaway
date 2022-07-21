<template>
  <div class="order-container">
    <van-nav-bar
      title="结算"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
      :fixed="true"
      :placeholder="true"
    />
    <h3>商品信息：</h3>
    <ul>
      <li class="food-card" v-for="food in foodList" :key="food.id">
        <img :src="food.pic" />
        <span>{{ food.foodname }}</span>
        <span>￥{{ food.price }} x {{ food.num }}</span>
      </li>
    </ul>
    <h3 class="total">总价：￥{{ total }}</h3>
    <h3>配送信息：</h3>
    <div class="address-info">
      <div>收货人：{{ addressInfo.name }}</div>
      <div>收货电话：{{ addressInfo.tel }}</div>
      <div>收货地址：{{ addressInfo.address }}</div>
      <div>收货时间：{{ date }}</div>
    </div>
    <div class="button-container">
      <van-button block round @click="chooseAddress">选择地址</van-button>
    </div>
    <div class="button-container">
      <van-button block type="primary" round @click="handleOrder"
        >下单</van-button
      >
    </div>
  </div>
</template>

<script>
import { getApi, postApi } from "@/util/api.js";
export default {
  name: "OrderView",

  data() {
    return {
      foodList: [],
      date: "",
      order_id: ""
    };
  },

  computed: {
    userId() {
      return this.$store.state.userId;
    },
    total() {
      return this.foodList.reduce((pre, current) => {
        return pre + current.price * current.num;
      }, 0);
    },
    addressInfo() {
      return this.$store.state.addressInfo;
    },
    addressText() {
      return `收货人：${this.addressInfo.name}\n收货电话：${this.addressInfo.tel}\n收货地址：${this.addressInfo.address}`;
    }
  },

  mounted() {
    // 获得今天的日期
    this.date = new Date().toLocaleString();
    // 获得购物车列表
    getApi(`/user/${this.userId}/shoppingcart`).then((res) => {
      console.log(res);

      res.data.forEach((item) => {
        getApi(`/food/${item.food_id}`).then((res) => {
          this.foodList.push({
            id: item.food_id,
            shoppingcartId: item.id,
            foodname: res.data.foodname,
            price: res.data.price,
            pic: res.data.pic,
            info: res.data.info,
            num: item.num
          });
        });
      });
    });
  },

  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    chooseAddress() {
      this.$router.push("/address");
    },
    handleOrder() {
      if (!this.addressInfo.id) {
        this.$dialog
          .alert({
            message: "请先选择地址"
          })
          .then(() => {
            // on close
          });
        return;
      }
      postApi(`/user/${this.userId}/orders`, {
        user_id: this.userId,
        sum: this.total,
        address_text: this.addressText,
        state: 0
      }).then((res) => {
        console.log(res);
        this.order_id = res.data.id;
        let promiseArr = this.foodList.map((item) => {
          return this.postOrder(item);
        });
        Promise.all(promiseArr)
          .then((value) => {
            console.log(value);
            this.$toast.success("下单成功！");
            postApi(`/user/${this.userId}/shoppingcart`, {
              _method: "DELETE"
            }).then((res) => {
              console.log(res);
            });
            this.$router.push("/me");
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
    postOrder(food) {
      return new Promise((resolve, reject) => {
        postApi(`/orders/${this.order_id}/order_item`, {
          user_id: this.userId,
          food_id: food.id,
          num: food.num
        })
          .then((res) => {
            console.log(res);
            resolve(res.data);
          })
          .catch((err) => {
            reject(err);
          });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.order-container {
  .food-card {
    width: 100%;
    display: flex;
    justify-content: space-around;
    align-items: center;
    img {
      width: 4rem;
      height: 4rem;
    }
  }
  .total {
    margin: 0.5rem;
    border-top: 1px solid #aaa;
    text-align: right;
    padding: 1rem;
  }
  .address-info {
    margin: 1rem;
  }
  .button-container {
    margin: 0.5rem 1rem;
  }
}
</style>

<template>
  <div class="order-list">
    <van-nav-bar
      title="订单列表"
      left-text="返回"
      left-arrow
      fixed
      placeholder
      @click-left="onClickLeft"
    />
    <van-empty v-if="orderList.length == 0" description="没有订单" />
    <ul v-else>
      <li
        class="order-card"
        v-for="order in orderList"
        :key="order.id"
        @click="gotoOrderDetail(order.id)"
      >
        <div>下单时间：{{ order.createdAt }}</div>
        <div class="food-card" v-for="item in order.items" :key="item.id">
          <img :src="item.pic" />
          <span>{{ item.foodname }}</span>
          <span> x {{ item.num }}</span>
        </div>
        <div>总价：￥{{ order.sum }}</div>
        <div class="buttons">
          <van-button v-if="order.state == 0" @click.stop="pay(order.id)"
            >付款</van-button
          >
          <van-button v-if="order.state == 1" @click.stop="signin(order.id)"
            >签收</van-button
          >
          <van-button
            v-if="order.state == 2"
            @click.stop="gotoOrderDetail(order.id)"
            >评价</van-button
          >
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { getApi, postApi } from "@/util/api.js";
export default {
  name: "OrderListView",

  data() {
    return {
      orderList: []
    };
  },

  computed: {
    userId() {
      return this.$store.state.userId;
    }
  },

  mounted() {
    this.getOrderInfo();
  },

  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    async getOrderInfo() {
      let state = this.$route.params.state;
      let filter = {
        where: {
          state: state
        }
      };
      let orderListRes = await getApi(
        `/user/${this.userId}/orders?filter=${encodeURIComponent(
          JSON.stringify(filter)
        )}`
      );
      for (let i = 0; i < orderListRes.data.length; i++) {
        let itemRes = await getApi(
          `/orders/${orderListRes.data[i].id}/order_item`
        );
        let items = [];
        for (let j = 0; j < itemRes.data.length; j++) {
          let foodRes = await getApi(`/food/${itemRes.data[j].food_id}`);
          items.push({
            id: itemRes.data[j].food_id,
            foodname: foodRes.data.foodname,
            num: itemRes.data[j].num,
            pic: foodRes.data.pic,
            comment: itemRes.data[j].comment
          });
        }
        this.orderList.unshift({
          ...orderListRes.data[i],
          items
        });
      }
    },
    pay(order_id) {
      postApi(`/orders/${order_id}`, {
        _method: "PUT",
        state: 1
      }).then((res) => {
        console.log(res);
        this.$toast.success("付款成功！");
        this.$router.push("/me");
      });
    },
    signin(order_id) {
      postApi(`/orders/${order_id}`, {
        _method: "PUT",
        state: 2
      }).then((res) => {
        console.log(res);
        this.$toast.success("签收成功！");
        this.$router.push("/me");
      });
    },
    gotoOrderDetail(order_id) {
      this.$router.push({ name: "orderdetail", params: { id: order_id } });
    }
  }
};
</script>

<style lang="scss" scoped>
.order-list {
  .order-card {
    margin: 1rem;
    box-sizing: border-box;
    background-color: #eeeeee;
    border-radius: 5px;
    padding: 0.5rem;
    .food-card {
      img {
        width: 3rem;
        height: 3rem;
      }
    }
    .buttons {
      text-align: right;
    }
  }
}
</style>

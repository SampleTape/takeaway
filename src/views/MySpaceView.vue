<template>
  <div class="my-space">
    <div class="button-container">
      <van-icon name="setting" />
    </div>
    <div class="user-info">
      <van-image
        round
        width="10rem"
        height="10rem"
        src="https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
      />
      <h1>{{ userName }}</h1>
    </div>
    <van-cell-group inset title="我的订单">
      <van-grid>
        <van-grid-item
          icon="credit-pay"
          @click="gotoOrderList(0)"
          text="待付款"
        />
        <van-grid-item
          icon="logistics"
          @click="gotoOrderList(1)"
          text="待收货"
        />
        <van-grid-item
          icon="comment-o"
          @click="gotoOrderList(2)"
          text="待评价"
        />
        <van-grid-item
          icon="orders-o"
          @click="gotoOrderList(3)"
          text="已评价"
        />
      </van-grid>
    </van-cell-group>
    <van-cell-group inset title=" ">
      <van-cell title="我的地址" is-link to="/address" />
    </van-cell-group>
  </div>
</template>

<script>
import { getApi } from "@/util/api.js";
export default {
  name: "MySpaceView",

  data() {
    return {
      userName: ""
    };
  },

  computed: {
    userId() {
      return this.$store.state.userId;
    }
  },

  mounted() {
    getApi(`/user/${this.userId}`).then((res) => {
      console.log(res);
      this.userName = res.data.username;
    });
  },

  methods: {
    gotoOrderList(state) {
      this.$router.push({ name: "orderlist", params: { state } });
    }
  }
};
</script>

<style lang="scss" scoped>
.my-space {
  padding: 1rem 0 0;
  background-color: #eee;
  height: 99vh;
  .button-container {
    text-align: right;
    padding: 0 1rem;
    font-size: 1.25rem;
  }
  .user-info {
    text-align: center;
  }
}
</style>

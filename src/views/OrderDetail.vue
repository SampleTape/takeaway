<template>
  <div class="order-detail">
    <van-nav-bar
      title="订单详情"
      left-text="返回"
      left-arrow
      fixed
      placeholder
      @click-left="onClickLeft"
    />
    <div class="address-text">
      <h3>配送信息：</h3>
      <span>{{ addressText }}</span>
    </div>
    <div class="food-box">
      <h3>商品信息：</h3>
      <van-card
        v-for="item in items"
        :key="item.id"
        :num="item.num"
        :price="item.price"
        :desc="item.comment"
        :title="item.foodname"
        class="goods-card"
        :thumb="item.pic"
        @click="gotoFoodDetail(item.food_id)"
      >
        <template #footer>
          <van-button
            v-if="state == 2 && item.comment == null"
            size="mini"
            text="评价"
            type="primary"
            @click.stop="comment(item.order_item_id)"
          />
        </template>
      </van-card>

      <h3>总价：￥{{ sum }}</h3>
    </div>
    <van-popup v-model:show="show" position="bottom" :style="{ height: '30%' }">
      <van-field
        v-model="commentText"
        rows="5"
        border
        label="评价"
        type="textarea"
        placeholder="请输入评价"
      />
      <van-button block round type="primary" @click="postComment"
        >确定</van-button
      >
    </van-popup>
  </div>
</template>

<script>
import { getApi, postApi } from "@/util/api.js";
export default {
  name: "OrderDetail",

  data() {
    return {
      id: "",
      addressText: "",
      sum: 0,
      items: [],
      state: 0,
      show: false,
      commentText: "",
      comment_order_item_id: "",
      commentNum: 0 // 已评价商品数
    };
  },

  computed: {
    userId() {
      return this.$store.state.userId;
    }
  },

  mounted() {
    this.id = this.$route.params.id;
    this.getOrderInfo();
  },

  methods: {
    onClickLeft() {
      this.$router.go(-1);
    },
    async getOrderInfo() {
      let orderRes = await getApi(`/orders/${this.id}`);
      this.addressText = orderRes.data.address_text;
      this.sum = orderRes.data.sum;
      this.state = orderRes.data.state;
      let itemRes = await getApi(`/orders/${this.id}/order_item`);
      for (let j = 0; j < itemRes.data.length; j++) {
        // 统计评论数
        if (itemRes.data[j].comment != null) {
          this.commentNum++;
        }
        let foodRes = await getApi(`/food/${itemRes.data[j].food_id}`);
        this.items.push({
          id: itemRes.data[j].food_id,
          foodname: foodRes.data.foodname,
          food_id: foodRes.data.id,
          num: itemRes.data[j].num,
          pic: foodRes.data.pic,
          price: foodRes.data.price,
          comment: itemRes.data[j].comment,
          order_item_id: itemRes.data[j].id
        });
      }
    },
    comment(order_item_id) {
      this.show = true;
      this.comment_order_item_id = order_item_id;
    },
    postComment() {
      postApi(`/order_item/${this.comment_order_item_id}`, {
        _method: "PUT",
        comment: this.commentText
      }).then((res) => {
        console.log(res);
        this.show = false;
        this.commentText = "";
        this.commentNum++;
        if (this.commentNum == this.items.length) {
          postApi(`/orders/${this.id}`, {
            _method: "PUT",
            state: "3"
          }).then(() => {
            this.$router.go(0);
          });
        } else {
          this.$router.go(0);
        }
      });
    },
    gotoFoodDetail(id) {
      this.$router.push({ name: "fooddetails", params: { id } });
    }
  }
};
</script>

<style lang="scss" scoped>
.address-text {
  white-space: pre-wrap;
  border-bottom: 1px solid #9e9e9e;
  margin: 1rem;
}
.food-box {
  margin: 1rem;
  ul {
    border-bottom: 1px solid #9e9e9e;
    .food-card {
      display: flex;
      justify-content: space-between;
      align-items: center;
      img {
        width: 4rem;
        height: 4rem;
      }
      .comment {
        overflow: hidden;
        text-overflow: ellipsis;
        border: 1px solid #cdcdcd;
        font-size: 0.8rem;
        color: #666666;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>

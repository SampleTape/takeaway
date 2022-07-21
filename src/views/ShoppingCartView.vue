<template>
  <div class="shopping-cart-view">
    <van-nav-bar
      title="购物车"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
      fixed
      placeholder
    />
    <van-empty v-if="foodList.length == 0" description="购物车里什么都没有" />
    <div v-else>
      <van-card
        v-for="f in foodList"
        :key="f.id"
        :price="f.price"
        :desc="f.info"
        :title="f.foodname"
        :thumb="f.pic"
        @click="gotoFoodDetail(f.id)"
      >
        <template #footer>
          <van-button size="mini" @click.stop="minusNum(f.shoppingcartId)"
            >-</van-button
          >
          {{ f.num }}
          <van-button size="mini" @click.stop="plusNum(f.shoppingcartId)"
            >+</van-button
          >
        </template>
      </van-card>
      <div class="total">总价：￥{{ total }}</div>
      <van-button type="primary" block round @click="order">结算</van-button>
    </div>
  </div>
</template>

<script>
import { getApi, postApi } from "@/util/api.js";
export default {
  name: "ShoppingCartView",

  data() {
    return {
      foodList: []
    };
  },

  computed: {
    userId() {
      return this.$store.state.userId;
    },
    total() {
      return this.foodList.reduce((previousValue, currentValue) => {
        return (previousValue += currentValue.num * currentValue.price);
      }, 0);
    }
  },

  mounted() {
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
    minusNum(shoppingcartId) {
      let index = this.foodList.findIndex((item) => {
        return item.shoppingcartId == shoppingcartId;
      });
      if (this.foodList[index].num === 1) {
        // 删除
        postApi(`/shoppingcarts/${shoppingcartId}`, {
          _method: "DELETE"
        }).then((res) => {
          console.log(res);
          this.foodList.splice(index, 1);
        });
      } else {
        // 更新数量
        postApi(`/shoppingcarts/${shoppingcartId}`, {
          _method: "PUT",
          num: this.foodList[index].num - 1
        }).then((res) => {
          console.log(res);
          this.foodList[index].num--;
        });
      }
    },
    plusNum(shoppingcartId) {
      let index = this.foodList.findIndex((item) => {
        return item.shoppingcartId == shoppingcartId;
      });
      postApi(`/shoppingcarts/${shoppingcartId}`, {
        _method: "PUT",
        num: this.foodList[index].num + 1
      }).then((res) => {
        console.log(res);
        this.foodList[index].num++;
      });
    },
    onClickLeft() {
      this.$router.go(-1);
    },
    order() {
      this.$router.push("/order");
    }
  }
};
</script>

<style lang="scss" scoped>
.total {
  margin: 1rem;
  font-size: 1.25rem;
  font-weight: bold;
}
</style>

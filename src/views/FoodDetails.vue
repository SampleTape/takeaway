<template>
  <div class="food-details-container">
    <van-nav-bar
      title="菜单详情"
      left-text="返回"
      left-arrow
      fixed
      placeholder
      @click-left="onClickLeft"
    />
    <img class="food-img" :src="pic" />
    <div class="food-name">
      {{ foodname }}
      <span v-if="isLike" @click="unlike">
        <van-icon name="star" style="color: #ffe676; font-size: 1.5rem" />
        已收藏
      </span>
      <span v-else @click="like">
        <van-icon name="star-o" style="color: #ffe676; font-size: 1.5rem" />
        收藏
      </span>
    </div>
    <p class="food-price">
      <span>{{ foodprice }}元</span>
      <van-button v-if="num === 0" round @click="addToCart">
        <van-icon name="plus" />
        加入购物车
      </van-button>
      <span class="counter" v-else>
        <van-icon class="counter-button" name="minus" @click="minusNum" />
        {{ num }}
        <van-icon class="counter-button" name="plus" @click="plusNum" />
      </span>
    </p>
    <p class="food-intro">{{ foodintro }}</p>
    <div class="comment-box">
      <h3>评价：</h3>
      <ul class="comment-list" v-if="commentList.length > 0">
        <li v-for="(comment, index) in commentList" :key="index">
          用户{{ comment.user_id }}说：{{ comment.comment }}
        </li>
      </ul>
      <van-empty v-else description="还没有人评价" />
    </div>
  </div>
</template>

<script>
import { getApi, postApi } from "@/util/api.js";
export default {
  name: "FoodDetails",
  data() {
    return {
      id: "",
      pic: "",
      foodname: "",
      foodintro: "",
      foodprice: "",
      isLike: false,
      num: 0,
      shoppingcartId: "",
      id_in_likes: "",
      commentList: []
    };
  },

  computed: {
    userId() {
      return this.$store.state.userId;
    }
  },

  mounted() {
    this.id = this.$route.params.id;

    // 获得食物信息
    getApi("/food/" + this.id).then((res) => {
      this.foodname = res.data.foodname;
      this.foodintro = res.data.intro;
      this.foodprice = res.data.price;
      this.pic = res.data.pic;
    });

    //获得食物是否已经加入购物车
    let filter = {
      where: {
        food_id: this.id
      }
    };
    if (this.userId) {
      getApi(
        `/user/${this.userId}/shoppingcart?filter=${encodeURIComponent(
          JSON.stringify(filter)
        )}`
      ).then((res) => {
        console.log(res);
        if (res.data[0]) {
          let { num, id } = res.data[0];
          this.num = num;
          this.shoppingcartId = id;
        }
      });
    }

    // 获得食物是否已经收藏
    getApi(`/user/${this.userId}/like`).then((res) => {
      let likelist = res.data;
      let index = likelist.findIndex((item) => {
        return item.liked_id == this.id;
      });
      this.isLike = index >= 0;
      if (this.isLike) {
        this.id_in_likes = likelist[index].id;
      }
    });

    // 获得评论列表
    let filter2 = {
      where: {
        food_id: this.id
      }
    };
    getApi(
      `/order_item?filter=${encodeURIComponent(JSON.stringify(filter2))}`
    ).then((res) => {
      res.data.forEach((item) => {
        if (item.comment != null) {
          this.commentList.push(item);
        }
      });
    });
  },

  methods: {
    addToCart() {
      // 判断是否登录
      if (!this.userId) {
        this.$router.push("/login");
        return;
      }

      // 向用户表的shoppingcart关系中增加记录
      postApi(`/user/${this.userId}/shoppingcart`, {
        user_id: this.userId,
        food_id: this.id,
        num: 1
      }).then((res) => {
        console.log(res);
        this.num = 1;
        this.shoppingcartId = res.data.id;
      });
    },
    minusNum() {
      if (this.num === 1) {
        // 删除
        postApi(`/shoppingcarts/${this.shoppingcartId}`, {
          _method: "DELETE"
        }).then((res) => {
          console.log(res);
          this.num = 0;
          this.shoppingcartId = "";
        });
      } else {
        // 更新数量
        postApi(`/shoppingcarts/${this.shoppingcartId}`, {
          _method: "PUT",
          num: this.num - 1
        }).then((res) => {
          console.log(res);
          this.num--;
        });
      }
    },
    plusNum() {
      postApi(`/shoppingcarts/${this.shoppingcartId}`, {
        _method: "PUT",
        num: this.num + 1
      }).then((res) => {
        console.log(res);
        this.num++;
      });
    },
    like() {
      // 判断是否登录
      if (!this.userId) {
        this.$router.push("/login");
        return;
      }
      postApi(`/user/${this.userId}/like`, {
        user_id: this.userId,
        liked_id: this.id,
        type: 0 // food:0,shop:1
      }).then((res) => {
        console.log(res);
        this.isLike = true;
        this.id_in_likes = res.data.id;
      });
    },
    unlike() {
      postApi(`/likes/${this.id_in_likes}`, {
        _method: "DELETE"
      }).then((res) => {
        console.log(res);
        this.isLike = false;
      });
    },
    onClickLeft() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss" scoped>
.food-details-container {
  margin-bottom: 6rem;
  .food-img {
    width: 100%;
  }
  .food-name {
    font-size: 1.25rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem;
    margin-top: 1.5rem;
    span {
      font-size: 0.9rem;
    }
  }
  .food-price {
    color: red;
    font-size: 1.1rem;
    font-weight: bold;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 1rem;
    .counter {
      color: #222222;
      .counter-button {
        background-color: #0934ff;
        color: #fff;
      }
    }
  }
  .food-intro {
    padding: 0 1rem;
  }
  .comment-box {
    border-top: 1px solid #222222;
    margin: 1rem;
    .comment-list {
      li {
        font-size: 0.9rem;
        padding: 1rem;
        border-bottom: 1px solid #666;
      }
    }
  }
}
</style>

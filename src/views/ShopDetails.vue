<template>
  <div class="shop-details-container">
    <van-nav-bar
      title="店铺详情"
      left-text="返回"
      left-arrow
      :fixed="true"
      :placeholder="true"
      @click-left="onClickLeft"
    />
    <img class="shop-img" :src="pic" />
    <p class="shop-name">
      {{ shopname }}
      <span v-if="isLike" @click="unlike">
        <van-icon name="star" style="color: #ffe676; font-size: 1.5rem" />
        已收藏
      </span>
      <span v-else @click="like">
        <van-icon name="star-o" style="color: #ffe676; font-size: 1.5rem" />
        收藏
      </span>
    </p>
    <p class="shop-adress">
      <van-icon name="location-o" />
      {{ address }}
    </p>
    <van-search v-model="searchText" shape="round" placeholder="搜索菜谱" />
    <van-card
      v-for="f in resultList"
      :key="f.id"
      :price="f.price"
      :desc="f.info"
      :title="f.foodname"
      :thumb="f.pic"
      @click="gotoFoodDetail(f.id)"
    >
      <template #footer>
        <van-button size="mini">收藏</van-button>
        <van-button size="mini">加入购物车</van-button>
        <van-button size="mini">立即购买</van-button>
      </template>
    </van-card>
  </div>
</template>

<script>
import { getApi, postApi } from "@/util/api.js";
export default {
  name: "ShopDetails",

  data() {
    return {
      id: "",
      shopname: "",
      address: "",
      phonenum: "",
      intro: "",
      pic: "",
      comment: null,
      level: 0,
      foodList: [],
      isLike: false,
      id_in_likes: "",
      searchText: ""
    };
  },

  computed: {
    userId() {
      return this.$store.state.userId;
    },
    resultList() {
      if (this.searchText) {
        return this.foodList.filter((item) => {
          return item.foodname.includes(this.searchText);
        });
      } else {
        return this.foodList;
      }
    }
  },

  mounted() {
    this.id = this.$route.params.id;
    // 获得店铺详情
    getApi("/shops/" + this.id).then((res) => {
      this.shopname = res.data.shopname;
      this.address = res.data.address;
      this.pic = res.data.pic;
    });
    // 获得店铺菜单
    getApi(`/shops/${this.id}/food/`).then((res) => {
      this.foodList = res.data;
    });
    // 获得店铺是否被收藏
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
  },

  methods: {
    gotoFoodDetail(id) {
      this.$router.push({ name: "fooddetails", params: { id } });
    },
    onClickLeft() {
      this.$router.go(-1);
    },
    like() {
      // 判断是否登录
      if (!this.userId) {
        this.$router.push("/login");
      }

      postApi(`/user/${this.userId}/like`, {
        user_id: this.userId,
        liked_id: this.id,
        type: 1 // food:0,shop:1
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
    }
  }
};
</script>

<style lang="scss" scoped>
.shop-details-container {
  width: 100%;
  margin-bottom: 6rem;
  img.shop-img {
    width: 100%;
  }
  .shop-name {
    font-size: 1.25rem;
    font-weight: bold;
  }
  .shop-adress {
    font-size: 0.9rem;
  }
}
</style>

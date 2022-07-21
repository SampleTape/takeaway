<template>
  <div class="home">
    <van-search
      v-model="searchText"
      shape="round"
      background="#B0C4DE"
      placeholder="搜索店铺"
      @search="onSearch"
    />
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item
        v-for="item in swipeList"
        :key="item.id"
        @click="gotoFoodDetail(item.food_id)"
      >
        <img class="swipe-img" :src="item.swipe_img" />
      </van-swipe-item>
    </van-swipe>
    <ShopList :shopList="shopList" />
  </div>
</template>

<script>
// @ is an alias to /src
import ShopList from "@/components/ShopList.vue";
import { getApi } from "@/util/api.js";

export default {
  name: "HomeView",
  components: {
    ShopList
  },
  data() {
    return {
      shopList: [],
      swipeList: [],
      searchText: ""
    };
  },
  mounted() {
    // 获取店铺列表
    getApi("/shops").then((res) => {
      this.shopList = res.data;
    });
    // 获取轮播图列表
    getApi("/swipes").then((res) => {
      this.swipeList = res.data;
    });
  },
  methods: {
    onSearch() {
      let filter = {
        where: {
          shopname: {
            like: this.searchText
          }
        }
      };
      getApi(
        `/shops?filter=${encodeURIComponent(JSON.stringify(filter))}`
      ).then((res) => {
        this.shopList = res.data;
      });
    },
    gotoFoodDetail(id) {
      this.$router.push({ name: "fooddetails", params: { id } });
    }
  }
};
</script>
<style lang="scss" scoped>
.home {
  padding-top: 3.3rem;
  .van-search {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 99;
    width: 100%;
  }
}
.swipe-img {
  width: 100%;
}
</style>

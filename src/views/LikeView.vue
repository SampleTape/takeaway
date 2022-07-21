<template>
  <div>
    <van-tabs>
      <van-tab>
        <template #title> <van-icon name="shop-o" />店铺 </template>
        <div class="shop-list">
          <van-card
            v-for="s in shopList"
            :key="s.id"
            :title="s.shopname"
            :desc="s.intro"
            :thumb="s.pic"
            @click="gotoShopDetail(s.id)"
          >
            <template #footer>
              <van-button
                size="mini"
                v-if="!s.isLike"
                @click.stop="like(s.id, 1)"
                >收藏</van-button
              >
              <van-button
                size="mini"
                v-else
                @click.stop="unlike(s.id_in_likes, 1)"
                >取消收藏</van-button
              >
            </template>
          </van-card>
        </div>
      </van-tab>
      <van-tab>
        <template #title> <van-icon name="fire-o" />菜单 </template>
        <div class="food-list">
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
              <van-button
                size="mini"
                v-if="!f.isLike"
                @click.stop="like(f.id, 0)"
                >收藏</van-button
              >
              <van-button
                size="mini"
                v-else
                @click.stop="unlike(f.id_in_likes, 0)"
                >取消收藏</van-button
              >
            </template>
          </van-card>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
import { getApi, postApi } from "@/util/api.js";
export default {
  name: "LikeView",

  data() {
    return {
      shopList: [],
      foodList: []
    };
  },

  computed: {
    userId() {
      return this.$store.state.userId;
    }
  },

  mounted() {
    getApi("/user/" + this.userId + "/like").then((res) => {
      console.log(res);
      res.data.forEach((item) => {
        let id_in_likes = item.id;
        if (item.type == 0) {
          // 从food表中查找数据
          getApi(`/food/${item.liked_id}`).then((res) => {
            this.foodList.push({
              ...res.data,
              isLike: true,
              id_in_likes
            });
          });
        } else if (item.type == 1) {
          // 从shops表中查找数据
          getApi(`/shops/${item.liked_id}`).then((res) => {
            this.shopList.push({
              ...res.data,
              isLike: true,
              id_in_likes
            });
          });
        }
      });
    });
  },

  methods: {
    like(liked_id, type) {
      postApi(`/user/${this.userId}/like`, {
        user_id: this.userId,
        liked_id,
        type // food:0,shop:1
      }).then((res) => {
        console.log(res);
        if (type == 0) {
          let index = this.foodList.findIndex((item) => {
            return liked_id == item.id;
          });
          console.log("index:", index);
          this.foodList[index].isLike = true;
          this.foodList[index].id_in_likes = res.data.id;
        } else if (type == 1) {
          let index = this.shopList.findIndex((item) => {
            return liked_id == item.id;
          });
          console.log("index:", index);
          this.shopList[index].isLike = true;
          this.shopList[index].id_in_likes = res.data.id;
        }
      });
    },
    unlike(id_in_likes, type) {
      postApi(`/likes/${id_in_likes}`, {
        _method: "DELETE"
      }).then((res) => {
        console.log(res);
        if (type == 0) {
          let index = this.foodList.findIndex((item) => {
            return id_in_likes == item.id_in_likes;
          });
          console.log("index:", index);
          this.foodList[index].isLike = false;
          this.foodList[index].id_in_likes = "";
        } else if (type == 1) {
          let index = this.shopList.findIndex((item) => {
            return id_in_likes == item.id_in_likes;
          });
          console.log("index:", index);
          this.shopList[index].isLike = false;
          this.shopList[index].id_in_likes = "";
        }
      });
    },
    gotoFoodDetail(id) {
      this.$router.push({ name: "fooddetails", params: { id } });
    },
    gotoShopDetail(id) {
      this.$router.push({ name: "shopdetails", params: { id } });
    }
  }
};
</script>

<style lang="scss" scoped></style>

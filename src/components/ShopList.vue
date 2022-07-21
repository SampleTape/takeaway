<template>
  <div class="rest-list-container">
    <ul>
      <li v-for="shop in shopList" :key="shop.id" @click="gotoDetail(shop.id)">
        <div class="img-container">
          <img :src="shop.pic" />
        </div>
        <div class="shop-info">
          <div>{{ shop.shopname }}</div>
          <div>{{ shop.address }}</div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "ShopList",
  props: {
    shopList: Array
  },
  methods: {
    gotoDetail(id) {
      this.$router.push({ name: "shopdetails", params: { id: id } });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
li {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100%;
  border-bottom: 1px solid #9e9e9e;
  margin-bottom: 3px;
  .img-container {
    width: 6rem;
    height: 6rem;
    img {
      width: 100%;
      height: 100%;
    }
  }
  .shop-info {
    width: 10rem;
  }
}
</style>

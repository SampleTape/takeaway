<template>
  <div class="address-list">
    <van-nav-bar
      title="我的地址"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <van-address-list
      v-model="chosenAddressId"
      :list="addressList"
      @add="onAdd"
      @edit="onEdit"
    />
  </div>
</template>

<script>
import { getApi } from "@/util/api.js";
export default {
  name: "AddressListView",

  data() {
    return {
      addressList: [],
      chosenAddressId: this.$store.state.addressInfo.id
    };
  },

  computed: {
    userId() {
      return this.$store.state.userId;
    }
  },

  watch: {
    chosenAddressId(newValue) {
      console.log(newValue);
      let index = this.addressList.findIndex((item) => {
        return item.id == newValue;
      });
      this.$store.commit("setAddressInfo", this.addressList[index]);
    }
  },

  mounted() {
    getApi(`/user/${this.userId}/address`).then((res) => {
      console.log(res);
      this.addressList = res.data;
    });
  },

  methods: {
    onAdd() {
      this.$router.push("/addressadd");
    },
    onEdit(item) {
      this.$router.push({ name: "addressedit", params: { id: item.id } });
    },
    onClickLeft() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss" scoped>
.address-list {
  width: 100vw;
  height: 100vh;
  position: fixed;
  background-color: #fff;
  top: 0;
  left: 0;
  z-index: 100;
  .van-address-list__bottom {
    z-index: 100;
  }
}
</style>

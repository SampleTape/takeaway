<template>
  <div class="address-edit">
    <van-nav-bar
      title="新增地址"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="addressInfo.name"
          name="收货人"
          label="收货人"
          placeholder="收货人"
          :rules="[{ required: true, message: '请填写收货人' }]"
        />
        <van-field
          v-model="addressInfo.tel"
          name="收货电话"
          label="收货电话"
          placeholder="收货电话"
          :rules="[
            { required: true, message: '请填写收货电话' },
            { pattern: /^1\d{10}$/, message: '请输入正确电话号码' }
          ]"
        />
        <van-field
          v-model="addressInfo.address"
          name="收货地址"
          label="收货地址"
          placeholder="收货地址"
          :rules="[{ required: true, message: '请填写收货地址' }]"
        />
        <van-field
          v-model="addressInfo.remark"
          name="备注"
          label="备注"
          placeholder="备注"
        />
      </van-cell-group>
      <div style="margin: 16px">
        <van-button round block type="primary" native-type="submit">
          提交
        </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { postApi } from "@/util/api.js";
export default {
  name: "AddressAdd",

  data() {
    return {
      addressInfo: {
        name: "",
        tel: "",
        address: "",
        remark: ""
      }
    };
  },
  computed: {
    userId() {
      return this.$store.state.userId;
    }
  },
  mounted() {},
  methods: {
    onSubmit() {
      postApi(`/user/${this.userId}/address`, {
        ...this.addressInfo,
        userId: this.userId
      })
        .then((res) => {
          console.log(res);
          this.$toast.success("新增成功！");
        })
        .catch((err) => {
          console.log(err);
          this.$toast.fail("新增失败！");
        });
    },
    onClickLeft() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss" scoped>
.address-edit {
  width: 100vw;
  height: 100vh;
  position: fixed;
  background-color: #fff;
  top: 0;
  left: 0;
  z-index: 100;
}
</style>

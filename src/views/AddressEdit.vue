<template>
  <div class="address-edit">
    <van-nav-bar
      title="编辑地址"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <van-form @submit="onSave">
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
          保存
        </van-button>
      </div>
      <div style="margin: 16px">
        <van-button round block @click.stop="onDelete"> 删除 </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { getApi, postApi } from "@/util/api.js";
export default {
  name: "AddressEdit",

  data() {
    return {
      addressInfo: {
        id: "", //收货人信息初始值
        name: "", //姓名
        tel: "", //电话
        address: "", //详细地址
        remark: "" //备注
      }
    };
  },

  mounted() {
    this.addressInfo.id = this.$route.params.id;
    getApi(`/address/${this.addressInfo.id}`).then((res) => {
      console.log(res);
      this.addressInfo = res.data;
    });
  },

  methods: {
    onSave() {
      postApi(`/address/${this.addressInfo.id}`, {
        ...this.addressInfo,
        _method: "PUT"
      })
        .then((res) => {
          console.log(res);
          this.$toast.success("保存成功！");
          this.$store.commit("setAddressInfo", {
            id: res.data.id, //收货人信息初始值
            name: res.data.name, //姓名
            tel: res.data.tel, //电话
            address: res.data.address, //详细地址
            remark: res.data.remark //备注
          });
        })
        .catch((err) => {
          console.log(err);
          this.$toast.fail("保存失败！");
        });
    },
    onDelete() {
      postApi(`/address/${this.addressInfo.id}`, {
        _method: "DELETE"
      })
        .then((res) => {
          console.log(res);
          this.$toast.success("删除成功！");
          this.addressInfo = {};
          this.$store.commit("setAddressInfo", {
            id: "", //收货人信息初始值
            name: "", //姓名
            tel: "", //电话
            address: "", //详细地址
            remark: "" //备注
          });
          this.$router.go(-1);
        })
        .catch((err) => {
          console.log(err);
          this.$toast.fail("删除失败！");
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

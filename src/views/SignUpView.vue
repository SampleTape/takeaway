<template>
  <h1>注册</h1>
  <div>
    <van-form @submit="onSubmit">
      <van-cell-group inset>
        <van-field
          v-model="username"
          name="用户名"
          label="用户名"
          placeholder="用户名"
          :rules="[{ required: true, message: '请填写用户名' }]"
        />
        <van-field
          v-model="password"
          type="password"
          name="密码"
          label="密码"
          placeholder="密码"
          :rules="[{ required: true, message: '请填写密码' }]"
        />
      </van-cell-group>
      <div style="margin: 16px">
        <van-button round block type="primary" native-type="submit">
          提交
        </van-button>
      </div>
      <div style="margin: 16px">
        <van-button round block @click="gotoLogIn"> 直接登陆 </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { postApi } from "@/util/api.js";
export default {
  name: "SignUpViews",

  data() {
    return {
      username: "",
      password: "",
    };
  },

  mounted() {},

  methods: {
    onSubmit() {
      postApi("/user/", {
        username: this.username,
        password: this.password,
      })
        .then((res) => {
          console.log(res);
          if (res.status == 200) {
            this.$toast.success("注册成功！");
          } else {
            this.$toast.fail("注册失败！");
          }
          // this.$router.push("/login");
        })
        .catch((err) => {
          console.log(err);
          this.$toast.fail("注册失败！");
        });
    },
    gotoLogIn() {
      this.$router.push("/login");
    },
  },
};
</script>

<style lang="scss" scoped></style>

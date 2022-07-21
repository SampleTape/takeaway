<template>
  <div>
    <h1>登录</h1>
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
        <van-button block round @click="gotoSignUp"> 去注册 </van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { postApi } from "@/util/api.js";
export default {
  name: "LogInViews",

  data() {
    return {
      username: "",
      password: ""
    };
  },

  mounted() {},

  methods: {
    onSubmit() {
      postApi("/user/login", {
        username: this.username,
        password: this.password
      })
        .then((res) => {
          console.log(res);
          if (res.status == 200) {
            this.$toast.success("登录成功！");
            // 将tocken存到sessionStorage
            sessionStorage.tocken = res.data.ttl;
            // 将userID存到store
            let userId = res.data.userId;
            this.$store.commit("setUserId", userId);
            sessionStorage.userId = userId;
            // 路由跳转
            this.$router.go(-1);
          } else {
            this.$toast.fail("登录失败！");
          }
        })
        .catch((err) => {
          console.log(err);
          this.$toast.fail("登录失败！");
        });
    },
    gotoSignUp() {
      this.$router.push("/signup");
    }
  }
};
</script>

<style lang="scss" scoped></style>

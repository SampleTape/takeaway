<template>
  <router-view class="view-container" />
  <nav>
    <van-grid :border="false" :column-num="4">
      <van-grid-item>
        <router-link to="/">
          <van-icon name="shop-o" />
          <span>首页</span>
        </router-link>
      </van-grid-item>
      <van-grid-item>
        <router-link to="/like">
          <van-icon name="goods-collect-o" />
          <span>收藏</span>
        </router-link>
      </van-grid-item>
      <van-grid-item>
        <router-link to="/shoppingcart">
          <van-icon name="cart-o" />
          <span>购物车</span>
        </router-link>
      </van-grid-item>
      <van-grid-item>
        <router-link to="/me">
          <van-icon name="contact" />
          <span>我的</span>
        </router-link>
      </van-grid-item>
    </van-grid>
  </nav>
</template>

<style lang="scss">
html,
body {
  width: 100vw;
  height: 100vh;
  overflow: scroll;
}
.view-container {
  width: 100vw;
  margin-bottom: 5.5rem;
}
nav {
  width: 100%;
  height: 5rem;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 99;
  box-sizing: border-box;
  border-top: 1px solid #eee;
  padding: 2px;
  background-color: #fff;
  a {
    color: #222222;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    .van-icon {
      font-size: 1.5rem;
    }
    &.router-link-active {
      color: #0c43f8;
    }
  }
}
.van-toast {
  color: #222222;
}
</style>

import { createRouter, createWebHistory } from "vue-router";
import AddressAdd from "../views/AddressAdd.vue";
import AddressEdit from "../views/AddressEdit.vue";
import AddressListView from "../views/AddressListView.vue";
import FoodDetails from "../views/FoodDetails.vue";
import HomeView from "../views/HomeView.vue";
import LikeView from "../views/LikeView.vue";
import LogInView from "../views/LogInView.vue";
import MySpaceView from "../views/MySpaceView.vue";
import OrderDetail from "../views/OrderDetail.vue";
import OrderListView from "../views/OrderListView.vue";
import OrderView from "../views/OrderView.vue";
import ShopDetails from "../views/ShopDetails.vue";
import ShoppingCartView from "../views/ShoppingCartView.vue";
import SignUpView from "../views/SignUpView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView
  },
  {
    path: "/about",
    name: "about",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue")
  },
  {
    path: "/shopdetails/:id",
    name: "shopdetails",
    component: ShopDetails
  },
  {
    path: "/fooddetails/:id",
    name: "fooddetails",
    component: FoodDetails
  },
  {
    path: "/signup",
    name: "signup",
    component: SignUpView
  },
  {
    path: "/login",
    name: "login",
    component: LogInView
  },
  {
    path: "/like",
    name: "like",
    meta: {
      login_required: true
    },
    component: LikeView
  },
  {
    path: "/shoppingcart",
    name: "shoppingcart",
    meta: {
      login_required: true
    },
    component: ShoppingCartView
  },
  {
    path: "/me",
    name: "me",
    meta: {
      login_required: true
    },
    component: MySpaceView
  },
  {
    path: "/address",
    name: "address",
    meta: {
      login_required: true
    },
    component: AddressListView
  },
  {
    path: "/addressedit/:id",
    name: "addressedit",
    meta: {
      login_required: true
    },
    component: AddressEdit
  },
  {
    path: "/addressadd",
    name: "addressadd",
    meta: {
      login_required: true
    },
    component: AddressAdd
  },
  {
    path: "/order",
    name: "order",
    meta: {
      login_required: true
    },
    component: OrderView
  },
  {
    path: "/orderlist/:state",
    name: "orderlist",
    meta: {
      login_required: true
    },
    component: OrderListView
  },
  {
    path: "/orderdetail/:id",
    name: "orderdetail",
    meta: {
      login_required: true
    },
    component: OrderDetail
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach((to, from, next) => {
  let logged_in = false;
  if (sessionStorage.tocken) {
    logged_in = true;
  }

  if (
    !logged_in &&
    to.matched.some((item) => {
      return item.meta.login_required;
    })
  ) {
    next("/login");
  } else {
    next();
  }
});

export default router;

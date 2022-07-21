import {
  AddressEdit,
  AddressList,
  Button,
  Card,
  Cell,
  CellGroup,
  Dialog,
  Empty,
  Field,
  Form,
  Grid,
  GridItem,
  NavBar,
  Popup,
  Search,
  Swipe,
  SwipeCell,
  SwipeItem,
  Tab,
  Tabs,
  Toast
} from "vant";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

const app = createApp(App);
app.use(store);
app.use(router);
app.use(Button);
app.use(Form);
app.use(Field);
app.use(CellGroup);
app.use(Toast);
app.use(Grid);
app.use(GridItem);
app.use(Card);
app.use(NavBar);
app.use(Tab);
app.use(Tabs);
app.use(Search);
app.use(Swipe);
app.use(SwipeItem);
app.use(Cell);
app.use(AddressList);
app.use(AddressEdit);
app.use(Dialog);
app.use(Empty);
app.use(Popup);
app.use(SwipeCell);
app.mount("#app");

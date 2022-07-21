import { createStore } from "vuex";

export default createStore({
  state: {
    userId: sessionStorage.userId,
    addressInfo: {
      id: "",
      name: "",
      tel: "",
      address: ""
    }
  },
  getters: {},
  mutations: {
    setUserId(state, id) {
      state.userId = id;
    },
    setAddressInfo(state, obj) {
      state.addressInfo = obj;
    }
  },
  actions: {},
  modules: {}
});

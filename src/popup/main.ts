import Vue from "vue";
import App from "./App.vue";
import { store } from "@/store/store.vuex";

/* eslint-disable no-new */
new Vue({
  el: "#app",
  store,
  render: (h) => h(App),
});

import Vue from "vue";
import "es6-promise/auto";
import App from "./App.vue";
import Amplify from "aws-amplify";
import "@aws-amplify/ui-vue";
import aws_exports from "./aws-exports";
import store from "./store";
import router from "./router";

Amplify.configure(aws_exports);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  beforeCreate() {
    // means before the app is loaded can detect whether or not is logged in from loggedIn module.
    this.$store.commit("loggedIn/isLoggedIn");
  },
  modules: {
    groups: {
      // namespaced means can access other module states
      namespaced: true,
    },
    loggedIn: {
      namespaced: true,
    },
  },
  render: (h) => h(App),
}).$mount("#app");

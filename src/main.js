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
    this.$store.commit("loggedIn/isLoggedIn");
  },
  modules: {
    groups: {
      namespaced: true,
    },
    loggedIn: {
      namespaced: true,
    },
  },
  render: (h) => h(App),
}).$mount("#app");

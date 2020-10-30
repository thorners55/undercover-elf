import Vue from "vue";
import "es6-promise/auto";
import Vuex from "vuex";
import App from "./App.vue";
import Amplify from "aws-amplify";
import "@aws-amplify/ui-vue";
import aws_exports from "./aws-exports";

Amplify.configure(aws_exports);

Vue.config.productionTip = false;

new Vue({
  render: (h) => h(App),
}).$mount("#app");

import Vuex from "vuex";
import Vue from "vue";

// import a module
import demo from "./modules/demo.js";
import groups from "./modules/groups.js";
import loggedIn from "./modules/loggedIn.js";
import profile from "./modules/profile.js";
import wishlists from "./modules/wishlists.js";

// Load Vuex
Vue.use(Vuex);

// Create store
export default new Vuex.Store({
  modules: { demo, loggedIn, groups, profile, wishlists },
});

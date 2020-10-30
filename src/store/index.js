import Vuex from "vuex";
import Vue from "vue";
// import a module
import groups from "./modules/groups.js";
import loggedIn from "./modules/loggedIn.js";

// Load Vuex
Vue.use(Vuex);

// Create store
export default new Vuex.Store({ modules: { loggedIn, groups } });

import Vue from "vue";
import VueRouter from "vue-router";
import GroupPage from "../components/GroupPage.vue";

Vue.use(VueRouter);

const routes = [{ path: "/groups/:id", component: GroupPage }];

// Create router
export default new VueRouter({ routes });

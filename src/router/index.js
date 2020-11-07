import Vue from "vue";
import VueRouter from "vue-router";

import Profile from "../components/Profile.vue";
import AllGroups from "../components/AllGroups.vue";
import GroupPage from "../components/GroupPage.vue";
import JoinGroup from "../components/JoinGroup.vue";
import CreateGroup from "../components/CreateGroup.vue";
import AllWishlists from "../components/AllWishlists.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/", component: AllGroups },
  { path: "/groups/:groupId/profile", component: GroupPage },
  { path: "/groups/join", component: JoinGroup },
  { path: "/groups/create", component: CreateGroup },
  { path: "/profile", component: Profile },
  { path: "/wishlists", component: AllWishlists },
];

// Create router
export default new VueRouter({ routes });

import Vue from "vue";
import VueRouter from "vue-router";
import Profile from "../components/Profile.vue";
import AllGroups from "../components/AllGroups.vue";
import GroupPage from "../components/GroupPage.vue";
import JoinGroup from "../components/JoinGroup.vue";
import CreateGroup from "../components/CreateGroup.vue";
import AdminEditGroup from "../components/AdminEditGroup.vue";
import MyWishlist from "../components/MyWishlist.vue";
import BuyingForWishlist from "../components/BuyingForWishlist.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/", component: AllGroups },
  { path: "/groups/:groupId/profile", component: GroupPage },
  { path: "/groups/join", component: JoinGroup },
  { path: "/groups/create", component: CreateGroup },
  { path: "/groups/edit", component: AdminEditGroup },
  { path: "/profile", component: Profile },
  { path: "/my-wishlist", component: MyWishlist },
  { path: "/wishlist/:userId", component: BuyingForWishlist },
];

// Create router
export default new VueRouter({ routes });

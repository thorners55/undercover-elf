import Vue from "vue";
import VueRouter from "vue-router";
import Profile from "../components/Profile.vue";
import AllGroups from "../components/AllGroups.vue";
import GroupPage from "../components/GroupPage.vue";
import AdminEditGroup from "../components/AdminEditGroup.vue";
import MyWishlist from "../components/MyWishlist.vue";
import BuyingForWishlist from "../components/BuyingForWishlist.vue";
import CreateGroup from "../components/CreateGroup.vue";

Vue.use(VueRouter);

const routes = [
  { path: "/", component: AllGroups },
  { path: "/profile", component: Profile },
  { path: "/groups/:groupId/profile", component: GroupPage },
  { path: "/groups/edit", component: AdminEditGroup },
  { path: "/my-wishlist", component: MyWishlist },
  { path: "/wishlist/:userId", component: BuyingForWishlist },
  { path: "/groups/create", component: CreateGroup },
];

// Create router
export default new VueRouter({ routes });

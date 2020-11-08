<template>
  <div>
    <h2>Wishlist Page</h2>
    <Wishlist v-bind:ids="{userId, groupId}" />
  </div>
</template>

<script>
import { mapActions } from "vuex";
import Wishlist from "./Wishlist.vue";

export default {
  name: "WishlistPage",
  components: {
    Wishlist
  },
  methods: {
    ...mapActions("wishlists", ["fetchWishlist"])
  },
  computed: {
    userId() {
      return this.$route.params.userId;
    },
    groupId() {
      return this.$route.query.groupId;
    }
  }
};
</script>

<style>
</style>
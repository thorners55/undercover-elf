<template>
  <div>
    <h2>Wishlist Page</h2>
    <Wishlist v-bind:ids="{userId, groupId}" />
  </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
  name: "BuyingForWishlist",
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
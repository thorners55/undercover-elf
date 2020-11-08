<template>
  <div>
    <h3>Wishlist</h3>
    <p>Remember, you are the only person who can see {{ name }}'s wishlist!</p>
    <ul>
      <li v-for="item in wishlist" :key="item.id">
        <ul>
          <li>{{ item.description }}</li>
          <li v-if="item.url">{{ item.url }}</li>
          <li v-if="!item.url">No URL provided for this item</li>
          <li>{{ item.comments }}</li>
        </ul>
      </li>
    </ul>
    <router-link :to="`/groups/${ids.groupId}/profile`"
      >Back to {{ groupName }}</router-link
    >
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "Wishlist",
  props: {
    ids: Object,
  },
  computed: {
    ...mapState("wishlists", ["name", "wishlist", "groupName"]),
  },
  methods: {
    ...mapActions("wishlists", ["fetchWishlist"]),
  },

  created() {
    this.fetchWishlist(this.ids);
  },
  data() {
    return {};
  },
};
</script>

<style></style>

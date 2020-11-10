<template>
  <div class="top-of-page">
    <img src="../assets/sock.svg" id="logo" width="50rem" />
    <h2>{{ name }}'s Wishlist</h2>
    <router-link :to="`/groups/${groupId}/profile`"
      >Back to {{ groupName }}</router-link
    >
    <ul>
      <li
        v-for="item in wishlist"
        :key="item.id"
        class="wishlist-item-container"
      >
        <div class="wishlist-item">
          <ul>
            <li>
              <p><b>Description:</b></p>
              <p>{{ item.description }}</p>
            </li>
            <li v-show="item.url">
              <p><b>Link to item:</b></p>

              <a :href="item.url">{{ item.url }}</a>
            </li>
            <li v-show="item.comment">
              <p><b>Comment:</b></p>
              <p>{{ item.comment }}</p>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "BuyingForWishlist",
  methods: {
    ...mapActions("wishlists", ["fetchWishlist"]),
  },
  computed: {
    userId() {
      return this.$route.params.userId;
    },
    groupId() {
      return this.$route.query.groupId;
    },
    ...mapState("wishlists", ["name", "groupName", "wishlist"]),
  },
  created() {
    this.fetchWishlist({ userId: this.userId, groupId: this.groupId });
  },
};
</script>

<style>
li {
  margin-bottom: 2ch;
}

ul {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.wishlist-item-container {
  border: 2px solid #2c3e50;
  border-radius: 1rem;
  margin: 2ch auto;
  justify-content: center;
  width: 70%;
}

@media (max-width: 900px) {
  .wishlist-item-container {
    display: flex;
    flex-direction: column;
  }

  .wishlist-item {
    padding: 0.5ch;
  }

  .wishlist-item > div > ul > li > p,
  .wishlist-item > ul > li > a {
    width: 70%;
    word-wrap: break-word;
  }
}
</style>

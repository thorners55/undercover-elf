<template>
  <div>
    <router-link class="back-to" :to="`/groups/${groupId}/profile`">Back to {{ groupName }}</router-link>
    <Loading v-if="loadingWishlist" />
    <div v-if="!loadingWishlist" class="top-of-page">
      <img src="../assets/sock.svg" id="logo" width="50rem" />
      <h2>{{ name }}'s Wishlist</h2>
      <p>
        <b>REMEMBER: You are the only person who can see {{ name }}'s wishlist!</b>
      </p>
      <p
        v-if="buyingForWishlist.length < 1"
      >{{ name }} has not added anything to their wishlist yet!</p>
      <ul>
        <li v-for="item in buyingForWishlist" :key="item.id" class="wishlist-item-container">
          <div class="wishlist-item">
            <ul>
              <li class="description">{{ item.description }}</li>
              <li v-show="item.url">
                <a :href="item.url">{{ item.url }}</a>
              </li>
              <li v-show="item.comment">{{ item.comment }}</li>
            </ul>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Loading from "./Loading.vue";
import { mapState, mapActions } from "vuex";

export default {
  name: "BuyingForWishlist",
  components: {
    Loading
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
    },
    ...mapState("wishlists", [
      "name",
      "groupName",
      "buyingForWishlist",
      "loadingWishlist"
    ])
  },
  created() {
    this.fetchWishlist({ userId: this.userId, groupId: this.groupId });
  }
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

.description {
  font-weight: bold;
  font-size: 1.3rem;
}

.wishlist-item-container {
  border: 2px solid #2c3e50;
  border-radius: 1rem;
  margin: 2ch auto;
  justify-content: center;
  width: 70%;
}

.wishlist-item {
  padding: 1ch;
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

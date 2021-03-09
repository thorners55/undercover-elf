<template>
  <div>
    <router-link class="back-to" :to="`/groups/${groupId}/profile`">Back to {{ group }}</router-link>
    <div class="top-of-page">
      <img src="../assets/sock.svg" id="logo" width="50rem" />
      <h2>{{ buyingFor }}'s Wishlist</h2>
      <p>
        <b>REMEMBER: You are the only person who can see {{ buyingFor }}'s wishlist!</b>
      </p>
      <p v-if="wishlist.length < 1">{{ name }} has not added anything to their wishlist yet!</p>
      <ul>
        <li v-for="item in wishlist" :key="item.id" class="wishlist-item-container">
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
import { mapGetters } from "vuex";

export default {
  name: "BuyingForWishlist",
  computed: {
    groupId() {
      return this.$route.query.groupId;
    },
    ...mapGetters("demo", ["getBuyingForWishlist"])
  },
  created() {
    let buyingForInfo = this.getBuyingForWishlist(this.groupId);
    this.wishlist = buyingForInfo.wishlist;
    this.buyingFor = buyingForInfo.buyingFor;
    this.group = buyingForInfo.group;
  },
  data() {
    return {
      wishlist: [],
      buyingFor: "",
      group: ""
    };
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

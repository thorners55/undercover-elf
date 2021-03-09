<template>
  <div>
    <div class="top-of-page">
      <img src="../assets/cabin.svg" id="logo" width="50rem" />
      <h2>Welcome home!</h2>
      <p class="instructions">
        To view your wishlist, the wishlist of the person you are buying for,
        and group information such as budget and date of gift exchange, click on
        a group below.
      </p>

      <h2>You are a member of:</h2>
      <ul>
        <li v-for="group in groups" :key="group.groupId">
          <router-link :to="`/groups/${group.groupId}/profile`">{{ group.name }}</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "AllGroups",
  computed: {
    ...mapState("demo", ["groups"])
  }
};
</script>

<style scoped>
button {
  margin: 1ch;
}

img {
  display: block;
  margin: auto;
}

.instructions {
  width: 60%;
  margin: 2ch auto;
}

@media (max-width: 900px) {
  .instructions {
    width: 75%;
  }
}
</style>

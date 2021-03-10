<template>
  <div>
    <div class="top-of-page">
      <img src="../assets/cabin.svg" id="logo" width="50rem" />
      <h2>Welcome home!</h2>
      <div class="demo-message">
        <p>
          <b>Please note:</b> This is a demo version of the app, so some functionality is not available, such as joining a group. Refreshing the page will lose all changes you make.
          To see an example of the working app, go to
          <a
            :href="`https://stephanie-thornley.netlify.app`"
          >https://stephanie-thornley.netlify.app</a>
        </p>
      </div>
      <p class="instructions">
        To view your wishlist, the wishlist of the person you are buying for,
        and group information such as budget and date of gift exchange, click on
        a group below.
      </p>

      <button type="button" disabled="true">Join existing group</button>
      <button type="button" v-on:click="$router.push('/groups/create')">Create new group</button>

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

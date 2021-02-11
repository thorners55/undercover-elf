<template>
  <div>
    <LogOut />
    <Loading v-if="userGroupsLoading" />
    <div v-if="!userGroupsLoading" class="top-of-page">
      <img src="../assets/cabin.svg" id="logo" width="50rem" />
      <h2>Welcome home!</h2>
      <p class="instructions">
        To view your wishlist, the wishlist of the person you are buying for,
        and group information such as budget and date of gift exchange, click on
        a group below.
      </p>
      <p class="instructions">
        To join an existing group, click the button below and input an
        invitation ID, or follow a link sent to you by a group admin.
      </p>
      <button type="button" v-on:click="$router.push('/groups/join')">Join existing group</button>
      <button type="button" v-on:click="$router.push('/groups/create')">Create new group</button>

      <h2>You are a member of:</h2>
      <p v-if="groups.length < 1">You have no groups yet!</p>
      <ul>
        <li v-for="group in groups" :key="group.sk">
          <router-link :to="`/groups/${group.groupId}/profile`">
            {{
            group.groupName
            }}
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Loading from "./Loading.vue";
import LogOut from "./LogOut.vue";
import { mapActions, mapState } from "vuex";

export default {
  name: "AllGroups",
  components: {
    Loading
  },
  methods: {
    ...mapActions("profile", ["fetchUserProfile"])
  },
  computed: {
    ...mapState("loggedIn", ["userId"]),
    ...mapState("profile", ["groups", "userGroupsLoading"])
  },
  created() {
    this.fetchUserProfile(this.userId);
  },
  data() {
    return {};
  }
};
</script>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 2ch;
}

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

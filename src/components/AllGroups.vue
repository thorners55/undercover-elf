<template>
  <div class="top-of-page">
    <img src="../assets/cabin.svg" id="logo" width="50rem" />
    <h2>Welcome home!</h2>
    <button type="button" v-on:click="$router.push('/groups/join')">Join existing group</button>
    <button type="button" v-on:click="$router.push('/groups/create')">Create new group</button>
    <p v-if="groups.length < 1">You have no groups yet!</p>
    <p>Click a group name to view the group information</p>
    <h2>You are a member of:</h2>
    <ul>
      <li v-for="group in groups" :key="group.sk">
        <router-link :to="`/groups/${group.groupId}/profile`">{{ group.groupName }}</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "AllGroups",
  methods: {
    ...mapActions("profile", ["fetchUserProfile"])
  },
  computed: {
    ...mapState("loggedIn", ["userId"]),
    // ...mapState("groups", ["groups"]),
    ...mapState("profile", ["groups"])
  },
  created() {
    console.log("AllGroups created");
    //this.fetchGroups(this.userId);
    this.fetchUserProfile(this.userId);
  },
  data() {
    return {};
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
</style>

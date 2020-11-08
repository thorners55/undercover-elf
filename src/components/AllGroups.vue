<template>
  <div>
    <h2>Groups</h2>
    <router-link to="/groups/join">Join existing group</router-link>
    <router-link to="/groups/create">Create new group</router-link>
    <p v-if="groups.length < 1">You have no groups yet!</p>

    <ul>
      <li v-for="group in groups" :key="group.sk">
        <router-link :to="`/groups/${group.groupId}/profile`">
          {{ group.groupName }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "AllGroups",
  methods: {
    ...mapActions("profile", ["fetchUserProfile"]),
  },
  computed: {
    ...mapState("loggedIn", ["userId"]),
    // ...mapState("groups", ["groups"]),
    ...mapState("profile", ["groups"]),
  },
  created() {
    console.log("AllGroups created");
    //this.fetchGroups(this.userId);
    this.fetchUserProfile(this.userId);
  },
  data() {
    return {};
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

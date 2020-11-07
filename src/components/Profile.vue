<template>
  <div>
    <h2>My account</h2>
    <p>{{ name }}</p>
    <h3>Admin</h3>
    <ul>
      <li v-for="group in groupAdmin" :key="group.groupId">
        <router-link :to="`/groups/${group.groupId}/profile`">{{ group.groupName }}</router-link>
        <router-link :to="`/groups/edit?groupId=${group.groupId}`">Group settings</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

// ADD CHANGE PASSWORD?

export default {
  name: "Profile",
  methods: {
    ...mapActions("profile", ["fetchUserProfile"])
  },
  computed: {
    ...mapState("loggedIn", ["userId", "name", "groups"]),
    ...mapGetters("profile", ["groupAdmin"])
  },
  created() {
    this.fetchUserProfile(this.userId);
  }
};
</script>

<style scoped></style>

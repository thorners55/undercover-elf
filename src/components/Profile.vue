<template>
  <div>
    <h2>My account</h2>
    <p>Name: {{ name }}</p>
    <p>Email: {{ email }}</p>

    <h3>Group admin for:</h3>
    <p v-if="groupAdmin.length < 1">You are not admin for any groups!</p>
    <ul>
      <li v-for="group in groupAdmin" :key="group.groupId">
        <router-link :to="`/groups/${group.groupId}/profile`">{{
          group.groupName
        }}</router-link>
        <router-link :to="`/groups/edit?groupId=${group.groupId}`"
          >Group settings</router-link
        >
      </li>
    </ul>
  </div>
</template>

<script>
import { Auth } from "aws-amplify";
import { mapState, mapGetters, mapActions } from "vuex";

// ADD CHANGE PASSWORD?

export default {
  name: "Profile",
  methods: {
    async getEmail() {
      const userEmail = await Auth.currentUserInfo();
      this.email = userEmail.attributes.email;
    },
    ...mapActions("profile", ["fetchUserProfile"]),
  },
  computed: {
    ...mapState("loggedIn", ["userId", "name", "groups"]),
    ...mapGetters("profile", ["groupAdmin"]),
  },
  created() {
    this.fetchUserProfile(this.userId);
    this.getEmail();
  },
  data() {
    return {
      email: "",
    };
  },
};
</script>

<style scoped></style>

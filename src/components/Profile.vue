<template>
  <div>
    <h2>My profile</h2>
    <p>{{ name }}</p>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

// ADD CHANGE PASSWORD?

export default {
  name: "Profile",
  methods: {
    ...mapActions("profile", ["fetchUserProfile"]),
  },
  computed: {
    ...mapState("loggedIn", ["userId", "name", "groups"]),
  },
  created() {
    this.fetchUserProfile(this.userId);
  },
};
</script>

<style></style>

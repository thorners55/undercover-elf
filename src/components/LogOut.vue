<template>
  <div>
    <p>You are logged in</p>
    <button v-on:click="signOut">Log out</button>
  </div>
</template>

<script>
import { Auth } from "aws-amplify";
import { mapState, mapActions } from "vuex";

export default {
  name: "LogOut",
  computed: {
    ...mapState("loggedIn", ["loggedIn", "name"]),
    ...mapActions("loggedIn", ["logIn", "logOut"])
  },
  methods: {
    async signOut() {
      var result = confirm("Are you sure you want to log out?");
      if (result) {
        if (this.$route.path !== "/") {
          this.$router.push({ path: "/" });
        }
        try {
          await Auth.signOut();
          this.logOut();
        } catch (error) {
          // nothing here because console logging or alerting an error shows "_this.logOut is not a function", something to do with the binding, I think
          return;
        }
      }
    }
  }
};
</script>

<style scoped>
p {
  margin-bottom: 0.2rem;
  margin-top: 0.2rem;
}

button {
  padding: 0.4rem;
  margin-top: 1ch;
}
</style>

<template>
  <div>
    <p v-if="loggedIn">Hello, {{ name }}!</p>
    <p v-if="loggedIn">You are logged in</p>
    <button v-if="loggedIn" v-on:click="signOut">Sign out</button>
    <p v-if="!loggedIn">Sign in</p>
    <button v-if="!loggedIn" v-on:click="signIn">Sign in</button>
    <p v-if="!loggedIn">Don't have an account?</p>
    <button v-if="!loggedIn">Sign up here</button>
  </div>
</template>

<script>
import { Auth } from "aws-amplify";
var aws = require("aws-sdk");
import { mapState, mapActions } from "vuex";

//  <button v-on:click="confirmSignUp">Confirm sign up</button>

export default {
  name: "SignIn",
  props: {},
  created() {},
  computed: mapState(["isLoggedIn", "userId"]),
  mounted() {
    if (localStorage.userId) {
      this.userId = localStorage.userId;
      this.loggedIn = true;
      this.name = localStorage.name;
    }
  }, // NEED TO UPDATE STATE WHEN LOG IN
  methods: {
    ...mapActions(["logIn"]),
    async signIn() {
      try {
        aws.config.update({ region: "eu-west-2" });
        let user = await Auth.signIn("ENTER EMAIL HERE", "ENTER PASSWORD HERE");
        // hardcoded for dev purposes
        console.log(user, user.username, user.attributes.name);
        this.name = user.attributes.name;
        this.userId = user.username;
        this.loggedIn = true;
        //this.fetchGroups(user.username);

        // prod
        console.log(this.name);
        let payload = { userId: this.userId, name: this.name };
        this.logIn(payload);
      } catch (error) {
        console.log("error signing in", error);
      }
    },
    async signUp() {
      try {
        const { user } = await Auth.signUp({
          username: "EMAIL HERE",
          password: "PASSWORD HERE",
          attributes: {
            name: "NAME HERE",
          },
          // hardcoded for testing lambda
        });
        console.log(user, "sign up");
      } catch (error) {
        console.log("error signing up:", error);
      }
    },

    async confirmSignUp() {
      try {
        const userConfirm = await Auth.confirmSignUp(
          "EMAIL HERE",
          "VERIFICATION CODE HERE"
        );
        console.log(userConfirm, "user confirm");
      } catch (error) {
        console.log("error confirming sign up", error);
      }
    },
    async signOut() {
      try {
        await Auth.signOut();
        this.loggedIn = false;
        console.log("signed out");
      } catch (error) {
        console.log("error signing out: ", error);
      }
    },
  },
  data() {
    return {
      userId: "",
      loggedIn: "",
      name: "",
    };
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

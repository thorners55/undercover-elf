<template>
  <div>
    <div v-if="loggedIn">
      <p>Hello, {{ name }}!</p>
      <p>You are logged in</p>
      <button v-on:click="signOut">Sign out</button>
    </div>
    <div v-if="!loggedIn">
      <button v-on:click="signIn">click</button>
      <div v-if="!signingUp">
        <p>Sign in</p>
        <form id="sign-in" v-on:keyup.enter="signIn">
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="signInEmail" />
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="signInPassword" />
        </form>
        <button type="submit" v-on:click="signIn">Sign in</button>

        <p>Don't have an account?</p>
      </div>
      <button v-if="!signingUp" v-on:click="signUpForm">Create an account</button>
      <div v-if="signingUp">
        <form v-on:keyup.enter="signIn">
          <label for="name">Name:</label>
          <input type="text" id="name" v-model="signUpName" />
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="signUpEmail" />
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="signUpPassword" />
        </form>
        <button v-on:click="createAccount">Create account</button>

        <button v-on:click="signUpForm">Back to sign in</button>
      </div>
      <div v-if="confirmingSignUp">
        <form v-on:keyup.enter="signIn">
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="confirmSignUpEmail" />
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="confimSignUpCode" />
          <button v-on:click="confirmSignUp">Confirm sign up</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { Auth } from "aws-amplify";
var aws = require("aws-sdk");
import { mapActions, mapState } from "vuex";

//  <button v-on:click="confirmSignUp">Confirm sign up</button>

export default {
  name: "SignIn",
  props: {},
  computed: {
    ...mapState("loggedIn", ["loggedIn"]),
    ...mapState("loggedIn", ["name"])
  },
  // NEED TO UPDATE STATE WHEN LOG IN
  methods: {
    ...mapActions("loggedIn", ["logIn", "logOut"]),
    async signIn() {
      console.log("beginning of signIn");
      try {
        aws.config.update({ region: "eu-west-2" });
        let user = await Auth.signIn(this.signInEmail, this.signInPassword);
        console.log("after signIn");
        let payload = { userId: user.username, name: user.attributes.name };
        this.logIn(payload);
        this.signInEmail = "";
        this.signInPassword = "";
      } catch (error) {
        console.log("error signing in", error);
      }
    },
    signUpForm() {
      this.signingUp = !this.signingUp;
    },
    async createAccount() {
      console.log(this.signUpName, this.signUpEmail, this.signUpPassword);
      try {
        const { user } = await Auth.signUp({
          username: this.signUpEmail,
          password: this.signUpPassword,
          attributes: {
            name: this.signUpName
          }
        });
        this.confirmingSignUp = true;
        this.signUpEmail = "";
        (this.signUpPassword = ""), (this.signUpName = "");
        console.log(user, "sign up");
      } catch (error) {
        console.log("error signing up:", error);
      }
    },

    async confirmSignUp() {
      try {
        const userConfirm = await Auth.confirmSignUp(
          this.confirmSignUpEmail,
          this.confirmSignUpCode
        );
        console.log(userConfirm, "user confirm");
        (this.confirmSignUpEmail = ""), (this.confirmSignUpCode = "");
      } catch (error) {
        console.log("error confirming sign up", error);
      }
    },
    async signOut() {
      try {
        await Auth.signOut();
        localStorage.removeItem("userId");
        localStorage.removeItem("name");
        localStorage.loggedIn = false;
        this.logOut();
        console.log("signed out");
      } catch (error) {
        console.log("error signing out: ", error);
      }
    }
  },
  data() {
    return {
      signingUp: false,
      confirmingSignUp: false,
      signInEmail: "",
      signInPassword: "",
      signUpName: "",
      signUpEmail: "",
      signUpPassword: "",
      confirmSignUpEmail: "",
      confirmSignUpCode: ""
    };
  }
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

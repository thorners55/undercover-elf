<template>
  <div>
    <p>Hi {{ name }}</p>
    <button v-on:click="signIn">Sign in</button>
    <button v-on:click="signOut">Sign out</button>
    <button v-on:click="signUp">Sign up</button>
    <button v-on:click="confirmSignUp">Confirm sign in</button>
  </div>
</template>

<script>
import { Auth } from "aws-amplify";
var aws = require("aws-sdk");
var ddb = new aws.DynamoDB({ apiVersion: "2012-10-08" });

aws.config.update({ region: "eu-west-2" });

export default {
  name: "SignIn",
  props: {},
  methods: {
    async signIn() {
      try {
        const user = await Auth.signIn("SIGN IN EMAIL", "SIGN IN PASSWORD");
        // hardcoded for dev purposes
        console.log(user, user.username, user.attributes.name);
        //name = user.attributes.name;

        let ddbParams = {
          TableName: "undercover-elf-test",
          Key: {
            PK: { S: `user_${user.username}` },
            SK: { S: "group_1" },
          },
        };
        try {
          const response = await ddb.getItem(ddbParams).promise();
          console.log("Success");
          console.log(response);
        } catch (err) {
          console.log("Error", err);
        }
      } catch (error) {
        console.log("error signing in", error);
      }
    },
    async signUp() {
      try {
        const { user } = await Auth.signUp({
          username: "ENTER EMAIL",
          password: "ENTER PASSWORD",
          attributes: {
            name: "ENTER NAME e.g. Steven Banks",
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
          "stephanieeeet@hotmail.com",
          "641514"
        );
        console.log(userConfirm, "user confirm");
      } catch (error) {
        console.log("error confirming sign up", error);
      }
    },
    async signOut() {
      try {
        await Auth.signOut();
        console.log("signed out");
      } catch (error) {
        console.log("error signing out: ", error);
      }
    },
  },
  data() {
    return {
      name: "Stephanie",
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

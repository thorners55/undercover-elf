<template>
  <div></div>
</template>

<script>
import { Auth } from "aws-amplify";
var aws = require("aws-sdk");
aws.config.update({ region: "eu-west-2" });
//var ddb = new aws.DynamoDB({ apiVersion: "2012-10-08" });
import { onAuthUIStateChange } from "@aws-amplify/ui-components";

aws.config.update({ region: "eu-west-2" });

export default {
  name: "SignIn",
  props: {},
  created() {
    onAuthUIStateChange((authState, user) => {
      this.user = user;
      this.authState = authState;
      console.log(user, "<---- user");
    });
  },
  methods: {
    async signIn() {
      try {
        aws.config.update({ region: "eu-west-2" });
        const user = await Auth.signIn("EMAIL HERE", "PASSWORD HERE!");
        // hardcoded for dev purposes
        console.log(user, user.username, user.attributes.name);
        //name = user.attributes.name;

        /*let ddbParams = {
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
        }*/
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
        console.log("signed out");
      } catch (error) {
        console.log("error signing out: ", error);
      }
    },
  },
  data() {
    return {
      user: undefined,
      authState: undefined,
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

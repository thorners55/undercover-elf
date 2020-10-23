<template>
  <div id="app">
    <h1>Undercover Elf</h1>
    <p>Hi {{ this.user }}</p>
    <button v-on:click="signIn">Sign in</button>
    <button v-on:click="signOut">Sign out</button>
    <button v-on:click="signUp">Sign up</button>
    <button v-on:click="confirmSignUp">Confirm sign in</button>
    <button v-on:click="currentState">Current state</button>
    <button v-on:click="getUserData">Get user data</button>
    <button v-on:click="getGroupData">Get group data</button>
    <button v-on:click="getUserAllGroupsData">
      Get user all groups data
    </button>
    <button v-on:click="getUserSpecificGroupData">
      Get user specific group data
    </button>
    <button v-on:click="postNewGroup">Post new group</button>
    <button v-on:click="postUserInGroup">Post user in group</button>
    <button v-on:click="deleteUserInGroup">Delete user in group</button>
    <button v-on:click="updateUserInGroup">Update user in group</button>
    <NavBar />
  </div>
</template>

<script>
import { API } from "aws-amplify";
//import SignIn from "./components/SignIn.vue";
import NavBar from "./components/NavBar.vue";
import { Auth } from "aws-amplify";
import { v4 as uuidv4 } from "uuid";

var aws = require("aws-sdk");

export default {
  name: "App",
  components: {
    // SignIn,
    NavBar,
  },

  methods: {
    getUserData: function() {
      console.log("getUserData");
      API.get("undercoverElfApi", "/users/1234/profile", {})
        .then((response) => {
          console.log(response);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getGroupData: function() {
      console.log("getGroupData");
      API.get("undercoverElfApi", "/groups?id=1", {})
        .then((response) => {
          console.log(response);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getUserAllGroupsData: function() {
      console.log("getUserAllGroupsData");
      API.get("undercoverElfApi", "/users/1234/groups", {})
        .then((items) => {
          console.log(items);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getUserSpecificGroupData: function() {
      console.log("getUserSpecificGroup");
      API.get("undercoverElfApi", "/users/1234/groups?groupId=2", {})
        .then((items) => {
          console.log(items);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    postNewGroup: function() {
      console.log("postNewGroup");
      const groupId = uuidv4();
      console.log(groupId);
      API.post("undercoverElfApi", "/groups", {
        body: {
          name: "Gym pals",
          admin: "Kathryn Thornley",
          exchange: "26/12/20",
          members: [{ id: "user_1235", name: "Kathryn Thornley" }],
          pk: groupId,
        },
      })
        .then((response) => {
          console.log(response);
          this.postUserInGroup(
            response.body.admin,
            "1235",
            `${response.body.group}`
          );
        })
        .catch((err) => {
          console.log(err);
        });
    },
    postUserInGroup: function(name, userId, groupId) {
      console.log("postUserInGroup");
      console.log(name, userId, groupId);
      API.post(
        "undercoverElfApi",
        `/users/${userId}/groups?groupId=${groupId}`,
        {
          body: {
            admin: 0,
            name,
            wishlist: [],
          },
        }
      )
        .then((response) => {
          console.log(response);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    deleteUserInGroup: function() {
      console.log("deleteUserInGroup");
      API.del("undercoverElfApi", "/users/1234/groups?groupId=3")
        .then((response) => {
          console.log(response);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    updateUserInGroup: function() {
      console.log("updateUserInGroup");
      API.post("undercoverElfApi", "/users/1234/groups?groupId=3", {
        body: {
          wishlist: [
            { description: "Green helmet", url: "thehelmetstore.co.uk" },
          ],
        },
      })
        .then((response) => {
          console.log(response);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    async currentState() {
      try {
        let user = await Auth.currentAuthenticatedUser();
        console.log(user);
      } catch (err) {
        console.log(err);
      }
    },
    async signIn() {
      try {
        aws.config.update({ region: "eu-west-2" });
        let user = await Auth.signIn("EMAIL HERE", "PASSWORD HERE");
        // hardcoded for dev purposes
        console.log(user, user.username, user.attributes.name);
        this.user = user.attributes.name;

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
      user: {},

      /*formFieldsSignUp: [
        {
          type: "name",
          label: "Full name *",
          placeholder: "e.g. Nicholas Claus",
          required: true,
        },
        {
          type: "email",
          label: "Email *",
          placeholder: "nick@northpole.com",
          required: true,
        },
        { type: "password", label: "Password *", required: true },
      ],
      formFieldsSignIn: [
        {
          type: "email",
          label: "Email",
          placeholder: "nick@northpole.com",
          required: true,
        },
        { type: "password", label: "Password", required: true },
      ], */
    };
  },
  /* created() {
    onAuthUIStateChange((state, user) => {
      if (state === AuthState.SignedIn) {
        this.user = user;
        console.log(user, "<---- user");
      }
      if (!user) {
        console.log("user is not signed in...");
      }
    });
  },*/
};
</script>

<style>
html {
  background-color: rgb(128, 228, 181);
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

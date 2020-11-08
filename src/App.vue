<template>
  <div id="app">
    <img src="./assets/elf.svg" width="100px" />

    <h1>Undercover Elf</h1>
    <button v-on:click="currentState">Current state</button>
    <button v-on:click="getUserData">Get user data</button>
    <button v-on:click="getGroupData">Get group data</button>
    <button v-on:click="getUserAllGroupsData">Get user all groups data</button>
    <button v-on:click="getUserSpecificGroupData">Get user specific group data</button>
    <button v-on:click="postNewGroup">Post new group</button>
    <button v-on:click="postUserInGroup">Post user in group</button>
    <button v-on:click="deleteUserInGroup">Delete user in group</button>
    <button v-on:click="updateUserInGroup">Update user in group</button>
    <button v-on:click="updateGroup">Update group info</button>
    <button v-on:click="deleteGroup">Delete group</button>
    <button v-on:click="drawNames">Draw names</button>

    <SignIn />
    <NavBar v-if="loggedIn" />
    <router-view v-if="loggedIn">
      <Home />
      <Profile />
      <AllGroups />
      <CreateGroup />
      <JoinGroup />
      <GroupPage />
      <AdminEditGroup />
      <WishlistPage />
      <Wishlist />
    </router-view>
  </div>
</template>

<script>
import { API } from "aws-amplify";
import { Auth } from "aws-amplify";
import { v4 as uuidv4 } from "uuid";
import { mapState } from "vuex";
import Home from "./components/Home.vue";
import SignIn from "./components/SignIn.vue";
import NavBar from "./components/NavBar.vue";
import Profile from "./components/Profile.vue";
import AllGroups from "./components/AllGroups.vue";
import CreateGroup from "./components/CreateGroup.vue";
import AdminEditGroup from "./components/AdminEditGroup.vue";
import JoinGroup from "./components/JoinGroup.vue";
import Wishlist from "./components/Wishlist.vue";
import WishlistPage from "./components/WishlistPage.vue";

export default {
  name: "App",
  components: {
    Home,
    NavBar,
    SignIn,
    Profile,
    AllGroups,
    CreateGroup,
    JoinGroup,
    AdminEditGroup,
    WishlistPage,
    Wishlist
  },
  computed: mapState("loggedIn", ["loggedIn"]),
  mounted() {
    console.log(this.loggedIn);
  },
  methods: {
    getUserData: function() {
      console.log("getUserData");
      API.get("undercoverElfApi", "/users/1234/profile", {})
        .then(response => {
          console.log(response);
        })
        .catch(err => {
          console.log(err);
        });
    },
    getGroupData: function() {
      console.log("getGroupData");
      API.get("undercoverElfApi", "/groups?id=1", {})
        .then(response => {
          console.log(response);
        })
        .catch(err => {
          console.log(err);
        });
    },
    getUserAllGroupsData: function() {
      console.log("getUserAllGroupsData");
      API.get("undercoverElfApi", "/users/1234/groups", {})
        .then(items => {
          console.log(items);
        })
        .catch(err => {
          console.log(err);
        });
    },
    getUserSpecificGroupData: function() {
      console.log("getUserSpecificGroup");
      API.get("undercoverElfApi", "/users/1234/groups?groupId=2", {})
        .then(items => {
          console.log(items);
        })
        .catch(err => {
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
          pk: groupId
        }
      })
        .then(response => {
          console.log(response);
          this.postUserInGroup(
            response.body.admin,
            "1235",
            `${response.body.group}`
          );
        })
        .catch(err => {
          console.log(err, "postNewGroup error");
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
            admin: 1,
            name,
            wishlist: []
          }
        }
      )
        .then(response => {
          console.log(response);
          /* response is an array of items that have been updated */
        })
        .catch(err => {
          console.log(err, "postUserInGroup error");
        });
    },
    deleteUserInGroup: function() {
      console.log("deleteUserInGroup");
      API.del("undercoverElfApi", "/users/1234/groups?groupId=3")
        .then(response => {
          console.log(response);
        })
        .catch(err => {
          console.log(err);
        });
    },
    updateUserInGroup: function() {
      console.log("updateUserInGroup");
      API.post("undercoverElfApi", "/users/1234/groups?groupId=3", {
        body: {
          wishlist: [
            { description: "Green helmet", url: "thehelmetstore.co.uk" }
          ]
        }
      })
        .then(response => {
          console.log(response);
        })
        .catch(err => {
          console.log(err);
        });
    },
    updateGroup: function() {
      console.log("updateGroup");
      API.patch("undercoverElfApi", "/groups?id=2", {
        body: {
          name: "Thornley Family",
          exchange: "9/12/20"
        }
      })
        .then(response => {
          console.log(response);
        })
        .catch(err => {
          console.log(err);
        });
    },
    deleteGroup: function() {
      API.del("undercoverElfApi", "/groups", {})
        .then(response => {
          console.log(response);
        })
        .catch(err => {
          console.log(err);
        });
    },
    drawNames: function() {
      console.log("drawNames");
      API.get("undercoverElfApi", "/draw-groups?id=2", {})
        .then(({ body }) => {
          console.log(body, typeof body);
          let copyResponse = body.map(x => x);
          this.assignNames(body, copyResponse, "2");
        })
        .catch(err => {
          console.log(err);
        });
    },
    assignNames: async function(response, copyResponse, groupId) {
      console.log("assignNames");

      function randomNum(length) {
        return Math.floor(Math.random() * (length - 0) + 0);
      }

      function pickNames() {
        console.log("pickNames");
        let length = copyResponse.length;
        let count = 0;
        for (let i = 0; i < response.length; i++) {
          let index = randomNum(length);
          let buyFor = copyResponse[index];
          // here to make sure there are no infinite loops
          if (count > 15) {
            console.log("exceed max call");
            break;
          }
          //

          // if person picks their own name and it is NOT the last iteration, try again
          // if person picks their own name and it IS the last iteration, pick a random person in the array who has already been assigned a person to buy for, take this assigned person and give it to the person who had picked their own name. Then, the random person who was picked is now buying for the person who picked their own name
          if (response[i].pk === buyFor.pk) {
            console.log("inside if");

            if (i === response.length - 1) {
              console.log("inside nested if");

              // swap two assignments
              const random = randomNum(response.length - 1);

              let randomBF = response[random].buyingForUserId;
              let currentIterationName = response[i].name;

              if (randomBF === currentIterationName) {
                console.log("inside second nested if");
                i = i - 1;
                count++;
                continue;
              } else {
                console.log(response[random].buyingForName);
                console.log(random, response[random]);
                // Last person to pick someone buying for whoever random person had
                response[i].buyingForName = response[random].buyingForName;
                response[i].buyingForUserId = response[random].buyingForUserId;
                // Random person now buying for last person to pick someone
                response[random].buyingForName = response[i].name;
                response[random].buyingForUserId = response[i].pk;
              }
            } else {
              i = i - 1;
              count++;
              continue;
            }
          } else {
            response[i].buyingForName = buyFor.name;
            response[i].buyingForUserId = buyFor.pk;
            copyResponse.splice(index, 1);
            length = length - 1;
          }
        }
        return;
      }

      await pickNames();
      console.log("patch");
      API.patch("undercoverElfApi", `/draw-names?id=${groupId}`, {
        body: response
      })
        .then(response => {
          console.log(response);
        })
        .catch(err => {
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
    }
  },
  data() {
    return {
      name: ""
    };
  }
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

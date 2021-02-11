<template>
  <div id="app">
    <Header />

    <main id="main-signin-nav">
      <SignIn />
      <router-view v-if="loggedIn">
        <AllGroups />
        <Profile />
        <CreateGroup />
        <JoinGroup />
        <GroupPage />
        <AdminEditGroup />
        <MyWishlist />
        <BuyingForWishlist />
      </router-view>
    </main>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import Header from "./components/Header.vue";
import SignIn from "./components/SignIn.vue";
import Profile from "./components/Profile.vue";
import AllGroups from "./components/AllGroups.vue";
import CreateGroup from "./components/CreateGroup.vue";
import AdminEditGroup from "./components/AdminEditGroup.vue";
import JoinGroup from "./components/JoinGroup.vue";
import MyWishlist from "./components/MyWishlist.vue";
import BuyingForWishlist from "./components/BuyingForWishlist.vue";

export default {
  name: "App",
  components: {
    Header,
    SignIn,
    Profile,
    AllGroups,
    CreateGroup,
    JoinGroup,
    AdminEditGroup,
    BuyingForWishlist,
    MyWishlist
  },
  computed: mapState("loggedIn", ["loggedIn"]),
  methods: {
    ...mapActions("profile", ["fetchUserProfile"]),
    ...mapActions("loggedIn", ["logIn", "logOut"])
  },
  created() {
    if (this.loggedIn) {
      this.fetchUserProfile(this.userId);
    }
    document.addEventListener("beforeunload", this.logOut());
  }
};
</script>

<style>
html {
  background-color: #80e4b5;
}

#app {
  font-family: "Bubbleboddy Regular", sans-serif;
  font-size: 62.5%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 3rem;
}

a,
a:visited {
  color: #2c3e50;
}

a:hover {
  color: #fefefa;
}

@font-face {
  font-family: "Bubbleboddy Regular";
  src: url("./assets/Bubbleboddy-Regular.ttf") format("truetype");
}

@font-face {
  font-family: "Bubbleboddy Light";
  src: url("./assets/bubbleboddy/Bobbleboddy_light.ttf") format("truetype");
}

@import url("https://fonts.googleapis.com/css2?family=Quicksand:wght@500&display=swap");

h1 {
  font-family: "Bubbleboddy Regular", sans-serif;
  font-size: 3rem;
  margin: 0.5rem;
}

ul {
  list-style-type: none;
  padding: 0;
}

.top-of-page {
  margin-top: 5ch;
}

#main-signin-nav {
  font-size: 1.2rem;
  font-family: "Quicksand", sans-serif;
}

button {
  background-color: #f8ca4f;
  color: #2c3e50;
  padding: 1ch;
  font-size: 1rem;
  font-family: "Quicksand", sans-serif;
  border-radius: 0.5rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
}

button:hover {
  cursor: pointer;
  background-color: #fefefa;
}

button:disabled {
  background-color: rgb(206, 203, 203);
  color: grey;
}

button:disabled:hover {
  cursor: default;
}

input {
  align-self: center;
  height: 3ch;
  font-size: 1rem;
}

input[type="checkbox"] {
  transform: scale(1.5);
  margin-right: 1ch;
}

.message {
  margin-left: 30%;
  margin-right: 30%;
  font-weight: bold;
  color: #a81111;
}

a.back-to {
  margin-top: 1ch;
  display: block;
}

@media (max-width: 900px) {
  form {
    display: block;
    margin: 0;
    margin: auto;
    width: auto;
  }

  label {
    text-align: center;
    display: block;
  }

  a.router-link-active.back-to-home {
    display: block;
    margin: 2ch;
  }
}
</style>

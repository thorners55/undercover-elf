<template>
  <div id="app">
    <img src="./assets/elf.svg" id="logo" width="90rem" />

    <h1>Undercover Elf</h1>

    <div id="main-signin-nav">
      <SignIn />
      <NavBar v-if="loggedIn" />
      <main>
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
      </main>
    </div>
  </div>
</template>

<script>
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
  }
};
</script>

<style>
html {
  background-color: rgb(128, 228, 181);
}

#app {
  font-family: "Bubbleboddy Regular";
  font-size: 62.5%;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 3rem;
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
  font-family: "Bubbleboddy Regular";
  font-size: 3rem;
  margin: 0.5rem;
}

#main-signin-nav {
  font-size: 1.2rem;
  font-family: "Quicksand", sans-serif;
}
</style>

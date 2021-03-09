<template>
  <div id="app">
    <NavBar />
    <main>
      <router-view>
        <AllGroups />
        <Profile />
        <GroupPage />
      </router-view>
    </main>
  </div>
</template>

<script>
import NavBar from "./components/NavBar.vue";
import AllGroups from "./components/AllGroups.vue";
import Profile from "./components/Profile.vue";
import GroupPage from "./components/GroupPage.vue";

export default {
  name: "App",
  components: {
    NavBar,
    AllGroups,
    Profile,
    GroupPage
  }
};
</script>

<style>
html {
  background-color: #80e4b5;
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

main {
  font-size: 1.2rem;
  font-family: "Quicksand", sans-serif;
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

.top-of-page {
  margin-top: 5ch;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin: 1ch;
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
</style>

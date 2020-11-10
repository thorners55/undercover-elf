<template>
  <div id="header">
    <div id="grid">
      <span></span>
      <div>
        <img src="../assets/elf.svg" id="logo" width="100rem" />
        <h1>Undercover Elf</h1>
      </div>

      <LogOut v-if="loggedIn" id="logOut" />
    </div>

    <NavBar v-if="loggedIn" />
  </div>
</template>

<script>
import { mapState } from "vuex";
import NavBar from "./NavBar.vue";
import LogOut from "./LogOut.vue";

export default {
  name: "Header",
  components: {
    NavBar,
    LogOut,
  },
  computed: mapState("loggedIn", ["loggedIn"]),
};
</script>

<style>
#grid {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
}

#logOut {
  font-size: 1.1rem;
}

@media (max-width: 900px) {
  #grid {
    display: block;
  }

  #logOut {
    display: none;
  }
}
</style>

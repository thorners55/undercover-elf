<template>
  <div class="top-of-page">
    <img src="../assets/gingerbread-man.svg" id="logo" width="50rem" />
    <h2>My account</h2>
    <Loading v-if="loadingUserProfile" />
    <div v-if="!loadingUserProfile">
      <div id="accountLogOut">
        <LogOut id="accountLogOut" />
        <h3>Profile</h3>
      </div>
      <p>
        <b>Name:</b>
        {{ name }}
      </p>
      <p>
        <b>Email:</b>
        {{ email }}
      </p>

      <p v-if="groupAdmin.length > 0" id="draw-names-instruction">
        To draw names for groups, go to the group's page.
      </p>
      <h3>Group admin for</h3>
      <p v-if="groupAdmin.length < 1">You are not admin for any groups!</p>
      <ul>
        <li v-for="group in groupAdmin" :key="group.groupId">
          <router-link :to="`/groups/${group.groupId}/profile`">{{
            group.groupName
          }}</router-link>

          <button
            v-on:click="$router.push(`/groups/edit?groupId=${group.groupId}`)"
          >
            <span class="settings">
              <i class="fas fa-cog"></i>
            </span>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import Loading from "./Loading.vue";
import { Auth } from "aws-amplify";
import { mapState, mapGetters, mapActions } from "vuex";
import LogOut from "./LogOut.vue";

// ADD CHANGE PASSWORD?

export default {
  name: "Profile",
  components: {
    Loading,
    LogOut,
  },
  methods: {
    async getEmail() {
      const userEmail = await Auth.currentUserInfo();
      this.email = userEmail.attributes.email;
    },
    ...mapActions("profile", ["fetchUserProfile"]),
  },
  computed: {
    ...mapState("loggedIn", ["userId", "name"]),
    ...mapState("profile", ["loadingUserProfile", "groups"]),
  },
  created() {
    this.fetchUserProfile(this.userId);
    this.getEmail();
    this.groupAdmin = this.groups.filter((group) => {
      return group.admin;
    });
  },
  data() {
    return {
      email: "",
      groupAdmin: [],
    };
  },
};
</script>

<style scoped>
#accountLogOut {
  display: none;
}

.settings {
  font-size: 1.2rem;
}

button {
  margin-left: 1ch;
}

#draw-names-instruction {
  font-size: 1.5rem;
}

@media (max-width: 900px) {
  #accountLogOut {
    display: block;
    margin: 3ch 0;
  }
}
</style>

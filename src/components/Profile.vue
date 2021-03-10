<template>
  <div class="top-of-page">
    <img src="../assets/gingerbread-man.svg" id="logo" width="50rem" />
    <h2>My account</h2>
    <div>
      <p>
        <b>Name:</b>
        {{profile.name}}
      </p>
      <p>
        <b>Email:</b>
        {{profile.email}}
      </p>

      <h3>Group admin for:</h3>
      <ul>
        <li v-for="group in adminFor" :key="group.groupId">
          <router-link :to="`/groups/${group.groupId}/profile`">{{ group.name }}</router-link>
          <button
            v-if="group.admin"
            v-on:click="$router.push(`/groups/edit?groupId=${group.groupId}`)"
          >
            <span>
              <i class="fas fa-cog"></i>
            </span>
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from "vuex";

export default {
  name: "Profile",
  computed: {
    ...mapState("demo", ["profile"]),
    ...mapGetters("demo", ["getAdminFor"])
  },
  created() {
    this.adminFor = this.getAdminFor();
  },
  data() {
    return {
      adminFor: []
    };
  }
};
</script>

<style scoped>
h3 {
  margin: 0;
}

button {
  margin-left: 1ch;
  margin-top: 0;
}
</style>

<template>
  <div>
    <h2>Join group</h2>
    <div v-show="findingGroup">
      <!-- hides the input when begin search -->
      <form v-on:submit.prevent>
        <label for="groupId">Group ID:</label>
        <input
          type="text"
          id="groupId"
          v-model="groupId"
          v-on:keyup.enter="findGroup(groupId)"
        />
      </form>
      <button v-on:click="findGroup(groupId)">
        Find group
      </button>
      <!-- if group isn't found, shows this message -->
      <div v-show="groupNotFound">
        <p>Group not found. Please try again.</p>
      </div>
    </div>

    <!-- if group is found, displays group info -->
    <div v-show="!findingGroup && !groupNotFound">
      <p>
        Group name: {{ foundGroupName }}<br />
        Members: {{ foundGroupMembers }}<br />
        Exchange date: {{ foundGroupExchange }}
      </p>
      <button v-on:click="joinGroup({ name, userId, groupId, foundGroupName })">
        Join group
      </button>
      <!-- search again if want to search for different group -->
      <button
        v-on:click="
          resetState();
          groupId = '';
        "
      >
        Search again
      </button>
    </div>
    <!-- go back to main groups page -->
    <router-link to="/groups">Back to groups</router-link>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "NavBar",
  computed: {
    ...mapState("loggedIn", ["userId", "name"]),
    ...mapState("groups", [
      "foundGroupName",
      "foundGroupExchange",
      "foundGroupMembers",
      "findingGroup",
      "groupNotFound",
    ]),
  },
  methods: {
    test() {
      console.log(this.groupId, "groupID");
      console.log(this.name, "name", this.userId, "userId");
    },

    ...mapActions("groups", ["joinGroup", "findGroup", "resetState"]),
  },
  mounted() {
    console.log(this.userId, this.name);
  },
  data() {
    return {
      groupId: "",
    };
  },
};
</script>

<style></style>

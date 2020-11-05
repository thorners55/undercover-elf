<template>
  <div>
    <h2>Join group</h2>
    <div v-show="findingGroup">
      <form v-on:submit.prevent>
        <label for="groupId">Group ID:</label>
        <input
          type="text"
          id="groupId"
          v-model="groupId"
          v-on:keyup.enter="
            findGroup(groupId);
            findingGroup = false;
          "
        />
      </form>
      <button
        v-on:click="
          findGroup(groupId);
          findingGroup = false;
        "
      >
        Find group
      </button>
    </div>

    <div v-show="!findingGroup">
      <p>
        Group name: {{ foundGroupName }}<br />
        Members: {{ foundGroupMembers }}<br />
        Exchange date: {{ foundGroupExchange }}
      </p>
      <button v-on:click="joinGroup({ name, userId, groupId, foundGroupName })">
        Join group
      </button>
    </div>
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
    ]),
  },
  methods: {
    test() {
      console.log(this.groupId, "groupID");
      console.log(this.name, "name", this.userId, "userId");
    },

    ...mapActions("groups", ["joinGroup", "findGroup"]),
  },
  mounted() {
    console.log(this.userId, this.name);
  },
  data() {
    return {
      findingGroup: true,
      groupId: "",
    };
  },
};
</script>

<style></style>

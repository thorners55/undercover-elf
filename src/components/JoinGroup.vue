<template>
  <div class="top-of-page">
    <img src="../assets/jingle-bell.svg" id="logo" width="50rem" />
    <h2>Join group</h2>
    <div v-show="findingGroup">
      <!-- hides the input when begin search -->
      <form v-on:submit.prevent>
        <label for="groupId">Invitation ID</label>
        <input type="text" id="groupId" v-model="groupId" v-on:keyup.enter="findGroup(groupId)" />
      </form>
      <button type="button" v-on:click="findGroup(groupId)">Find group</button>
      <!-- if group isn't found, shows this message -->
      <div v-show="groupNotFound">
        <p class="message">Group not found. Please try again.</p>
      </div>
    </div>

    <!-- if group is found, displays group info -->
    <div v-show="!findingGroup && !groupNotFound">
      <p>
        <b>Group name:</b>
        {{ foundGroupName }}
        <br />
        <b>Exchange date:</b>
        {{ foundGroupExchange }}
      </p>
      <p>
        <b>This group has {{ foundGroupMembers.length }} members:</b>
      </p>
      <ul>
        <li v-for="member in foundGroupMembers" :key="member.pk">
          {{ member.name }}
          <br />
        </li>
      </ul>
      <button
        v-if="foundGroupClosed === 0"
        v-on:click="
          joinGroup({ name, userId, groupId, foundGroupName });
          groupId = '';
        "
      >Join group</button>
      <p v-if="foundGroupClosed === 1" class="message">
        Cannot join group - this group has already drawn names and is closed to
        new members.
      </p>
      <!-- search again if want to search for different group -->
      <button v-on:click="
          resetState();
          groupId = '';
        ">Search again</button>
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "JoinGroup",
  computed: {
    ...mapState("loggedIn", ["userId", "name"]),
    ...mapState("groups", [
      "foundGroupName",
      "foundGroupExchange",
      "foundGroupMembers",
      "foundGroupClosed",
      "findingGroup",
      "groupNotFound"
    ])
  },
  methods: {
    ...mapActions("groups", ["joinGroup", "findGroup", "resetState"])
  },
  mounted() {
    console.log(this.userId, this.name);
  },
  beforeDestroy() {
    this.resetState();
  },
  data() {
    return {
      groupId: ""
    };
  }
};
</script>

<style scoped>
li {
  margin: 0.5ch;
}

button {
  display: block;
  margin: 2ch auto 1ch;
}

input {
  margin: 1ch;
}
</style>

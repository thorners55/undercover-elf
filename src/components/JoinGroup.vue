<template>
  <div class="top-of-page">
    <img src="../assets/jingle-bell.svg" id="logo" width="50rem" />
    <h2>Join group</h2>
    <Loading v-if="loadingJoinGroup" />
    <div v-if="!loadingJoinGroup">
      <div v-show="findingGroup">
        <!-- hides the input fields once have submitted the groupId-->
        <form id="find-group" v-on:keyup.enter="findGroup({ groupId, groups })" v-on:submit.prevent>
          <label for="groupId">Invitation ID:</label>
          <input
            type="text"
            id="groupId"
            v-model="groupId"
            v-on:keyup.enter="findGroup({ groupId, groups })"
          />
        </form>
        <!--- button outside of form for styling -->
        <button
          type="submit"
          for="find-group"
          v-on:click="findGroup({ groupId, groups })"
        >Find group</button>

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
            joinGroup({ name, userId, groupId, foundGroupName, groups });
            groupId = '';
          "
        >Join group</button>
        <p v-if="foundGroupClosed === 1" class="message">
          Cannot join group - this group has already drawn names and is closed
          to new members.
        </p>
        <!-- search again if want to search for different group -->
        <button
          v-on:click="
            resetState();
            groupId = '';
          "
        >Search again</button>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from "./Loading.vue";
import { mapState, mapActions } from "vuex";

export default {
  name: "JoinGroup",
  components: {
    Loading
  },
  computed: {
    ...mapState("loggedIn", ["userId", "name"]),
    ...mapState("profile", ["profile", "groups"]),
    ...mapState("groups", [
      "foundGroupName",
      "foundGroupExchange",
      "foundGroupMembers",
      "foundGroupClosed",
      "findingGroup",
      "groupNotFound",
      "loadingJoinGroup"
    ])
  },
  methods: {
    ...mapActions("groups", ["joinGroup", "findGroup", "resetState"]),
    ...mapActions("profile", ["fetchUserProfile"])
  },
  created() {
    if (this.$route.query.id && this.userId) {
      this.fetchUserProfile(this.userId);
      this.findGroup({ groupId: this.$route.query.id, groups: this.groups });
      this.groupId = this.$route.query.id;
    }
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

label {
  font-weight: bold;
}
</style>

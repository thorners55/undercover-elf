<template>
  <div>
    <h2>Create group</h2>
    <div v-if="creatingGroup">
      <form v-on:submit.prevent>
        <label for="group-name">Group name:</label>
        <input type="text" id="group-name" v-model="newGroup.groupName" />
        <label for="exchange">Gift exchange</label>
        <input type="date" id="exchange" v-model="newGroup.exchange" />
        <label for="budget">Budget: </label>
        <input type="text" id="budget" v-model="newGroup.budget" />
      </form>
      <button v-on:click="createGroup">Create group</button>
    </div>
    <div v-if="!creatingGroup">
      <p>Group successfully created!</p>
      <p>Group ID for {{ newGroup.groupName }} is: {{ createdGroupId }}</p>
      <p>
        To invite people to this group, send them the group ID that has been
        generated for you, as shown above. They can then join this group by
        creating an account.
      </p>
    </div>
    <router-link to="/groups">Back to groups</router-link>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "CreateGroup",
  methods: {
    createGroup() {
      console.log("create group");
      this.creatingGroup = false;
      this.postGroup(this.newGroup);
    },
    ...mapActions("groups", ["postGroup"]),
  },
  computed: {
    ...mapState("profile", ["name", "userId"]),
    ...mapState("groups", ["createdGroupId"]),
  },

  data() {
    return {
      creatingGroup: true,
      newGroup: {
        groupName: "",
        exchange: "",
        members: "",
        budget: "",
      },
    };
  },
};
</script>

<style></style>

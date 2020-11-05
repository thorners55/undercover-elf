<template>
  <div>
    <h2>Create group</h2>
    <div v-if="creatingGroup">
      <form v-on:submit.prevent>
        <label for="group-name">Group name:</label>
        <input type="text" id="group-name" v-model="groupName" />
        <label for="exchange">Gift exchange</label>
        <input type="date" id="exchange" v-model="exchange" />
        <label for="budget">Budget: </label>
        <input type="text" id="budget" v-model="budget" />
      </form>
      <button v-on:click="createGroup">Create group</button>
    </div>
    <div v-if="!creatingGroup">
      <p>Group successfully created!</p>
      <p>Group ID for {{ groupName }} is:</p>
      <p>{{ groupId }}</p>
    </div>
    <router-link to="/groups">Back to groups</router-link>
  </div>
</template>

<script>
export default {
  name: "CreateGroup",
  methods: {
    createGroup() {
      console.log("create group");
      this.creatingGroup = false;
    },
  },
  data() {
    return {
      creatingGroup: true,
      groupName: "",
      admin: "",
      exchange: "",
      members: "",
      budget: "",
      groupId: "",
    };
  },
};
</script>

<style></style>

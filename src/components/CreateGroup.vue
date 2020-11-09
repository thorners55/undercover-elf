<template>
  <div>
    <h2>Create group</h2>
    <div v-if="!createGroupSuccess">
      <form v-on:submit.prevent v-on:keyup.enter="createGroup">
        <label for="group-name">Group name:</label>
        <input type="text" id="group-name" v-model="newGroup.groupName" required />
        <label for="exchange">Gift exchange</label>
        <input type="date" id="exchange" v-model="newGroup.exchange" required />
        <label for="budget">Budget: £</label>
        <input type="text" id="budget" v-model="newGroup.budget" required />
        <button type="button" v-on:click="createGroup">Create group</button>
      </form>
    </div>
    <div v-if="createGroupSuccess">
      <p>Group successfully created!</p>
      <p>Group ID for {{ newGroup.groupName }} is: {{ createdGroupId }}</p>
      <p>
        To invite people to this group, send them the group ID that has been
        generated for you, as shown above. They can join this group by searching
        for this ID in the 'Join Group' section.
        The group invitation ID can be found in group settings.
      </p>
      <router-link :to="`/groups/group_${createdGroupId}/profile`">View group page</router-link>
    </div>
    <router-link to="/">Back to home</router-link>
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
    ...mapActions("groups", ["postGroup"])
  },
  computed: {
    ...mapState("profile", ["name", "userId"]),
    ...mapState("groups", ["createdGroupId", "groups", "createGroupSuccess"])
  },

  data() {
    return {
      newGroup: {
        groupName: "",
        exchange: "",
        members: "",
        budget: ""
      }
    };
  }
};
</script>

<style></style>

<template>
  <div>
    <h2>Edit group</h2>

    <h3 v-if="!editGroup">{{ groupInfo.groupName }}</h3>

    <div v-if="editGroup">
      <input type="text" v-model="groupInfoToUpdate.groupName" />
    </div>
    <ul>
      <li v-for="member in groupInfo.members" :key="member.pk">
        {{ member.name }}
        <p v-if="member.pk === userId">(me)</p>
        <button
          v-if="member.pk !== userId"
          v-on:click="removeUser(member.pk, groupInfo.pk)"
        >
          Remove user from group
        </button>
      </li>
    </ul>

    <p>Exchange date:</p>

    <p v-if="!editGroup">{{ groupInfo.exchange }}</p>

    <div v-if="editGroup">
      <input type="date" v-model="groupInfoToUpdate.exchange" />
    </div>

    <p>Budget: £</p>
    <p v-if="!editGroup">{{ groupInfo.budget }}</p>
    <div v-if="editGroup">
      <input type="text" v-model="groupInfoToUpdate.budget" />
    </div>
    <button
      v-if="editGroup"
      v-on:click="
        updateGroup({
          groupId,
          groupInfoToUpdate,
        })
      "
    >
      Submit
    </button>
    <button v-if="!editGroup" v-on:click="editGroup = true">Edit group</button>

    <button v-if="groupInfo.closed === 0" v-on:click="drawGroups({ groupId })">
      Draw names
    </button>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "AdminEditGroup",
  methods: {
    ...mapActions("groups", ["updateGroup", "fetchGroupInfo", "removeUser"]),
  },
  computed: {
    groupId() {
      return this.$route.query.groupId;
    },
    ...mapState("groups", ["groupInfo", "groupInfoToUpdate"]),
    ...mapActions("groups", [/*"removeUser", */ "drawGroups"]),
  },
  created() {
    this.fetchGroupInfo(this.groupId);
  },
  data() {
    return {
      editGroup: false,
      userId: `user_${localStorage.userId}`,
    };
  },
};
</script>

<style></style>

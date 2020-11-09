<template>
  <div>
    <h2>Edit group settings</h2>

    <h3>{{ groupInfo.groupName }}</h3>

    <router-link :to="`/groups/${groupInfo.pk}/profile`">Back to {{groupInfo.groupName}} page</router-link>

    <div>
      <input
        type="text"
        v-model="groupInfoToUpdate.groupName"
        v-on:keyup.enter="
          updateGroup({
            groupId,
            groupInfoToUpdate,
          })
        "
      />
    </div>
    <ul>
      <li v-for="member in groupInfo.members" :key="member.pk">
        {{ member.name }}
        <p v-if="member.pk === userId">(me)</p>
        <button
          v-if="member.pk !== userId"
          v-on:click="removeUser(member.pk, groupInfo.pk)"
        >Remove user from group</button>
      </li>
    </ul>

    <p>Exchange date:</p>

    <p>{{ groupInfo.exchange }}</p>

    <div>
      <input
        type="date"
        v-model="groupInfoToUpdate.exchange"
        v-on:keyup.enter="
          updateGroup({
            groupId,
            groupInfoToUpdate,
          })
        "
      />
    </div>

    <p>Budget: £</p>
    <p>{{ groupInfo.budget }}</p>
    <div>
      <input
        type="text"
        v-model="groupInfoToUpdate.budget"
        v-on:keyup.enter="
          updateGroup({
            groupId,
            groupInfoToUpdate,
          })
        "
      />
    </div>
    <button
      v-on:click="
        updateGroup({
          groupId,
          groupInfoToUpdate,
        })
      "
    >Submit</button>
    <button type="button" v-on:click="resetInfo">Reset</button>

    <button v-if="groupInfo.closed === 0" v-on:click="drawNames({ groupId })">Draw names</button>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "AdminEdesitGroup",
  methods: {
    ...mapActions("groups", [
      "updateGroup",
      "fetchGroupInfo",
      "removeUser",
      "drawNames"
    ]),
    resetInfo() {
      console.log(this.originalState);
      this.groupInfoToUpdate.groupName = this.groupInfo.groupName;
      this.groupInfoToUpdate.exchange = this.groupInfo.exchange;
      this.groupInfoToUpdate.budget = this.groupInfo.budget;
      console.log(this.groupInfoToUpdate);
    }
  },
  computed: {
    groupId() {
      return this.$route.query.groupId;
    },
    ...mapState("groups", ["groupInfo", "groupInfoToUpdate"])
  },
  created() {
    this.fetchGroupInfo(this.groupId);
  },
  data() {
    return {
      userId: `user_${localStorage.undercoverElfUserId}`,
      originalState: {}
    };
  }
};
</script>

<style></style>

<template>
  <div class="top-of-page">
    <img src="../assets/lights.svg" id="logo" width="50rem" />
    <h2>Create group</h2>
    <div v-if="!createGroupSuccess">
      <!-- can't put button inside form for styling reasons--->
      <form id="create-group-form" v-on:submit="createGroup">
        <label for="group-name">Group name</label>
        <input
          type="text"
          id="group-name"
          v-model="newGroup.groupName"
          required
        />
        <label for="exchange">Gift exchange</label>
        <input type="date" id="exchange" v-model="newGroup.exchange" required />
        <label for="budget">Budget</label>
        <input
          type="text"
          id="budget"
          v-model="newGroup.budget"
          placeholder="e.g. £15"
          required
        />
      </form>
      <button
        type="submit"
        for="create-group-form"
        v-on:click="createGroup"
        :disabled="
          !newGroup.groupName || !newGroup.exchange || !newGroup.budget
            ? true
            : false
        "
      >
        Create group
      </button>
    </div>
    <div v-if="createGroupSuccess">
      <p>Group successfully created!</p>
      <div id="created-group-instructions">
        <p>
          Group ID for {{ newGroup.groupName }} is:
          <b>{{ createdGroupId }}</b>
        </p>
        <p>
          To invite people to this group, send them the group ID that has been
          generated for you, as shown above. They can join this group by
          searching for this ID by clicking the 'Join Group' button on the
          homepage. The group invitation ID can be also found in the group
          settings.
        </p>
      </div>
      <router-link :to="`/groups/group_${createdGroupId}/profile`"
        >View group page</router-link
      >
    </div>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "CreateGroup",
  methods: {
    ...mapActions("groups", ["postGroup", "resetCreateGroup"]),
    createGroup() {
      // have to check this as required doesn't work because the styling then does not work
      if (
        !this.newGroup.groupName ||
        !this.newGroup.budget ||
        !this.newGroup.exchange
      ) {
        alert("All fields are required");
        return;
      } else {
        this.creatingGroup = false;
        this.postGroup(this.newGroup);
      }
    },
  },
  computed: {
    ...mapState("profile", ["name", "userId"]),
    ...mapState("groups", ["createdGroupId", "groups", "createGroupSuccess"]),
  },
  beforeDestroy() {
    this.resetCreateGroup();
  },
  data() {
    return {
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

<style scoped>
form {
  display: grid;
  grid-template-columns: 40% auto;
  row-gap: 1ch;
  margin-left: auto;
  margin-right: auto;
  width: 40%;
}
label {
  text-align: left;
}

#pound-sign {
  text-align: right;
}

#created-group-instructions {
  width: 70%;
  margin: 2ch auto;
}

button {
  margin: 1rem;
  margin-bottom: 6ch;
}

@media (max-width: 900px) {
  form {
    display: block;
    margin: 0;
    margin: auto;
    width: auto;
  }

  label {
    text-align: center;
    display: block;
  }

  #budget {
    width: 40%;
  }
}
</style>

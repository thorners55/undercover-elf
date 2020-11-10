<template>
  <div class="top-of-page">
    <img src="../assets/lights.svg" id="logo" width="50rem" />
    <h2>Create group</h2>
    <div v-if="!createGroupSuccess">
      <!-- can't put button inside form for styling reasons--->
      <form
        id="create-group-form"
        v-on:submit.prevent
        v-on:keyup.enter="createGroup"
      >
        <label for="group-name">Group name</label>
        <input type="text" id="group-name" v-model="newGroup.groupName" />
        <label for="exchange">Gift exchange</label>
        <input type="date" id="exchange" v-model="newGroup.exchange" />
        <label for="budget">Budget</label>
        <input
          type="text"
          id="budget"
          v-model="newGroup.budget"
          placeholder="e.g. £15"
        />
      </form>
      <button type="submit" for="create-group-form" v-on:click="createGroup">
        Create group
      </button>
    </div>
    <div v-if="createGroupSuccess">
      <p>Group successfully created!</p>
      <p>Group ID for {{ newGroup.groupName }} is: {{ createdGroupId }}</p>
      <p>
        To invite people to this group, send them the group ID that has been
        generated for you, as shown above. They can join this group by searching
        for this ID in the 'Join Group' section. The group invitation ID can be
        found in group settings.
      </p>
      <router-link :to="`/groups/group_${createdGroupId}/profile`"
        >View group page</router-link
      >
    </div>
    <router-link to="/" class="back-to-home">Back to home</router-link>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "CreateGroup",
  methods: {
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
        console.log("create group");
        this.creatingGroup = false;
        this.postGroup(this.newGroup);
      }
    },
    ...mapActions("groups", ["postGroup", "resetCreateGroup"]),
  },
  computed: {
    ...mapState("profile", ["name", "userId"]),
    ...mapState("groups", ["createdGroupId", "groups", "createGroupSuccess"]),
  },
  beforeDestroy() {
    console.log("before destroy");
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
}
</style>

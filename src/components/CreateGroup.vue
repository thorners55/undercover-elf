<template>
  <div class="top-of-page">
    <Loading v-if="loadingCreatingGroup" />
    <div v-if="!loadingCreatingGroup">
      <img src="../assets/lights.svg" id="logo" width="50rem" />
      <h2>Create group</h2>
      <div v-if="!createGroupSuccess">
        <!-- can't put button inside form for styling reasons--->
        <form id="create-group-form" v-on:keyup.enter="createGroup" v-on:submit.prevent>
          <label for="group-name">Group name</label>
          <input type="text" id="group-name" v-model="newGroup.groupName" required />
          <label for="exchange">Gift exchange</label>
          <input type="date" id="exchange" v-model="newGroup.exchange" required />
          <label for="budget">Budget</label>
          <input type="text" id="budget" v-model="newGroup.budget" placeholder="e.g. £15" required />
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
        >Create group</button>
      </div>
      <div v-if="createGroupSuccess">
        <p>Group successfully created!</p>
        <div id="created-group-instructions">
          <p>
            Group ID for {{ newGroup.groupName }} is:
            <b>{{ createdGroupId }}</b>
          </p>
          <p>
            Invitation link for {{ newGroup.groupName }} is:
            <b>
              <a
                :href="
                  `https://master.dngg2cj4n9n4p.amplifyapp.com/#/groups/join?id=${createdGroupId}`
                "
              >
                {{
                `https://master.dngg2cj4n9n4p.amplifyapp.com/#/groups/join?id=${createdGroupId}`
                }}
              </a>
            </b>
          </p>
          <p>
            To invite people to this group, you can send them the group ID that
            has been generated for you, to be pasted into the search by that
            appears when you click the 'Join Group' button on the homepage, or
            send them the invitation link.
            <br />
            <br />The group invitation ID can be found in the group settings.
          </p>
        </div>
        <router-link :to="`/groups/group_${createdGroupId}/profile`">View group page</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from "./Loading.vue";
import { mapState, mapActions } from "vuex";

export default {
  name: "CreateGroup",
  components: {
    Loading
  },
  methods: {
    ...mapActions("groups", ["postGroup", "resetCreateGroup"]),
    createGroup(userId) {
      // have to check that all fields are filled as required attribute is not enough - to be able to use disabled styling, need to be able to check if fields have required inputs as go along
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
    }
  },
  computed: {
    ...mapState("profile", ["name", "userId"]),
    ...mapState("groups", [
      "createdGroupId",
      "groups",
      "createGroupSuccess",
      "loadingCreatingGroup"
    ])
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
        budget: ""
      },
      creatingGroup: false
    };
  }
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

button:disabled {
  background-color: rgb(206, 203, 203);
  color: grey;
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

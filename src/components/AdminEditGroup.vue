<template>
  <div>
    <Loading v-if="loadingDrawNames" />
    <div v-if="!loadingDrawNames">
      <router-link :to="`/groups/${groupInfo.pk}/profile`">Back to {{ groupInfo.groupName }} page</router-link>
      <div class="top-of-page">
        <h2>Edit group settings for {{ groupInfo.groupName }}</h2>
        <Loading v-if="loadingEditGroup" />
        <div v-if="!loadingEditGroup">
          <p class="message">
            <b>
              IMPORTANT: Press "Submit" at the bottom of the page after making
              changes!
            </b>
          </p>

          <div class="info">
            <h3>Group name:</h3>
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
          <h3>Group members:</h3>
          <ul>
            <li v-for="member in groupInfo.members" :key="member.pk">
              <p v-if="member.pk === userId">{{ member.name }} (you)</p>
              <p v-if="member.pk !== userId">{{ member.name }}</p>
            </li>
          </ul>

          <div class="info">
            <h3>Exchange date:</h3>
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

          <div class="info">
            <h3>Budget:</h3>
            <input
              type="text"
              v-model="groupInfoToUpdate.budget"
              v-on:keyup.enter="
                updateGroup({
                  groupId,
                  groupInfoToUpdate,
                })
              "
              placeholder="e.g. £15"
              size="5"
            />
          </div>
          <div class="edit-group-buttons">
            <button type="button" v-on:click="resetInfo">Reset fields</button>
            <button
              v-on:click="
                updateGroup({
                  groupId,
                  groupInfoToUpdate,
                })
              "
            >Submit</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from "./Loading.vue";
import { mapState, mapActions } from "vuex";

export default {
  name: "AdminEdesitGroup",
  components: {
    Loading
  },
  methods: {
    ...mapActions("groups", ["updateGroup", "fetchGroupInfo"]),
    resetInfo() {
      this.groupInfoToUpdate.groupName = this.groupInfo.groupName;
      this.groupInfoToUpdate.exchange = this.groupInfo.exchange;
      this.groupInfoToUpdate.budget = this.groupInfo.budget;
    }
  },
  computed: {
    groupId() {
      return this.$route.query.groupId;
    },
    ...mapState("groups", [
      "groupInfo",
      "groupInfoToUpdate",
      "loadingDrawNames",
      "loadingEditGroup"
    ]),
    ...mapState("loggedIn", ["userId"])
  },
  created() {
    this.fetchGroupInfo({ groupId: this.groupId, editing: true });
  },
  data() {
    return {};
  }
};
</script>

<style scoped>
a {
  margin: 2ch;
}

h3 {
  margin-top: 2ch;
  margin-bottom: 1ch;
}

li {
  margin: 0;
}

button {
  margin: 1ch 0;
}

p {
  margin: 0 1ch;
}

input {
  margin: 1ch;
}

.info {
  margin: 2ch 0;
}

.info > h3,
.info > p,
.info > input {
  display: inline;
}

.edit-group-buttons > button {
  display: block;
  margin: 1ch auto;
}

@media (max-width: 900px) {
  .info > h3,
  .info > p,
  .info > input {
    display: block;
  }

  input {
    margin: auto;
  }
}
</style>

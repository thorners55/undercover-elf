<template>
  <div>
    <router-link :to="`/groups/${groupId}/profile`">Back to {{ groupInfo.name }} page</router-link>
    <div class="top-of-page">
      <h2>Edit group settings for {{ groupInfo.name }}</h2>
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
                }),  updated = true;
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
                }), updated = true;
              "
        >Submit</button>
        <p v-if="updated" class="message">Changes saved!</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "AdminEditGroup",
  methods: {
    resetInfo() {
      this.groupInfoToUpdate.groupName = this.groupInfo.name;
      this.groupInfoToUpdate.exchange = this.groupInfo.exchange;
      this.groupInfoToUpdate.budget = this.groupInfo.budget;
    },
    ...mapActions("demo", ["updateGroup"])
  },
  computed: {
    groupId() {
      return this.$route.query.groupId;
    },
    ...mapGetters("demo", ["getGroup"])
  },
  created() {
    this.groupInfo = this.getGroup({ groupId: this.groupId, editing: true });
    this.groupInfoToUpdate.groupName = this.groupInfo.name;
    this.groupInfoToUpdate.exchange = this.groupInfo.exchange;
    this.groupInfoToUpdate.budget = this.groupInfo.budget;
  },
  data() {
    return {
      groupInfo: {},
      updated: false,
      groupInfoToUpdate: {
        groupName: "",
        exchange: "",
        budget: ""
      }
    };
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

<template>
  <div>
    <h2>Join group</h2>
    <form v-on:submit.prevent>
      <label for="groupId">Group ID:</label>
      <input type="text" id="groupId" v-model="groupId" />
      <button v-on:click="joinGroup">Join group</button>
    </form>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  name: "NavBar",
  computed: { ...mapState("userId", ["userId"]) },
  methods: {
    joinGroup() {
      console.log("joinGroup", this.groupId);
    },
  },
  data() {
    return {
      groupId: "",
    };
  },
};
</script>

<style></style>

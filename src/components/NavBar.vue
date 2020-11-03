<template>
  <div>
    <p>NavBar</p>
    <div v-if="groups.length === 0">
      <p>You have no groups yet!</p>
      <button>Join group</button>
    </div>
    <ul id="groupNav">
      <li v-for="group in groups" :key="group.sk">
        {{ group.groupName }}
      </li>
    </ul>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
export default {
  name: "NavBar",
  methods: {
    ...mapActions("groups", ["fetchGroups"]),
  },
  computed: {
    ...mapState("loggedIn", ["userId"]),
    ...mapState("groups", ["groups"]),
    ...mapActions("groups", ["getInitialGroups"]),
  },
  async created() {
    console.log("NavBar created");
    this.fetchGroups(this.userId);
  },

  data() {
    return {};
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

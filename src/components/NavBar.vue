<template>
  <div>
    <p>Hello</p>
    <ul id="groupNav">
      <li v-for="group in allGroups" :key="group.sk">
        {{ group.groupName }}
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
export default {
  name: "NavBar",
  props: {
    userId: String,
  },
  methods: {
    ...mapActions(["fetchGroups"]),
  },
  computed: mapGetters(["allGroups"]), // this returns the groups from state
  created() {
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

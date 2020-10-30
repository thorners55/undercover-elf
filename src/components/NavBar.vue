<template>
  <div>
    <p>Hello {{ name }}</p>
    <ul>
      <li v-for="group in groups" :key="group.sk">{{ group.sk }}</li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "NavBar",
  props: {
    name: String,
  },
  computed: mapGetters(["getGroups"]), // this returns the groups from state
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

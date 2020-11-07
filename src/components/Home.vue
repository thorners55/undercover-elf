<template>
  <div>
    <h2>Home</h2>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "Home",
  methods: {
    ...mapActions("profile", ["fetchUserProfile"]),
  },
  computed: {
    ...mapState("loggedIn", ["userId"]),
    // ...mapState("groups", ["groups"]),
    ...mapState("profile", ["groups"]),
  },
  created() {
    this.fetchUserProfile(this.userId);
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

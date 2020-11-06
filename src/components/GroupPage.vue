<template>
  <div>
    <h2>{{ groupInfo.name }}</h2>
    <li v-for="member in groupInfo.members" :key="member.pk">
      {{ member.name }}
    </li>
    <p>Exchange date: {{ groupInfo.exchange }}</p>
    <button v-on:click="leaveGroup(userId, groupId, groupInfo.members)">
      Leave group
    </button>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { API } from "aws-amplify";

export default {
  name: "GroupPage",
  methods: {
    ...mapActions("groups", ["fetchGroupInfo", "leaveGroup"]),
    leaveGroup(userId, groupId, members) {
      console.log("leaveGroup", userId, groupId);
      const split = groupId.split("_");
      const id = split[1];
      // make a new array with the member to be deleted removed, use this to update the group metadata
      const memberRemoved = members.filter((member) => {
        return member.pk !== `user_${userId}`;
      });

      API.del("undercoverElfApi", `/users/${userId}/groups?groupId=${id}`, {
        body: {
          memberRemoved,
        },
      })
        .then((response) => {
          console.log(response);
          this.$router.push({ path: "/groups" });
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
  computed: {
    groupId() {
      return this.$route.params.groupId;
    },
    ...mapState("groups", ["groupInfo"]),
    ...mapState("loggedIn", ["userId"]),
  },
  created() {
    console.log("GroupPage created");
    console.log(this.groupId);
    this.fetchGroupInfo(this.groupId);
  },
  data() {
    return {};
  },
};
</script>

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

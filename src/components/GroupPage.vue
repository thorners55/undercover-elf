<template>
  <div>
    <h2>{{ groupInfo.groupName }}</h2>
    <li v-for="member in groupInfo.members" :key="member.pk">
      {{ member.name }}
    </li>
    <p>Exchange date: {{ groupInfo.exchange }}</p>
    <p>You are buying for: {{ userGroupInfo.buyingForName }}</p>
    <button>View {{ userGroupInfo.buyingForName }}'s wishlist</button>
    <p>Your wishlist: {{ userGroupInfo.wishlist }}</p>

    <ul>
      <li v-for="item in userGroupInfo.wishlist" :key="item.url">
        <div v-if="!editing">
          <p>{{ item.description }}</p>
          <p>{{ item.url }}</p>
        </div>
        <button v-on:click="editing = !editing">Edit item</button>
        <button>Delete item</button>

        <div v-if="editing">
          <input type="text" :value="`${item.description}`" />
          <input type="text" :value="`${item.url}`" />
        </div>
      </li>
    </ul>
    <button>Add new item</button>

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
    ...mapActions("groups", [
      "fetchGroupInfo",
      "leaveGroup",
      "getGroupInfo",
      "fetchUserGroupInfo",
    ]),
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
    // ...mapState("groups", [this.$route.params.groupId]),
    ...mapState("loggedIn", ["userId"]),
    ...mapState("groups", ["groupInfo", "userGroupInfo"]),
    // SOMEHOW NEED TO PASS THROUGH GROUPID INTO MAP STATE - AT THE MOMENT IS SAYING THIS IS UNDEFINED
  },
  created() {
    console.log("GroupPage created");
    console.log(this.groupId, this.userId);
    this.fetchGroupInfo(this.groupId);
    this.fetchUserGroupInfo({ userId: this.userId, groupId: this.groupId });
  },
  data() {
    return {
      editing: false,
    };
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

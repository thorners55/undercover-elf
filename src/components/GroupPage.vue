<template>
  <div class="top-of-page">
    <img src="../assets/gift-bag.svg" id="logo" width="50rem" />
    <h2>{{ groupInfo.groupName }}</h2>
    <button
      v-if="!userGroupInfo.admin === 0 && groupInfo.closed === 0"
      v-on:click="
        leaveGroup({
          userId,
          groupId,
          groupName: groupInfo.groupName,
          members: groupInfo.members,
        })
      "
    >Leave group</button>
    <div id="group-info">
      <router-link v-if="userGroupInfo.admin" :to="`/groups/edit?groupId=${groupId}`">Group settings</router-link>
      <h3>Group members:</h3>
      <ul>
        <li v-for="member in groupInfo.members" :key="member.pk">{{ member.name }}</li>
      </ul>
      <h3>Exchange date:</h3>
      <p>{{ groupInfo.exchange }}</p>
      <p></p>
      <h3>Budget:</h3>
      <p>{{ groupInfo.budget }}</p>
      <div v-if="groupInfo.closed === 1">
        <p>You are buying for: {{ userGroupInfo.buyingForName }}</p>
        <router-link
          :to="`/wishlist/${userGroupInfo.buyingForUserId}?groupId=${groupId}`"
        >View {{ userGroupInfo.buyingForName }}'s wishlist</router-link>
      </div>
    </div>
    <p v-if="groupInfo.closed === 0">
      Names have not been drawn yet, but you can still get started on your
      wishlist!
    </p>
    <button
      type="button"
      v-on:click="$router.push(`/my-wishlist?groupId=${groupId}`)"
    >Go to my wishlist</button>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "GroupPage",
  methods: {
    ...mapActions("groups", ["fetchGroupInfo", "leaveGroup", "getGroupInfo"])
  },
  computed: {
    groupId() {
      return this.$route.params.groupId;
    },
    ...mapState("loggedIn", ["userId"]),
    ...mapState("groups", ["groupInfo", "userGroupInfo"])
  },
  created() {
    console.log("GroupPage created");
    console.log(this.groupId, this.userId);
    this.fetchGroupInfo(this.groupId);
  }
};
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
  display: block;
}

li {
  margin: 1rem;
}

a {
  color: #42b983;
}

p {
  display: block;
  text-align: center;
}

button {
  margin: 1ch;
}

.editing {
  background-color: pink;
  border: 2px solid red;
}

#group-info {
  margin-bottom: 4rem;
}
</style>

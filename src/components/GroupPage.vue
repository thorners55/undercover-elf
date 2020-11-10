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
    <router-link
      id="view-my-wishlist"
      :to="`/my-wishlist?groupId=${groupId}`"
    >View my wishlist for this group</router-link>
    <div id="group-info">
      <router-link v-if="userGroupInfo.admin" :to="`/groups/edit?groupId=${groupId}`">Group settings</router-link>
      <h3>Group members:</h3>
      <ul>
        <li v-for="member in groupInfo.members" :key="member.pk">{{ member.name }}</li>
      </ul>
      <div>
        <h3>Exchange date:</h3>
        <p>{{ groupInfo.exchange }}</p>
      </div>
      <div>
        <h3>Budget:</h3>
        <p>{{ groupInfo.budget }}</p>
      </div>
      <div>
        <h3>You are buying for:</h3>
        <div v-if="groupInfo.closed === 1">
          <p>{{ userGroupInfo.buyingForName }}</p>
          <router-link
            :to="`/wishlist/${userGroupInfo.buyingForUserId}?groupId=${groupId}`"
          >View {{ userGroupInfo.buyingForName }}'s wishlist</router-link>
        </div>
        <p v-if="groupInfo.closed === 0">Names have not been drawn yet!</p>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  name: "GroupPage",
  methods: {
    ...mapActions("groups", [
      "fetchGroupInfo",
      "leaveGroup",
      "getGroupInfo",
      "fetchUserGroupInfo"
    ])
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
    this.fetchUserGroupInfo({ userId: this.userId, groupId: this.groupId });
  }
};
</script>

<style scoped>
h2 {
  font-size: 2.5rem;
  margin: 1ch;
}

h3 {
  margin: 1.2rem 0;
  display: inline;
}

a {
  display: block;
  margin: 1ch;
}

#view-my-wishlist {
  margin-bottom: 3ch;
}

p {
  display: block;
  text-align: center;
  margin: 1ch 0;
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

#group-info > div > h3,
#group-info > div > p,
#group-info > div > div,
#group-info > div > div > p {
  display: inline;
}

#group-info > div > p {
  padding-left: 1ch;
}

#group-info > div {
  margin: 1.5ch;
}

#group-info > div > div > p {
  padding-left: 1ch;
}
</style>

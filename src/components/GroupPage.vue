<template>
  <div>
    <Loading
      v-if="
        loadingLeaveGroup ||
          loadingDrawNames ||
          (!fetchedGroupInfo && !fetchedUserGroupInfo)
      "
    />
    <div
      class="top-of-page"
      v-show="!loadingLeaveGroup && fetchedUserGroupInfo && !loadingDrawNames"
    >
      <img src="../assets/gift-bag.svg" id="logo" width="50rem" />
      <h2>{{ groupInfo.groupName }}</h2>
      <button
        class="settings"
        v-if="userGroupInfo.admin === 1"
        v-on:click="$router.push(`/groups/edit?groupId=${groupId}`)"
      >
        <span>
          <i class="fas fa-cog"></i>
        </span>
      </button>
      <button
        id="draw-names-button"
        v-if="groupInfo.closed === 0 && userGroupInfo.admin === 1"
        v-on:click="drawNames({ groupId })"
      >
        Draw names
      </button>
      <router-link
        v-if="userGroupInfo.admin === 1"
        id="view-my-wishlist"
        :to="`/my-wishlist?groupId=${groupId}`"
        >View my wishlist for this group</router-link
      >
      <button
        id="leave-group-button"
        v-if="userGroupInfo.admin === 0 && groupInfo.closed === 0"
        v-on:click="
          leaveGroup({
            userId,
            groupId,
            groupName: groupInfo.groupName,
            members: groupInfo.members,
          })
        "
      >
        Leave group
      </button>
      <div
        id="invite-info"
        v-if="userGroupInfo.admin === 1 && groupInfo.closed === 0"
      >
        <h3>Invitation ID:</h3>
        <p>{{ groupInfo.inviteId }}</p>

        <h3>Invitation link:</h3>
        <a
          :href="
            `https://master.dngg2cj4n9n4p.amplifyapp.com/#/groups/join?id=${splitId}`
          "
        >
          {{
            `https://master.dngg2cj4n9n4p.amplifyapp.com/#/groups/join?id=${splitId}`
          }}
        </a>
      </div>

      <router-link
        v-if="userGroupInfo.admin === 0"
        id="view-my-wishlist"
        :to="`/my-wishlist?groupId=${groupId}`"
        >View my wishlist for this group</router-link
      >

      <div id="group-info">
        <h3>Group members:</h3>
        <ul>
          <li v-for="member in groupInfo.members" :key="member.pk">
            {{ member.name }}
          </li>
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
          <h3>Group admin:</h3>
          <p>{{ groupInfo.admin }}</p>
        </div>
        <div>
          <h3>You are buying for:</h3>
          <div v-if="groupInfo.closed === 1">
            <p>{{ userGroupInfo.buyingForName }}</p>
            <router-link
              :to="
                `/wishlist/${userGroupInfo.buyingForUserId}?groupId=${groupId}`
              "
              >View {{ userGroupInfo.buyingForName }}'s wishlist</router-link
            >
          </div>
          <p v-if="groupInfo.closed === 0">Names have not been drawn yet!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from "./Loading.vue";
import { mapActions, mapState } from "vuex";
import { splitId } from "./utils/splitIdFunc.js";

export default {
  name: "GroupPage",
  components: {
    Loading,
  },
  methods: {
    ...mapActions("groups", [
      "fetchGroupInfo",
      "leaveGroup",
      "getGroupInfo",
      "fetchUserGroupInfo",
      "drawNames",
    ]),
  },
  computed: {
    groupId() {
      return this.$route.params.groupId;
    },
    ...mapState("loggedIn", ["userId"]),
    ...mapState("groups", [
      "groupInfo",
      "userGroupInfo",
      "loadingDrawNames",
      "loadingLeaveGroup",
      "fetchedGroupInfo",
      "fetchedUserGroupInfo",
    ]),
  },
  created() {
    this.fetchGroupInfo(this.groupId);
    this.fetchUserGroupInfo({ userId: this.userId, groupId: this.groupId });
    this.splitId = splitId(this.groupId);
  },
  data() {
    return {
      splitId: "",
    };
  },
};
</script>

<style scoped>
h2 {
  font-size: 2.5rem;
  margin: 1ch;
  display: inline;
}

h3 {
  margin: 1.2rem 0;
  display: inline;
}

img {
  display: block;
  margin: auto;
  margin-bottom: 2ch;
}

#draw-names-button {
  display: block;
  margin: 2ch auto;
  padding: 1.5ch;
  font-size: 1.4rem;
  background-color: #c067db;
}

ul {
  margin: 1ch;
}

li {
  margin: 0;
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

.settings {
  font-size: 1.2rem;
  padding: 0.5ch;
  display: inline;
  margin: auto;
}

.editing {
  background-color: pink;
  border: 2px solid red;
}

#invite-info {
  margin-top: 3ch;
}

#invite-info > p {
  width: 100%;
  word-wrap: break-word;
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

#leave-group-button {
  margin-top: 0;
}

#invite-info {
  margin-top: 3ch;
}
#invite-info > p {
  width: 100%;
  word-wrap: break-word;
}

#draw-names-button {
  display: block;
  margin: 2ch auto;
  padding: 1.5ch;
  font-size: 1.4rem;
  background-color: #c067db;
}

@media (max-width: 900px) {
  h2 {
    text-align: center;
    display: block;
  }

  #leave-group-button {
    display: block;
    margin: auto;
    margin-bottom: 3ch;
  }
}
</style>

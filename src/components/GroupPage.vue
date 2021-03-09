<template>
  <div>
    <div class="top-of-page">
      <img src="../assets/gift-bag.svg" id="logo" width="50rem" />
      <h2>{{ group.name }}</h2>
      <button
        class="settings"
        v-if="group.admin"
        v-on:click="$router.push(`/groups/edit?groupId=${groupId}`)"
      >
        <span>
          <i class="fas fa-cog"></i>
        </span>
      </button>
      <button
        id="leave-group-button"
        v-if="!group.admin && !group.closed"
        v-on:click="leaveGroup(groupId)"
      >Leave group</button>
      <div id="invite-info" v-if="group.admin">
        <h3>Invitation ID:</h3>
        <p>{{ groupId }}</p>

        <h3>Invitation link:</h3>
        <p>{{ `https://undercover-elf-demo.com/groups/join?id=${groupId}` }}</p>
      </div>

      <router-link
        id="view-my-wishlist"
        :to="`/my-wishlist?groupId=${groupId}`"
      >View my wishlist for this group</router-link>
      <div id="group-info">
        <div>
          <h3>Exchange date:</h3>
          <p>{{ group.exchange }}</p>
        </div>
        <div>
          <h3>Budget:</h3>
          <p>{{ group.budget }}</p>
        </div>
        <div>
          <h3>Group admin:</h3>
          <p>{{ group.adminName }}</p>
        </div>
        <div>
          <h3>You are buying for:</h3>
          <div>
            <p v-if="group.closed">{{ group.buyingFor }}</p>
            <p v-if="!group.closed">Names have not been drawn yet</p>
            <router-link
              :to="`/wishlist/r2888e66cla9?groupId=${groupId}`"
              v-if="group.closed"
            >View {{ group.buyingFor }}'s wishlist</router-link>
          </div>
        </div>

        <h3>Group members:</h3>
        <ul>
          <li v-for="member in group.members" :key="member">{{ member }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import date from "date-and-time";

export default {
  name: "GroupPage",
  computed: {
    ...mapState("demo", ["groups"]),
    ...mapGetters("demo", ["getGroup"]),
    groupId() {
      return this.$route.params.groupId;
    }
  },
  methods: {
    ...mapActions("demo", ["leaveGroup"])
  },
  created() {
    this.group = this.getGroup({ groupId: this.groupId, editing: false });
  },
  data() {
    return {
      group: {}
    };
  }
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

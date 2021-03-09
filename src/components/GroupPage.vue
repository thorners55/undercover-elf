<template>
  <div>
    <div class="top-of-page">
      <img src="../assets/gift-bag.svg" id="logo" width="50rem" />
      <h2>{{ groupName }}</h2>
      <button
        class="settings"
        v-if="admin"
        v-on:click="$router.push(`/groups/edit?groupId=${groupId}`)"
      >
        <span>
          <i class="fas fa-cog"></i>
        </span>
      </button>
      <button id="leave-group-button" v-if="!admin && !namesDrawn">Leave group</button>
      <div id="invite-info" v-if="admin">
        <h3>Invitation ID:</h3>
        <p>{{ invitationId }}</p>

        <h3>Invitation link:</h3>
        <p>{{ `https://undercover-elf-demo.com/groups/join?id=${invitationId}` }}</p>
      </div>

      <router-link
        id="view-my-wishlist"
        :to="`/my-wishlist?groupId=${groupId}`"
      >View my wishlist for this group</router-link>
      <div id="group-info">
        <div>
          <h3>Exchange date:</h3>
          <p>{{ exchange }}</p>
        </div>
        <div>
          <h3>Budget:</h3>
          <p>{{ budget }}</p>
        </div>
        <div>
          <h3>Group admin:</h3>
          <p>{{ adminName }}</p>
        </div>
        <div>
          <h3>You are buying for:</h3>
          <div>
            <p v-if="namesDrawn">{{ buyingFor }}</p>
            <p v-if="!namesDrawn">Names have not been drawn yet</p>
            <router-link
              :to="`/wishlist/r2888e66cla9?groupId=${groupId}`"
              v-if="namesDrawn"
            >View {{ buyingFor }}'s wishlist</router-link>
          </div>
        </div>

        <h3>Group members:</h3>
        <ul>
          <li v-for="member in members" :key="member">{{ member }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "GroupPage",
  created() {
    if (this.$route.params.groupId === "dum813d0r3s4rmy") {
      this.groupName = "Dumbledore's Army";
      this.invitationId = "dum813d0r3s4rmy";
      this.budget = this.dumbledoresArmy.budget;
      this.exchange = this.dumbledoresArmy.exchange;
      this.admin = true;
      this.adminName = this.dumbledoresArmy.adminName;
      this.namesDrawn = this.dumbledoresArmy.namesDrawn;
      this.members = this.dumbledoresArmy.members;
      this.buyingFor = this.dumbledoresArmy.buyingFor;
    } else {
      this.groupName = "Gryffindor Quidditch Team";
      this.invitationId = "qu1dd1tch";
      this.budget = this.gryffindorQuidditchTeam.budget;
      this.exchange = this.gryffindorQuidditchTeam.exchange;
      this.admin = false;
      this.adminName = this.gryffindorQuidditchTeam.adminName;
      this.namesDrawn = this.gryffindorQuidditchTeam.namesDrawn;
      this.members = this.gryffindorQuidditchTeam.members;
      this.buyingFor = this.gryffindorQuidditchTeam.buyingFor;
    }
  },
  computed: {
    groupId() {
      return this.$route.params.groupId;
    }
  },
  data() {
    return {
      dumbledoresArmy: {
        exchange: "10/12/95",
        budget: "3 Galleons",
        adminName: "Harry Potter",
        buyingFor: "Luna Lovegood",
        namesDrawn: true,
        members: [
          "Harry Potter",
          "Padma Patil",
          "Parvarti Patil",
          "Hannah Abbott",
          "Lavender Brown",
          "Katie Bell",
          "Susan Bones",
          "Cho Chang",
          "Colin Creevey",
          "Marietta Edgecombe",
          "Justin Finch-Fletchley",
          "Hermione Granger",
          "Angelina Johnson",
          "Lee Jordan",
          "Neville Longbottom",
          "Luna Lovegood",
          "Fred Weasley",
          "George Weasley",
          "Ginny Weasley",
          "Ron Weasley"
        ]
      },
      gryffindorQuidditchTeam: {
        exchange: "15/12/91",
        budget: "2 Galleons",
        adminName: "Oliver Wood",
        namesDrawn: false,
        buyingFor: "Fred Weasley",
        members: [
          "Fred Weasley",
          "George Weasley",
          "Angelina Johnson",
          "Alicia Spinnet",
          "Harry Potter",
          "Oliver Wood"
        ]
      }
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

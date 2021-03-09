import router from "../../router";

const namespaced = true;

const state = {
  profile: {
    name: "Harry Potter",
    email: "ilovehedwig@hogwarts.co.uk",
  },
  groups: [
    {
      name: "Dumbledore's Army",
      groupId: "dum813d0r3s4rmy",
      exchange: "1995-12-15",
      budget: "3 Galleons",
      admin: true,
      adminName: "Harry Potter",
      buyingFor: "Luna Lovegood",
      closed: true,
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
        "Ron Weasley",
      ],
    },
    {
      name: "Gryffindor Quidditch Team",
      groupId: "qu1dd1tch",
      exchange: "1991-12-15",
      budget: "2 Galleons",
      admin: false,
      adminName: "Oliver Wood",
      closed: false,
      buyingFor: "Fred Weasley",
      members: [
        "Fred Weasley",
        "George Weasley",
        "Angelina Johnson",
        "Alicia Spinnet",
        "Harry Potter",
        "Oliver Wood",
      ],
    },
  ],
};

const getters = {
  getGroup: (state) => (groupId) => {
    let groupToGet = state.groups.find((group) => group.groupId == groupId);
    return groupToGet;
  },

  getAdminFor: (state) => () => {
    let adminFor = state.groups.filter(
      (group) => group.adminName == state.profile.name
    );
    return adminFor;
  },
};

const mutations = {
  setUpdatedGroup(state, { groupId, groupInfoToUpdate }) {
    const { budget, exchange, groupName } = groupInfoToUpdate;
    console.log(groupId, groupInfoToUpdate);
    for (let i = 0; i < state.groups.length; i++) {
      if (state.groups[i].groupId === groupId) {
        state.groups[i].budget = budget;
        state.groups[i].exchange = exchange;
        state.groups[i].name = groupName;
      }
    }
  },
};

const actions = {
  updateGroup({ commit }, { groupId, groupInfoToUpdate }) {
    commit("setUpdatedGroup", {
      groupId,
      groupInfoToUpdate,
    });
  },
};

export default { state, getters, actions, mutations, namespaced };

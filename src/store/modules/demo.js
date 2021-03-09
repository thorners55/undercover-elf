import router from "../../router";

const namespaced = true;

const state = {
  groups: [
    {
      name: "Dumbledore's Army",
      groupId: "dum813d0r3s4rmy",
      exchange: "10/12/95",
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
      exchange: "15/12/91",
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
};

const mutations = {};

const actions = {};

export default { state, getters, actions, mutations, namespaced };

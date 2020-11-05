import { API } from "aws-amplify";
import router from "../../router";

const namespaced = true;

const state = {
  groups: [],
  foundGroupName: "",
  foundGroupMembers: [],
  foundGroupExchange: "",
};

const getters = {
  /*getGroups: (state) => {
    console.log(state), state.groups;
  },*/
  allGroups: (state) => state.groups,
};

const mutations = {
  setGroups(state, groups) {
    state.groups = groups;
  },

  findGroupInfo(state, group) {
    console.log("find group info");
    state.foundGroupName = group.name;
    state.foundGroupMembers = group.members;
    state.foundGroupExchange = group.exchange;
  },

  addUserGroup(state, group) {
    console.log(state, group);

    // push group info object onto groups - need to know what "get groups" looks like
    //array, each item: { exchange: x, groupName: x, name: Ralph Jackson, pk: user_x, sk: group_x }
  },
};

const actions = {
  fetchGroups({ commit }, userId) {
    console.log(userId);
    API.get("undercoverElfApi", `/users/${userId}/groups`, {})
      .then((groups) => {
        console.log(groups);
        commit("setGroups", groups);
      })
      .catch((err) => {
        console.log(err);
      });
  },

  findGroup({ commit }, groupId) {
    console.log(groupId);
    API.get("undercoverElfApi", `/groups?id=${groupId}`, {})
      .then((group) => {
        console.log(group);
        commit("findGroupInfo", group.body);
      })
      .catch((err) => {
        console.log(err);
      });
  },

  joinGroup({ commit }, { name, userId, groupId, foundGroupName }) {
    console.log(name, userId, groupId);
    commit("addGroup");
    API.post("undercoverElfApi", `/users/${userId}/groups?groupId=${groupId}`, {
      body: {
        admin: 0,
        groupName: foundGroupName,
        name,
        wishlist: [],
      },
    })
      .then((response) => {
        console.log(response);
        commit("addUserGroup", response);
        //response is an array of items that have been updated
        // ALERT WHEN SUCCESSFULLY JOIN
        alert(`Successfully joined group!`);
        router.push({ path: "/groups" });
      })
      .catch((err) => {
        console.log(err, "postUserInGroup error");
      });
  },
};

export default { state, getters, actions, mutations, namespaced };

import { API } from "aws-amplify";
import router from "../../router";

const namespaced = true;

const state = {
  groups: [],
  foundGroupName: "",
  foundGroupMembers: [],
  foundGroupExchange: "",
  findingGroup: true,
  groupNotFound: false,
  groupInfo: {},
};

const getters = {};

const mutations = {
  setGroups(state, groups) {
    state.groups = groups;
  },

  reset(state) {
    state.findingGroup = true;
    state.groupNotFund = false;
  },

  // if the group does not exist, shows a message saying this
  findGroupInfo(state, response) {
    state.findingGroup = false;
    if (response.error) {
      state.groupNotFound = true;
      state.findingGroup = true;
    } else {
      console.log("find group info");
      state.groupNotFound = false;
      state.foundGroupName = response.body.name;
      state.foundGroupMembers = response.body.members;
      state.foundGroupExchange = response.body.exchange;
    }
  },

  setGroupInfo(state, groupInfo) {
    state.groupInfo = groupInfo;
  },
};

const actions = {
  // searches database to find groups a user is a part of
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

  // searches to find a group using the ID the user has input
  findGroup({ commit }, groupId) {
    console.log(groupId);
    API.get("undercoverElfApi", `/groups?id=${groupId}`, {})
      .then((response) => {
        console.log(response);
        commit("findGroupInfo", response);
      })
      .catch((err) => {
        console.log(err);
        return;
      });
  },

  // reset state to default when user clicks button
  resetState({ commit }) {
    commit("reset");
  },

  // join a group that user has previously searched for
  joinGroup(context, { name, userId, groupId, foundGroupName }) {
    console.log(name, userId, groupId);
    console.log(state.foundGroupMembers);
    const newMembers = state.foundGroupMembers.map((member) => {
      return member;
    });
    newMembers.push({
      pk: `user_${userId}`,
      name,
    });
    console.log(state.foundGroupMembers);
    console.log(newMembers);
    API.post("undercoverElfApi", `/users/${userId}/groups?groupId=${groupId}`, {
      body: {
        userInfo: {
          admin: 0,
          groupName: foundGroupName,
          name,
          wishlist: [],
        },
        newMembers,
      },
    })
      .then((response) => {
        console.log(response);
        alert(`Successfully joined group!`);
        router.push({ path: "/groups" });
      })
      .catch((err) => {
        console.log(err, "postUserInGroup error");
      });
  },

  fetchGroupInfo({ commit }, groupId) {
    console.log("getGroupInfo", groupId);
    const split = groupId.split("_");
    const id = split[1];
    API.get("undercoverElfApi", `/groups?id=${id}`, {})
      .then(({ body }) => {
        console.log(body);
        commit("setGroupInfo", body);
      })
      .catch((err) => {
        console.log(err);
      });
  },
};

export default { state, getters, actions, mutations, namespaced };

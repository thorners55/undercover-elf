import { API } from "aws-amplify";
//import router from "../../router";
import { v4 as uuidv4 } from "uuid";

const namespaced = true;

const state = {
  groups: [],
  foundGroupName: "",
  foundGroupMembers: [],
  foundGroupExchange: "",
  foundGroupClosed: "",
  findingGroup: true,
  groupNotFound: false,
  groupInfo: {},
  userGroupInfo: {},
  createGroupSuccess: false,
  createdGroupId: "",
};

const getters = {};

const mutations = {
  /* setGroups(state, groups) {
    state.groups = groups;
    // loop through the groups array which has all the group info
    // set state of the groupId with value which is object with group info
    for (let i = 0; i < groups.length; i++) {
      console.log(groups[i]);
      state[groups[i].sk] = groups[i];
      return;
    }
  },*/

  setUserGroupInfo(state, userGroupInfo) {
    state.userGroupInfo = userGroupInfo;
  },

  reset(state) {
    state.findingGroup = true;
    state.groupNotFound = false;
  },

  // if the group does not exist, shows a message saying this
  setFoundGroupInfo(state, response) {
    state.findingGroup = false;
    if (response.error) {
      state.groupNotFound = true;
      state.findingGroup = true;
    } else {
      console.log("find group info");
      state.groupNotFound = false;
      state.foundGroupName = response.body.groupName;
      state.foundGroupMembers = response.body.members;
      state.foundGroupExchange = response.body.exchange;
      state.foundGroupClosed = response.body.closed;
    }
  },

  setGroupInfo(state, groupInfo) {
    state.groupInfo = groupInfo;
  },

  setCreatedGroupId(state, { groupId, updatedGroupArray }) {
    state.createGroupSuccess = true;
    state.createdGroupId = groupId;
    localStorage.groups = JSON.stringify(updatedGroupArray);
  },
};

const actions = {
  // searches database to find groups a user is a part of
  /*fetchGroups({ commit }, userId) {
    console.log(userId);
    API.get("undercoverElfApi", `/users/${userId}/groups`, {})
      .then((groups) => {
        console.log(groups);
        commit("setGroups", groups);
      })
      .catch((err) => {
        console.log(err);
      });
  },*/

  // searches to find a group using the ID the user has input
  findGroup({ commit }, groupId) {
    console.log(groupId);
    API.get("undercoverElfApi", `/groups?id=${groupId}`, {})
      .then((response) => {
        console.log(response);
        commit("setFoundGroupInfo", response);
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
  joinGroup({ commit }, { name, userId, groupId /*foundGroupName*/ }) {
    console.log(name, userId, groupId);
    console.log(state.foundGroupMembers);
    let alreadyMember = false;
    const groups = JSON.parse(localStorage.groups);
    for (let i = 0; i < groups.length; i++) {
      if (groups[i].groupId === `group_${groupId}`) {
        alreadyMember = true;
        break;
      } else continue;
    }
    if (alreadyMember) {
      alert(
        "You are already a member of this group! Please search for another group."
      );
      commit("reset");
    } else {
      const newMembers = state.foundGroupMembers.map((member) => {
        return member;
      });
      newMembers.push({
        pk: userId,
        name,
      });
      console.log(state.foundGroupMembers);
      console.log(newMembers);
      /* API.post("undercoverElfApi", `/users/${userId}/groups?groupId=${groupId}`, {
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
        router.push({ path: "/" });
      })
      .catch((err) => {
        console.log(err, "postUserInGroup error");
      });*/
    }
  },

  fetchGroupInfo({ commit }, groupId) {
    console.log("fetchGroupInfo");
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

  fetchUserGroupInfo({ commit }, { userId, groupId }) {
    console.log("fetchUserGroupInfo");
    const split = groupId.split("_");
    const id = split[1];
    API.get("undercoverElfApi", `/users/${userId}/groups?groupId=${id}`, {})
      .then(({ body }) => {
        console.log(body);
        commit("setUserGroupInfo", body);
      })
      .catch((err) => {
        console.log(err);
      });
  },

  /*updateStateUserGroupInfo({ commit }, groupId) {
    commit("setUserGroupInfo", groupId);
  },*/

  postGroup({ commit, rootState }, newGroupInfo) {
    console.log(commit);
    const groupId = uuidv4();
    newGroupInfo.pk = groupId;
    newGroupInfo.admin = rootState.loggedIn.name;
    newGroupInfo.members = [
      {
        pk: `user_${rootState.loggedIn.userId}`,
        name: rootState.loggedIn.name,
      },
    ];
    console.log(state.groups);
    const updatedGroupArray = rootState.profile.groups.map((group) => {
      return group;
    });
    updatedGroupArray.push({
      groupId: `group_${groupId}`,
      groupName: newGroupInfo.groupName,
      admin: 1,
    });
    console.log(updatedGroupArray);
    API.post("undercoverElfApi", "/groups", {
      body: {
        newGroupInfo,
        updatedGroupArray,
      },
    })
      .then((response) => {
        console.log(response);
        commit("setCreatedGroupId", { groupId, updatedGroupArray });
      })
      .catch((err) => {
        console.log(err);
      });
  },
};

export default { state, getters, actions, mutations, namespaced };

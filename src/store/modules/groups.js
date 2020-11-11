import { API } from "aws-amplify";
import router from "../../router";
import { v4 as uuidv4 } from "uuid";
import date from "date-and-time";

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
  groupInfoToUpdate: {},
  userGroupInfo: {},
  fetchedUserGroupInfo: false,
  createGroupSuccess: false,
  createdGroupId: "",
  loadingDrawNames: false,
  loadingJoinGroup: false,
  loadingFindGroup: false,
  loadingLeaveGroup: false,
  loadingEditGroup: false,
};

const getters = {};

const mutations = {
  setUserGroupInfo(state, userGroupInfo) {
    const addIsEditing = userGroupInfo.wishlist.map((item) => {
      item.isEditing = false;
      return item;
    });
    userGroupInfo.wishlist = addIsEditing;
    state.userGroupInfo = userGroupInfo;

    const localStorageName = `undercoverElfMyWishlist${userGroupInfo.sk}`;
    localStorage.setItem(localStorageName, JSON.stringify(userGroupInfo));
    state.fetchedUserGroupInfo = true;
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
      state.groupNotFound = false;
      state.foundGroupName = response.body.groupName;
      state.foundGroupMembers = response.body.members;
      state.foundGroupExchange = response.body.exchange;
      state.foundGroupClosed = response.body.closed;
    }
  },

  setGroupInfo(state, groupInfo) {
    const splitGroupId = groupInfo.pk.split("_");
    const inviteId = splitGroupId[1];
    state.groupInfo = groupInfo;
    state.groupInfo.inviteId = inviteId;
    const groupInfoToUpdate = JSON.parse(JSON.stringify(groupInfo));
    state.groupInfoToUpdate = groupInfoToUpdate;
  },

  setCreatedGroupId(state, { groupId, updatedGroupArray }) {
    state.createGroupSuccess = true;
    state.createdGroupId = groupId;
    localStorage.undercoverElfGroups = JSON.stringify(updatedGroupArray);
  },

  resetCreatedGroupId(state) {
    state.createGroupSuccess = false;
    state.createdGroupId = "";
  },

  setLoading(state, { of, to }) {
    state[`loading${of}`] = to;
  },
};

const actions = {
  // searches to find a group using the ID the user has input
  findGroup({ commit }, groupId) {
    let alreadyMember = false;
    const groups = JSON.parse(localStorage.undercoverElfGroups);
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
      commit("setLoading", { of: "FindGroup", to: true });
      API.get("undercoverElfApi", `/groups?id=${groupId}`, {})
        .then((response) => {
          commit("setFoundGroupInfo", response);
        })
        .catch((err) => {
          commit("setLoading", { of: "FindGroup", to: false });
          console.log(err);
          return;
        });
    }
  },

  // reset state to default when user clicks button
  resetState({ commit }) {
    commit("reset");
  },

  // join a group that user has previously searched for
  joinGroup({ commit }, { name, userId, groupId, foundGroupName }) {
    let alreadyMember = false;
    const groups = JSON.parse(localStorage.undercoverElfGroups);
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
      commit("setLoading", { of: "JoinGroup", to: true });
      const newMembers = state.foundGroupMembers.map((member) => {
        return member;
      });
      newMembers.push({
        pk: `user_${userId}`,
        name,
      });

      const updatedGroupArray = JSON.parse(localStorage.undercoverElfGroups);

      const newGroup = {
        groupId: `group_${groupId}`,
        groupName: foundGroupName,
        admin: 0,
      };

      updatedGroupArray.push(newGroup);

      API.post(
        "undercoverElfApi",
        `/users/${userId}/groups?groupId=${groupId}`,
        {
          body: {
            userInfo: {
              admin: 0,
              groupName: foundGroupName,
              name,
              wishlist: [],
            },
            newMembers,
            updatedGroupArray,
          },
        }
      )
        .then((response) => {
          alert(`Successfully joined group!`);
          localStorage.undercoverElfGroups = updatedGroupArray;
          commit("setLoading", { of: "JoinGroup", to: false });
          router.push({ path: "/" });
          localStorage.undercoverElfGroups = updatedGroupArray;
        })
        .catch((err) => {
          commit("setLoading", { of: "JoinGroup", to: false });
          console.log(err, "postUserInGroup error");
        });
    }
  },

  fetchGroupInfo({ commit }, groupId) {
    commit("setLoading", { of: "EditGroup", to: true });
    const split = groupId.split("_");
    const id = split[1];
    API.get("undercoverElfApi", `/groups?id=${id}`, {})
      .then(({ body }) => {
        commit("setGroupInfo", body);
        commit("setLoading", { of: "EditGroup", to: false });
      })
      .catch((err) => {
        console.log(err);
        commit("setLoading", { of: "EditGroup", to: false });
      });
  },

  fetchUserGroupInfo({ commit }, { userId, groupId }) {
    const split = groupId.split("_");
    const id = split[1];
    API.get("undercoverElfApi", `/users/${userId}/groups?groupId=${id}`, {})
      .then(({ body }) => {
        commit("setUserGroupInfo", body);
      })
      .catch((err) => {
        console.log(err);
      });
  },

  /*updateStateUserGroupInfo({ commit }, groupId) {
    commit("setUserGroupInfo", groupId);
  },*/

  postGroup({ commit }, newGroupInfo) {
    const tryDate = date.transform(
      newGroupInfo.exchange,
      "YYYY-MM-DD",
      "DD-MM-YYYY"
    );

    const groupId = uuidv4();
    newGroupInfo.exchange = tryDate;
    newGroupInfo.pk = groupId;
    newGroupInfo.admin = localStorage.undercoverElfName;
    newGroupInfo.members = [
      {
        pk: `user_${localStorage.undercoverElfUserId}`,
        name: localStorage.undercoverElfName,
      },
    ];

    const updatedGroupArray = localStorage.undercoverElfGroups.map((group) => {
      return group;
    });
    updatedGroupArray.push({
      groupId: `group_${groupId}`,
      groupName: newGroupInfo.groupName,
      admin: 1,
    });

    API.post("undercoverElfApi", "/groups", {
      body: {
        newGroupInfo,
        updatedGroupArray,
      },
    })
      .then((response) => {
        console.log(response);
        localStorage.undercoverElfGroups = updatedGroupArray;
        commit("setCreatedGroupId", { groupId, updatedGroupArray });
      })
      .catch((err) => {
        console.log(err);
      });
  },

  resetCreateGroup({ commit }) {
    commit("resetCreatedGroupId");
  },

  updateGroup({ commit }, { groupId, groupInfoToUpdate }) {
    var result = confirm("Are you sure you want to change the group settings?");
    if (result) {
      commit("setLoading", { of: "EditGroup", to: true });

      const split = groupId.split("_");
      const id = split[1];

      const userId = `user_${localStorage.undercoverElfUserId}`;

      const originalName = state.groupInfo.groupName;
      const updatedName = groupInfoToUpdate.groupName;
      const originalBudget = state.groupInfo.budget;
      const updatedBudget = groupInfoToUpdate.budget;
      const originalExchange = state.groupInfo.exchange;
      const updatedExchange = groupInfoToUpdate.exchange;

      let updateNameOrExchange = false;

      // pass true or false balue saying if it is only the budget being updated
      // if name or exchange is nt being updated AND name is not being updated AND exchange date is not being updated, alert that nothing is updated

      if (
        originalName !== updatedName ||
        updatedExchange !== originalExchange
      ) {
        updateNameOrExchange = true;
      }

      if (
        !updateNameOrExchange &&
        originalBudget === updatedBudget &&
        originalExchange === updatedExchange
      ) {
        commit("setLoading", { of: "EditGroup", to: false });
        alert("Nothing to update!");
      } else {
        let localStateGroups = JSON.parse(localStorage.undercoverElfGroups);

        for (let i = 0; i < localStateGroups.length; i++) {
          if (localStateGroups[i].groupId === groupId) {
            localStateGroups[i].groupName = groupInfoToUpdate.groupName;
            break;
          } else continue;
        }

        API.patch("undercoverElfApi", `/groups?id=${id}`, {
          body: {
            groupInfoToUpdate,
            updateNameOrExchange,
            localStateGroups,
            userId,
          },
        })
          .then(() => {
            localStorage.undercoverElfGroups = localStateGroups;
            localStorage.undercoverElfGroups = JSON.stringify(localStateGroups);
            router.push({ path: `/groups/${groupId}/profile` });
            alert("Group information successfully changed!");
            commit("setLoading", { of: "EditGroup", to: false });
          })
          .catch((err) => {
            console.log(err);
            commit("setLoading", { of: "EditGroup", to: false });
          });
      }
    } else return;
  },

  leaveGroup({ commit }, { userId, groupId, groupName, members }) {
    const result = confirm(`Are you sure you what to leave ${groupName}?`);

    const split = groupId.split("_");
    const id = split[1];
    if (result) {
      // filter through local storage array to remove that group, then use this new array to update the user group profile
      commit("setLoading", { of: "LeaveGroup", to: true });

      const localStateGroups = JSON.parse(localStorage.undercoverElfGroups);
      const removedGroupFromUserProfile = localStateGroups.filter((group) => {
        return group.groupId !== groupId;
      });

      // make a new array with the member to be deleted removed, use this to update the group metadata
      const memberRemoved = members.filter((member) => {
        return member.pk !== `user_${userId}`;
      });

      API.del("undercoverElfApi", `/users/${userId}/groups?groupId=${id}`, {
        body: {
          memberRemoved,
          groupRemoved: removedGroupFromUserProfile,
        },
      })
        .then((response) => {
          console.log(response);
          commit("setLoading", { of: "LeaveGroup", to: false });
          alert(`You successfully left ${groupName}`);
          router.push({ path: "/" });
        })
        .catch((err) => {
          commit("setLoading", { of: "LeaveGroup", to: false });
          console.log(err);
        });
    }
  },

  /*removeUser(context, { userId, groupId }) {
    console.log(userId, groupId);
    // make a request to API to delete the user group entry, to user's profile to remove group from groups array, and to group meta to remove member from members array
  },*/

  drawNames({ commit, dispatch }, { groupId }) {
    var result = confirm(
      "Are you sure you want to draw names? The group will be closed and no new members will be able to join."
    );

    if (result) {
      commit("setLoading", { of: "DrawNames", to: true });
      const split = groupId.split("_");
      const id = split[1];

      API.get("undercoverElfApi", `/draw-groups?id=${id}`, {})
        .then(({ body }) => {
          let response = body;
          let copyResponse = body.map((x) => x);
          dispatch("assignNames", { response, copyResponse, id });
        })
        .catch((err) => {
          commit("setLoading", { of: "DrawNames", to: false });
          console.log(err);
        });
    } else return;
  },

  async pickNames(context, { response, copyResponse }) {
    function randomNum(length) {
      return Math.floor(Math.random() * (length - 0) + 0);
    }
    let length = copyResponse.length;
    let count = 0;
    for (let i = 0; i < response.length; i++) {
      let index = randomNum(length);
      let buyFor = copyResponse[index];
      // here to make sure there are no infinite loops
      if (count > 15) {
        console.log("exceed max call");
        break;
      }
      //

      // if person picks their own name and it is NOT the last iteration, try again
      // if person picks their own name and it IS the last iteration, pick a random person in the array who has already been assigned a person to buy for, take this assigned person and give it to the person who had picked their own name. Then, the random person who was picked is now buying for the person who picked their own name
      if (response[i].pk === buyFor.pk) {
        if (i === response.length - 1) {
          // swap two assignments
          const random = randomNum(response.length - 1);

          let randomBF = response[random].buyingForUserId;
          let currentIterationName = response[i].name;

          if (randomBF === currentIterationName) {
            i = i - 1;
            count++;
            continue;
          } else {
            // Last person to pick someone buying for whoever random person had
            response[i].buyingForName = response[random].buyingForName;
            response[i].buyingForUserId = response[random].buyingForUserId;
            // Random person now buying for last person to pick someone
            response[random].buyingForName = response[i].name;
            response[random].buyingForUserId = response[i].pk;
          }
        } else {
          i = i - 1;
          count++;
          continue;
        }
      } else {
        response[i].buyingForName = buyFor.name;
        response[i].buyingForUserId = buyFor.pk;
        copyResponse.splice(index, 1);
        length = length - 1;
      }
    }
    return;
  },

  async assignNames({ commit, dispatch }, { response, copyResponse, id }) {
    try {
      await dispatch("pickNames", { response, copyResponse });
      const assignNamesResponse = await API.patch(
        "undercoverElfApi",
        `/draw-names?id=${id}`,
        {
          body: response,
        }
      );
      alert(
        "Names have been drawn successfully! You will now be redirected to the group page where you can view the person you are buying for's wishlist"
      );
      commit("setLoading", { of: "DrawNames", to: false });
      router.push({ path: `/groups/group_${id}/profile` });
    } catch (err) {
      commit("setLoading", { of: "DrawNames", to: false });
      console.log(err);
      alert("There has been an error drawing names. Please try again.");
    }
  },

  updateWishlist(context, { userId, groupId, wishlist, localStorageName }) {
    API.patch(
      "undercoverElfApi",
      `/users/user_${userId}/groups?groupId=${groupId}`,
      {
        body: wishlist,
      }
    )
      .then((response) => {
        localStorage[localStorageName] = JSON.stringify(wishlist);
      })
      .catch((err) => {
        console.log(err);
      });
  },
};

export default { state, getters, actions, mutations, namespaced };

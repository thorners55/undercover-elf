//import axios from "axios";
import { API } from "aws-amplify";

const namespaced = true;

const state = {
  groups: [],
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
};

export default { state, getters, actions, mutations, namespaced };

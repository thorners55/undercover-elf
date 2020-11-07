import { API } from "aws-amplify";
const namespaced = true;

const state = {
  userID: "",
  name: "",
  groups: [],
};

const getters = {};

const mutations = {
  setProfile(state, profile) {
    console.log("set profile", profile);
    state.groups = profile.groups;
    state.name = profile.name;
    state.userId = profile.pk;
  },
};

const actions = {
  fetchUserProfile({ commit }, userId) {
    console.log("fetch user profile");
    API.get("undercoverElfApi", `/users/${userId}/profile`, {})
      .then(({ body }) => {
        console.log(body);
        commit("setProfile", body);
      })
      .catch((err) => {
        console.log(err);
      });
  },
};

export default { state, getters, actions, mutations, namespaced };

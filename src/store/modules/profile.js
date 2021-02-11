import { API } from "aws-amplify";
const namespaced = true;

const state = {
  userId: "",
  name: "",
  groups: [],
  userGroupsLoading: true,
  loadingUserProfile: true,
};

const getters = {
  groupAdmin() {
    const groups = JSON.parse(localStorage.undercoverElfGroups);
    const adminGroups = groups.filter((group) => {
      return group.admin === 1;
    });
    return adminGroups;
  },
};

const mutations = {
  setProfile(state, profile) {
    if (!profile) {
      state.userGroupsLoading = false;
      return;
    } else {
      state.groups = profile.groups;
      state.name = profile.name;
      state.userId = profile.pk;
      localStorage.setItem(
        "undercoverElfGroups",
        JSON.stringify(profile.groups)
      );
      state.userGroupsLoading = false;
      state.loadingUserProfile = false;
    }
  },
};

const actions = {
  fetchUserProfile({ commit }, userId) {
    if (!userId) {
      userId = localStorage.undercoverElfUserId;
    }
    API.get("undercoverElfApi", `/users/${userId}/profile`, {})
      .then(({ body }) => {
        commit("setProfile", body);
      })
      .catch((err) => {
        // need to stop it from stuck on loading if there is an error
        console.log(err);
        alert(
          "An error has occured retrieving your account information. Please get in touch with Stephanie."
        );
      });
  },
};

export default { state, getters, actions, mutations, namespaced };

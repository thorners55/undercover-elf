import { Auth } from "aws-amplify";

const namespaced = true;

const state = {
  loggingIn: false,
  loggedIn: false,
  userId: "",
  name: "",
};

const getters = {};

const mutations = {
  setUserId(state, { userId, name }) {
    state.userId = userId;
    state.loggedIn = true;
    state.name = name;
  },

  setLoggedOut(state) {
    state.loggedIn = false;
    state.userId = "";
    state.name = "";
  },
};

const actions = {
  logIn({ commit }, { userId, name }) {
    commit("setUserId", { userId, name });
    /* // user is automatically logged out after 30 minutes
    setTimeout(() => commit("setLoggedOut"), 1800000); */
  },

  logOut({ commit }) {
    commit("setLoggedOut");
  },

  async isLoggedIn({ commit }) {
    try {
      let isAuthenticated = await Auth.currentAuthenticatedUser();
      if (isAuthenticated.username) {
        commit("setUserId", {
          userId: isAuthenticated.username,
          name: isAuthenticated.attributes.name,
        });
      } else return;
    } catch (error) {
      console.log(error);
    }
  },
};

export default { state, getters, actions, mutations, namespaced };

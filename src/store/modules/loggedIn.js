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
    console.log("log in mutation");
    state.userId = userId;
    state.loggedIn = true;
    state.name = name;
  },
  isLoggedIn(state) {
    if (localStorage.undercoverElfLoggedIn === "true") {
      state.loggedIn = true;
      state.userId = localStorage.undercoverElfUserId;
      state.name = localStorage.undercoverElfName;
    }
  },

  setLoggedOut(state) {
    state.loggedIn = false;
    state.userId = "";
    state.name = "";
    localStorage.removeItem("undercoverElfLoggedIn");
    localStorage.removeItem("undercoverElfName");
    localStorage.removeItem("undercoverElfUserId");
    localStorage.removeItem("undercoverElfGroups");
  },
};

const actions = {
  logIn({ commit }, { userId, name }) {
    console.log("log in action");
    commit("setUserId", { userId, name });
    localStorage.setItem("undercoverElfUserId", userId);
    localStorage.setItem("undercoverElfLoggedIn", "true");
    localStorage.setItem("undercoverElfName", name);
  },

  logOut({ commit }) {
    commit("setLoggedOut");
  },
};

export default { state, getters, actions, mutations, namespaced };

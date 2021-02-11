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
    localStorage.removeItem("undercoverElfName");
    localStorage.undercoverElfGroups = "[]";
  },
};

const actions = {
  logIn({ commit }, { userId, name }) {
    commit("setUserId", { userId, name });
    localStorage.setItem("undercoverElfUserId", userId);
    localStorage.setItem("undercoverElfLoggedIn", "true");
    localStorage.setItem("undercoverElfName", name);
    setTimeout(() => {
      console.log("logging out");
      document.addEventListener("beforeunload", commit("setLoggedOut")), 2000;
    });
  },

  logOut({ commit }) {
    localStorage.undercoverElfLoggedIn = false;
    commit("setLoggedOut");
  },
};

export default { state, getters, actions, mutations, namespaced };

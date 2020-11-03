const namespaced = true;

const state = {
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
    console.log(localStorage.loggedIn === "true");
    if (localStorage.loggedIn === "true") {
      state.loggedIn = true;
      state.userId = localStorage.userId;
      state.name = localStorage.name;
    }
  },

  setLoggedOut(state) {
    state.loggedIn = false;
    state.userId = "";
    state.name = "";
  },
};

const actions = {
  logIn({ commit }, { userId, name }) {
    console.log("log in action");
    commit("setUserId", { userId, name });
    localStorage.setItem("userId", userId);
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("name", name);
  },

  logOut({ commit }) {
    commit("setLoggedOut");
  },
};

export default { state, getters, actions, mutations, namespaced };

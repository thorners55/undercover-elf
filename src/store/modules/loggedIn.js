const state = {
  isLoggedIn: "false",
  userId: "",
  name: "",
};

const getters = {
  loggedIn: (state) => state.isLoggedIn,
};

const mutations = {
  setUserId(state, userId, name) {
    state.userId = userId;
    state.isLoggedIn = true;
    state.name = name;
  },
};

const actions = {
  logIn({ commit }, { userId, name }) {
    commit("setUserId", { userId, name });
    localStorage.setItem("userId", userId);
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("name", name);
  },
};

export default { state, getters, actions, mutations };

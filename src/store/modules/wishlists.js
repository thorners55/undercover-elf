import { API } from "aws-amplify";

const namespaced = true;

const state = {
  name: "",
  groupName: "",
  wishlist: [],
  loadingWishlist: false,
};

const getters = {};

const mutations = {
  setWishlist(state, { name, wishlist, groupName }) {
    state.name = name;
    state.wishlist = wishlist;
    state.groupName = groupName;
  },

  setLoading(state, trueOrFalse) {
    state.loadingWishlist = trueOrFalse;
  },
};

const actions = {
  fetchWishlist({ commit }, { userId, groupId }) {
    commit("setLoading", true);
    // fetch wishlist from API, user groups
    API.get(
      "undercoverElfApi",
      `/users/${userId}/groups?groupId=${groupId}&wishlist=true`
    )
      .then(({ body }) => {
        commit("setWishlist", body);
        commit("setLoading", false);
      })
      .catch((err) => {
        console.log(err);
        commit("setLoading", false);
      });
  },
};

export default { state, getters, mutations, actions, namespaced };

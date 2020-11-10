import { API } from "aws-amplify";

const namespaced = true;

const state = {
  name: "",
  groupName: "",
  wishlist: [],
};

const getters = {};

const mutations = {
  setWishlist(state, { name, wishlist, groupName }) {
    state.name = name;
    state.wishlist = wishlist;
    state.groupName = groupName;
  },
};

const actions = {
  fetchWishlist({ commit }, { userId, groupId }) {
    console.log(userId, groupId);
    // fetch wishlist from API, user groups
    API.get(
      "undercoverElfApi",
      `/users/${userId}/groups?groupId=${groupId}&wishlist=true`
    )
      .then(({ body }) => {
        commit("setWishlist", body);
        console.log(body);
      })
      .catch((err) => {
        console.log(err);
      });
  },
};

export default { state, getters, mutations, actions, namespaced };

import { API } from "aws-amplify";

const namespaced = true;

const state = {
  name: "",
  groupName: "",
  buyingForWishlist: [],
  loadingWishlist: false,
  myWishlist: [],
};

const getters = {};

const mutations = {
  setBuyingForWishlist(state, { name, wishlist, groupName }) {
    state.name = name;
    state.buyingForWishlist = wishlist;
    state.groupName = groupName;
  },

  setMyWishlist(state, updatedWishlist) {
    state.myWishlist = updatedWishlist;
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
        commit("setBuyingForWishlist", body);
        commit("setLoading", false);
      })
      .catch((err) => {
        console.log(err);
        commit("setLoading", false);
      });
  },

  updateWishlist({ commit }, { userId, groupId, wishlist, localStorageName }) {
    API.patch(
      "undercoverElfApi",
      `/users/user_${userId}/groups?groupId=${groupId}`,
      {
        body: wishlist,
      }
    )
      .then(() => {
        commit("setMyWishlist", wishlist);
        localStorage[localStorageName] = JSON.stringify(wishlist);
      })
      .catch((err) => {
        console.log(err);
      });
  },
};

export default { state, getters, mutations, actions, namespaced };

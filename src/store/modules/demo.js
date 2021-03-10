import router from "../../router";
import date from "date-and-time";

const namespaced = true;

const state = {
  profile: {
    name: "Harry Potter",
    email: "ilovehedwig@hogwarts.co.uk",
  },
  groups: [
    {
      name: "Dumbledore's Army",
      groupId: "dum813d0r3s4rmy",
      exchange: "1995-12-15",
      budget: "3 Galleons",
      admin: true,
      adminName: "Harry Potter",
      buyingFor: "Luna Lovegood",
      closed: true,
      members: [
        "Harry Potter",
        "Padma Patil",
        "Parvarti Patil",
        "Hannah Abbott",
        "Lavender Brown",
        "Katie Bell",
        "Susan Bones",
        "Cho Chang",
        "Colin Creevey",
        "Hermione Granger",
        "Neville Longbottom",
        "Luna Lovegood",
        "Fred Weasley",
        "George Weasley",
        "Ginny Weasley",
        "Ron Weasley",
      ],
      wishlist: [
        {
          comment: "Or you can get them at Weasley's Wizard Wheezes!",
          description: "Extendable ears",
          id: "bkeguvgfggaldchtbwbqtbsfkfwpihqassnq",
          isEditing: false,
          url: "https://harrypottershop.co.uk/products/extendable-ear",
        },
        {
          comment: "Can be found at Quality Quidditch Supplies in Diagon Alley",
          description: "Broomstick servicing kit",
          id: "bgkqlhkeyghvmusafncnkeadnmvomnfejesfu",
          isEditing: false,
          url: "",
        },
      ],
      buyingForWishlist: [
        {
          comment: "Dervish and Banges in Hogsmeade sell them",
          description: "Remembrall",
          url: "",
        },
        {
          comment: "",
          description: "Bertie Botts Every Flavour Beans",
          url:
            "https://harrypottershop.co.uk/products/bertie-botts-every-flavour-beans",
        },
        {
          comment: "",
          description: "Chocolate frog",
          url:
            "https://harrypottershop.co.uk/products/chocolate-frog-with-authentic-film-packaging?_pos=13&_sid=12a48864d&_ss=r",
        },
      ],
    },
    {
      name: "Gryffindor Quidditch Team",
      groupId: "qu1dd1tch",
      exchange: "1991-12-15",
      budget: "2 Galleons",
      admin: false,
      adminName: "Oliver Wood",
      closed: false,
      buyingFor: "Fred Weasley",
      members: [
        "Fred Weasley",
        "George Weasley",
        "Angelina Johnson",
        "Alicia Spinnet",
        "Harry Potter",
        "Oliver Wood",
      ],
      wishlist: [],
    },
  ],
};

const getters = {
  getGroup: (state) => ({ groupId, editing }) => {
    let groupToGet = state.groups.find((group) => group.groupId == groupId);

    if (!groupToGet) {
      return;
    } else {
      let group = JSON.parse(JSON.stringify(groupToGet));

      if (!editing) {
        let formattedDate = date.transform(
          group.exchange,
          "YYYY-MM-DD",
          "DD-MM-YYYY"
        );

        group.exchange = formattedDate;
      }
      return group;
    }
  },

  getAdminFor: (state) => () => {
    let adminFor = state.groups.filter(
      (group) => group.adminName == state.profile.name
    );
    return adminFor;
  },

  getMyWishlist: (state) => (groupId) => {
    let group = state.groups.find((group) => group.groupId == groupId);

    if (!group) {
      return;
    } else {
      return { wishlist: group.wishlist, group };
    }
  },

  getBuyingForWishlist: (state) => (groupId) => {
    let group = state.groups.find((group) => group.groupId == groupId);
    return {
      wishlist: group.buyingForWishlist,
      buyingFor: group.buyingFor,
      group: group.name,
    };
  },
};

const mutations = {
  setCreatedGroup(state, newGroup) {
    let group = {
      name: newGroup.groupName,
      groupId: newGroup.createdGroupId,
      exchange: newGroup.exchange,
      budget: newGroup.budget,
      admin: true,
      adminName: state.profile.name,
      closed: false,
      buyingFor: "",
      members: [state.profile.name],
      wishlist: [],
    };
    state.groups.push(group);
    state.createGroupSuccess = true;
  },

  setUpdatedGroup(state, { groupId, groupInfoToUpdate }) {
    const { budget, exchange, groupName } = groupInfoToUpdate;

    for (let i = 0; i < state.groups.length; i++) {
      if (state.groups[i].groupId === groupId) {
        state.groups[i].budget = budget;
        state.groups[i].exchange = exchange;
        state.groups[i].name = groupName;
      }
    }
  },

  setLeaveGroup(state, groupId) {
    state.groups = state.groups.filter((group) => {
      return group.groupId !== groupId;
    });
    router.push({ path: "/" });
    alert("Successfully left the group");
  },

  setMyWishlist(state, { wishlist, groupName }) {
    for (let i = 0; i < state.groups.length; i++) {
      if (state.groups[i].name == groupName) {
        state.groups[i].wishlist = wishlist;
      }
    }
  },
};

const actions = {
  postGroup({ commit }, newGroup) {
    commit("setCreatedGroup", newGroup);
  },

  updateGroup({ commit }, { groupId, groupInfoToUpdate }) {
    commit("setUpdatedGroup", {
      groupId,
      groupInfoToUpdate,
    });
  },

  leaveGroup({ commit }, groupId) {
    let result = confirm("Are you sure you want to leave this group?");

    if (result) {
      commit("setLeaveGroup", groupId);
    }
  },

  updateWishlist({ commit }, { wishlist, groupName }) {
    commit("setMyWishlist", { wishlist, groupName });
  },
};

export default { state, getters, actions, mutations, namespaced };

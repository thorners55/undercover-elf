<template>
  <div>
    <h2>{{ groupInfo.groupName }}</h2>
    <router-link
      v-if="userGroupInfo.admin"
      :to="`/groups/edit?groupId=${groupId}`"
      >Group settings</router-link
    >
    <li v-for="member in groupInfo.members" :key="member.pk">
      {{ member.name }}
    </li>
    <p>Exchange date: {{ groupInfo.exchange }}</p>
    <p>Budget: £{{ groupInfo.budget }}</p>
    <div v-if="groupInfo.closed === 1">
      <p>You are buying for: {{ userGroupInfo.buyingForName }}</p>
      <router-link
        :to="`/wishlist/${userGroupInfo.buyingForUserId}?groupId=${groupId}`"
        >View {{ userGroupInfo.buyingForName }}'s wishlist</router-link
      >
    </div>
    <p v-if="groupInfo.closed === 0">
      Names have not been drawn yet, but you can still get started on your
      wishlist!
    </p>

    <!-- WISHLIST ITEMS -->
    <p v-if="hasEdited">
      IMPORTANT: You must press "Save all changes" to submit changes made to
      your wishlist before leaving the page.
    </p>
    <ul>
      <li v-for="item in userGroupInfo.wishlist" :key="item.url">
        <div v-if="!item.isEditing" v-bind:class="{ editing: item.isEditing }">
          <p>{{ item.description }}</p>
          <p>{{ item.url }}</p>
          <p>{{ item.comment }}</p>

          <button
            v-on:click="
              item.isEditing = !item.isEditing;
              hasEdited = true;
            "
          >
            Edit item
          </button>
          <button
            type="button"
            v-on:click="
              deleteItem(item.id);
              hasEdited = true;
            "
          >
            Delete item
          </button>
        </div>

        <div v-if="item.isEditing" v-bind:class="{ editing: item.isEditing }">
          <form
            v-on:submit.prevent
            v-on:keyup.enter="
              updateWishlistItem(item.id);
              item.isEditing = false;
            "
          >
            <input
              type="text"
              :value="`${item.description}`"
              v-on:input="(event) => updateDescription(event)"
              required
            />
            <input
              type="text"
              :value="`${item.url}`"
              v-on:input="(event) => updateUrl(event)"
            />
            <input
              type="text"
              :value="`${item.comment}`"
              v-on:input="(event) => updateComment(event)"
            />
            <button
              type="button"
              v-on:click="
                updateWishlistItem(item.id);
                item.isEditing = false;
              "
            >
              Done editing
            </button>
          </form>
        </div>
      </li>
    </ul>
    <button
      type="submit"
      v-if="!addingItem"
      v-on:click="
        addingItem = true;
        hasEdited = true;
      "
    >
      Add new item
    </button>
    <form v-on:submit.prevent v-if="addingItem" v-on:keyup.enter="addItem">
      Description:
      <input
        type="text"
        id="add-new-item-description"
        v-model="addItemDescription"
        required
      />
      Link to item:
      <input type="text" id="add-new-item-url" v-model="addItemUrl" /> Comment:
      <input type="text" id="add-new-item-comment" v-model="addItemComment" />
      <button type="button" v-on:click="addItem">
        Add item
      </button>
    </form>
    <button
      v-if="hasEdited"
      v-on:click="
        updateWishlist({ userId, groupId, wishlist: userGroupInfo.wishlist })
      "
    >
      Save all changes
    </button>

    <button
      v-if="userGroupInfo.admin === 0"
      v-on:click="leaveGroup(userId, groupId, groupInfo.members)"
    >
      Leave group
    </button>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { API } from "aws-amplify";
import { v4 as uuidv4 } from "uuid";

export default {
  name: "GroupPage",
  methods: {
    ...mapActions("groups", [
      "fetchGroupInfo",
      "leaveGroup",
      "getGroupInfo",
      "fetchUserGroupInfo",
      "updateWishlist",
    ]),
    leaveGroup(userId, groupId, members) {
      console.log("leaveGroup", userId, groupId);
      const split = groupId.split("_");
      const id = split[1];
      // make a new array with the member to be deleted removed, use this to update the group metadata
      const memberRemoved = members.filter((member) => {
        return member.pk !== `user_${userId}`;
      });

      API.del("undercoverElfApi", `/users/${userId}/groups?groupId=${id}`, {
        body: {
          memberRemoved,
        },
      })
        .then((response) => {
          console.log(response);
          this.$router.push({ path: "/" });
        })
        .catch((err) => {
          console.log(err);
        });
    },
    updateDescription(event) {
      this.updatedDescription = event.target.value;
    },
    updateUrl(event) {
      this.updatedUrl = event.target.value;
    },
    updateComment(event) {
      this.updatedComment = event.target.value;
    },
    updateWishlistItem(id) {
      // if updated description, url or comment is undefined, don't update it
      // Can't use v-model because using value to fill in the input box, so have to use the on input function. So, if only edit one thing, everything else will be blank, so have to separate them out like this because otherwise tries to submit blank values.
      // NEED TO DISABLE ANY BUTTON THAT ISNT THAT ITEM WHEN CLICK EDITING ON ONE ITEM

      // if the updated item doesn't have a url or comment, alert that it must have it
      if (!this.updatedUrl || !this.updatedComment) {
        alert(
          "Item must have either a link to where the item is sold, or a comment."
        );
      } else {
        this.userGroupInfo.wishlist.forEach((item) => {
          if (item.id === id) {
            if (this.updatedDescription) {
              item.description = this.updatedDescription;
            }
            if (this.updatedUrl) {
              item.url = this.updatedUrl;
            }
            if (this.updatedComment) {
              item.comment = this.updatedComment;
            }
          }
        });
      }
    },
    addItem() {
      console.log("addItem");

      if (!this.addItemComment || this.addItemUrl) {
        alert(
          "Item must have either a link to where the item is sold, or a comment."
        );
      } else {
        const id = uuidv4();

        const addedItem = {
          description: this.addItemDescription,
          url: this.addItemUrl,
          comment: this.addItemComment,
          isEditing: false,
          id,
        };
        this.userGroupInfo.wishlist.push(addedItem);

        this.hasEdited = true;
        (this.addItemDescription = ""),
          (this.addItemUrl = ""),
          (this.addItemComment = "");
        this.addingItem = false;
        console.log(this.userGroupInfo.wishlist);
      }
    },
    deleteItem(id) {
      var result = confirm("Are you sure you want to delete this item?");
      if (result) {
        //Logic to delete the item
        const updatedWishlist = this.userGroupInfo.wishlist.filter((item) => {
          return item.id !== id;
        });

        this.userGroupInfo.wishlist = updatedWishlist;
        alert(
          "Item deleted - please press 'Save all changes' to submit your updated wishlist."
        );
      }
    },
  },
  computed: {
    groupId() {
      return this.$route.params.groupId;
    },
    ...mapState("loggedIn", ["userId"]),
    ...mapState("groups", ["groupInfo", "userGroupInfo"]),
  },
  created() {
    console.log("GroupPage created");
    console.log(this.groupId, this.userId);
    this.fetchGroupInfo(this.groupId);
    this.fetchUserGroupInfo({ userId: this.userId, groupId: this.groupId });
  },
  data() {
    return {
      hasEdited: false,
      addingItem: false,
      updatedDescription: undefined,
      updatedUrl: undefined,
      updatedComment: undefined,
      addItemDescription: "",
      addItemUrl: "",
      addItemComment: "",
    };
  },
};
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.editing {
  background-color: pink;
  border: 2px solid red;
}
</style>

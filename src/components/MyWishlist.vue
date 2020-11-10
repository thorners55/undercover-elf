<template>
  <div class="top-of-page">
    <h2>Wishlist</h2>
    <p
      v-if="userGroupInfo.wishlist && userGroupInfo.wishlist.length < 1"
    >You have no items on your wishlist! Press 'Add new item' to get started!</p>
    <p v-if="hasEdited">
      <b>
        IMPORTANT: You must press 'Save all changes' to submit changes made to
        your wishlist before leaving the page.
      </b>
    </p>
    <ul>
      <li v-for="item in userGroupInfo.wishlist" :key="item.id">
        <div class="wishlist-item-container">
          <div
            class="wishlist-item"
            v-if="!item.isEditing"
            v-bind:class="{ editing: item.isEditing }"
          >
            <div>
              <p class="description">{{ item.description }}</p>
              <p>
                <a :href="`${item.url}`">{{ item.url }}</a>
              </p>
              <p>{{ item.comment }}</p>
            </div>
          </div>

          <!-- if this item isnt being edited, all other edit item buttons are disabled -->

          <div class="wishlist-item-buttons">
            <button
              v-on:click="
              item.isEditing = !item.isEditing;
              hasEdited = true;
            "
              :disabled="!item.isEditing && hasEdited ? true : false"
            >
              <span class="edit-delete">
                <i class="fas fa-pencil-alt"></i>
              </span>
            </button>
            <button
              type="button"
              v-on:click="
              deleteItem(item.id);
              hasEdited = true;
            "
            >
              <span class="edit-delete">
                <i class="fas fa-trash-alt"></i>
              </span>
            </button>
          </div>
        </div>

        <div v-if="item.isEditing" v-bind:class="{ editing: item.isEditing }">
          <form
            id="add-wishlist-item"
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
            <input type="text" :value="`${item.url}`" v-on:input="(event) => updateUrl(event)" />
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
            >Save changes</button>
            <button
              for="add-wishlist-item"
              type="button"
              v-on:click="item.isEditing = !item.isEditing; hasEdited = false"
            >Cancel editing</button>
          </form>
        </div>
      </li>
    </ul>
    <button
      type="button"
      v-if="!addingItem"
      v-on:click="
        addingItem = true;
        hasEdited = true;
      "
    >Add new item</button>
    <div v-if="addingItem">
      <!-- required does not work because button is outside of form for styling purposes and on key up submits form automatically -->
      <form v-on:submit.prevent v-if="addingItem" v-on:keyup.enter="addItem">
        Description:
        <input
          type="text"
          id="add-new-item-description"
          v-model="addItemDescription"
          placeholder="e.g. Socks"
        />
        Link to item:
        <input
          type="text"
          id="add-new-item-url"
          v-model="addItemUrl"
          placeholder
        /> Comment:
        <textarea
          type="text"
          id="add-new-item-comment"
          v-model="addItemComment"
          placeholder="Any above ankle length socks"
          rows="6"
          maxlength="250"
        />
      </form>
      <button type="button" v-on:click="addItem">Add item</button>
      <button type="button" v-on:click="cancelAddItem">Cancel</button>
    </div>
    <button
      type="button"
      v-if="hasEdited && !addingItem && userGroupInfo.wishlist.length > 0"
      v-on:click="
        updateWishlist({ userId, groupId, wishlist: userGroupInfo.wishlist })
      "
    >Save all changes</button>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { v4 as uuidv4 } from "uuid";

export default {
  name: "MyWishlist",
  computed: {
    groupId() {
      return this.$route.query.groupId;
    },
    ...mapState("loggedIn", ["userId"]),
    ...mapState("groups", ["groupInfo", "userGroupInfo"])
  },
  created() {
    this.fetchUserGroupInfo({ userId: this.userId, groupId: this.groupId });
  },
  methods: {
    ...mapActions("groups", ["fetchUserGroupInfo", "updateWishlist"]),
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

      // if the updated item doesn't have a url or comment, alert that it must have it
      if (!this.updatedUrl || !this.updatedComment) {
        alert("Item must have either a link to the item or a comment.");
      } else {
        this.userGroupInfo.wishlist.forEach(item => {
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

      if (!this.addItemComment && !this.addItemUrl) {
        console.log(
          this.addItemComment,
          this.addItemUrl,
          this.addItemDescription
        );
        alert(
          "Item must have either a link to where the item is sold, or a comment."
        );
      } else {
        const addedItem = {
          description: this.addItemDescription,
          url: this.addItemUrl,
          comment: this.addItemComment,
          isEditing: false,
          id: uuidv4()
        };
        this.userGroupInfo.wishlist.push(addedItem);

        this.hasEdited = true;
        this.addItemDescription = "";
        this.addItemUrl = "";
        this.addItemComment = "";
        this.addingItem = false;
        console.log(this.userGroupInfo.wishlist);
      }
    },
    cancelAddItem() {
      this.addItemDescription = "";
      this.addItemUrl = "";
      this.addItemComment = "";
      this.addingItem = false;
    },
    deleteItem(id) {
      var result = confirm("Are you sure you want to delete this item?");
      if (result) {
        const updatedWishlist = this.userGroupInfo.wishlist.filter(item => {
          return item.id !== id;
        });

        this.userGroupInfo.wishlist = updatedWishlist;
        alert(
          "Item deleted - please press 'Save all changes' to submit your updated wishlist."
        );
      }
    }
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
      addItemComment: ""
    };
  }
};
</script>

<style scoped>
.top-of-page {
  width: 70%;
  margin: auto;
}

button {
  display: block;
  margin: 1rem auto;
}
form {
  display: grid;
  grid-template-columns: 40% auto;
  row-gap: 1ch;
  margin-left: auto;
  margin-right: auto;
  width: 40%;
}
label {
  text-align: left;
}

textarea {
  font-family: Sans-serif;
}

p {
  width: 60%;
  margin: 2rem auto;
}

div.wishlist-item > div > p {
  margin-right: 1rem;
  padding: 0 1rem;
  width: auto;
}

.wishlist-item-container {
  display: flex;
  flex-direction: row;
  box-shadow: 0 4px 8px 0 #2c3e50;
  border-radius: 1rem;
  background-color: #f1d8ce;
  margin: 2rem 0;
  justify-content: center;
}

.wishlist-item-buttons {
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin-right: 1rem;
}
.description {
  font-weight: bold;
  font-size: 1.3rem;
}
.edit-delete {
  font-size: 1.2rem;
  color: #2c3e50;
}
</style>
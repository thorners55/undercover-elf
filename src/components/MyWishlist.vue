<template>
  <div class="top-of-page">
    <img src="../assets/gift.svg" id="logo" width="50rem" />
    <h2>Wishlist</h2>
    <router-link :to="`/groups/${groupId}/profile`">Back to {{userGroupInfo.groupName}}</router-link>
    <p
      v-if="userGroupInfo.wishlist && userGroupInfo.wishlist.length < 1"
    >You have no items on your wishlist! Press 'Add new item' to get started!</p>
    <p v-if="hasEdited">
      <b>
        IMPORTANT! You must press 'Save all changes' to submit changes made to
        your wishlist before leaving the page.
      </b>
    </p>
    <ul>
      <li v-for="item in userGroupInfo.wishlist" :key="item.id" :item="item">
        <div class="wishlist-item-container" v-if="!item.isEditing">
          <div
            :class="item.isEditing ? 'wishlist-item-editing wishlist-item' : 'wishlist-item'"
            v-if="!item.isEditing"
          >
            <!--   v-bind:class="{ editing: item.isEditing }" -->

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
              class="edit"
              v-on:click="
              item.isEditing = !item.isEditing;
              hasEdited = true;
            "
              :disabled="item.isEditing === false && hasEdited ? true : false"
            >
              <span class="edit-delete">
                <i class="fas fa-pencil-alt"></i>
              </span>
            </button>
            <button
              class="delete"
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

        <div v-if="item.isEditing" class="wishlist-item-container-form-editing">
          <form
            id="edit-wishlist-item"
            class="edit-wishlist-item"
            v-on:submit.prevent
            v-on:keyup.enter="
              updateWishlistItem(item.id);
              item.isEditing = false;
            "
          >
            <label for="update-item-description">Description:</label>
            <input
              type="text"
              id="update-item-description"
              :value="`${item.description}`"
              v-on:input="(event) => updateDescription(event)"
              required
            />
            <label for="update-item-url">Link to item:</label>
            <input type="text" :value="`${item.url}`" v-on:input="(event) => updateUrl(event)" />
            <label for="update-item-comment">Comment:</label>
            <input
              type="text"
              id="update-item-comment"
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
              for="edit-wishlist-item"
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
    >Add new wishlist item</button>
    <div v-if="addingItem" class="wishlist-item-container-form-editing">
      <!-- required does not work because button is outside of form for styling purposes and on key up submits form automatically -->
      <form
        id="add-wishlist-item-form"
        v-on:submit.prevent
        v-if="addingItem"
        v-on:keyup.enter="addItem"
      >
        <label for="add-new-item-description">Description:</label>
        <input
          type="text"
          id="add-new-item-description"
          v-model="addItemDescription"
          placeholder="e.g. Socks"
        />
        <label for="add-new-item-url">Link to item:</label>
        <input type="text" id="add-new-item-url" v-model="addItemUrl" placeholder />
        <label for="add-new-item-comment">Comment:</label>
        <textarea
          type="text"
          id="add-new-item-comment"
          v-model="addItemComment"
          placeholder="Any above ankle length socks"
          rows="6"
          maxlength="250"
        />
      </form>
    </div>
    <button
      for="add-wishlist-item-form"
      type="button"
      v-on:click="addItem"
      id="add-item-button"
      v-if="addingItem"
    >Add this item</button>

    <button type="button" v-if="addingItem" v-on:click="cancelAddItem">Cancel changes</button>
    <button
      type="button"
      v-if="hasEdited && !addingItem && userGroupInfo.wishlist.length > 0"
      v-on:click="
        updateWishlist({ userId, groupId, wishlist: userGroupInfo.wishlist }); hasEdited = false;
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
  margin-top: 5ch;
}

ul {
  width: 70%;
  margin: auto;
}

button {
  display: block;
  margin: 1rem auto;
}

button:disabled {
  background-color: rgb(206, 203, 203);
  color: grey;
}

input {
  margin: 1ch;
}

form {
  display: block;
  padding: 1rem 0;
  margin: auto;
  width: auto;
}

label {
  text-align: center;
  display: block;
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
  border: 2px solid #2c3e50;
  border-radius: 1rem;
  margin: 2rem 0;
  justify-content: center;
}

.wishlist-item-container-form-editing {
  display: flex;
  flex-direction: row;
  border: 2px solid #2c3e50;
  background-color: #f0da9e;
  border-radius: 1rem;
  margin: 2rem 0;
  justify-content: center;
}

.wishlist-item-buttons {
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin-right: 1rem;
}

.wishlist-item-editing {
  background-color: #f0da9e;
}

button:hover {
  background-color: #fefefa;
}

.edit {
  background-color: rgb(91, 175, 91);
}

.delete {
  background-color: rgb(226, 83, 83);
}

.description {
  font-weight: bold;
  font-size: 1.3rem;
}

#add-item-button {
  margin-top: -1rem;
  margin-bottom: 4rem;
}

@media (max-width: 800px) {
  p {
    width: 60%;
  }

  .wishlist-item > div > p {
    width: 70%;
    word-wrap: break-word;
  }

  .wishlist-item-container {
    display: flex;
    flex-direction: column;
  }
}
</style>
<template>
  <div class="top-of-page">
    <img src="../assets/gift.svg" id="logo" width="50rem" />
    <h2>Wishlist</h2>
    <div v-if="fetchedUserGroupInfo">
      <router-link :to="`/groups/${groupId}/profile`">Back to {{ userGroupInfo.groupName }}</router-link>
      <p
        v-if="userGroupInfo.wishlist && userGroupInfo.wishlist.length < 1"
      >You have no items on your wishlist! Press 'Add new item' to get started!</p>
      <ul>
        <li v-for="(item, index) in userGroupInfo.wishlist" :key="item.id" :item="item">
          <div class="wishlist-item-container" v-if="!item.isEditing">
            <div
              :class="
              item.isEditing
                ? 'wishlist-item-editing wishlist-item'
                : 'wishlist-item'
            "
              v-if="!item.isEditing"
            >
              <!--   v-bind:class="{ editing: item.isEditing }" -->

              <div>
                <p class="description">{{ item.description }}</p>
                <a class="item-link" :href="`${item.url}`">{{ item.url }}</a>
                <p>{{ item.comment }}</p>
              </div>
            </div>

            <!-- if this item isnt being edited, all other edit item buttons are disabled -->

            <div class="wishlist-item-buttons">
              <button
                class="edit"
                v-on:click="
                item.isEditing = !item.isEditing;
                editing = true;
              "
                :disabled="item.isEditing === false && editing ? true : false"
              >
                <span class="edit-delete">
                  <i class="fas fa-pencil-alt"></i>
                </span>
              </button>
              <button
                class="delete"
                type="button"
                v-on:click="
                deleteItem(item.id); editing = false;
              "
              >
                <span class="edit-delete">
                  <i class="fas fa-trash-alt"></i>
                </span>
              </button>
            </div>
          </div>

          <div v-if="item.isEditing" class="wishlist-item-container-form-editing">
            <form id="edit-wishlist-item" class="edit-wishlist-item" v-on:submit.prevent="onSubmit">
              <label for="update-item-description">Description:</label>
              <input
                type="text"
                id="update-item-description"
                :value="`${item.description}`"
                v-on:change="(event) => updateItem(event, index, 'description')"
                maxlength="40"
              />
              <label for="update-item-url">Link to item:</label>
              <input
                type="text"
                :value="`${item.url}`"
                v-on:change="(event) => updateItem(event, index, 'url')"
                maxlength="200"
              />
              <label for="update-item-comment">Comment:</label>
              <textarea
                type="text"
                id="update-item-comment"
                :value="`${item.comment}`"
                v-on:change="(event) => updateItem(event, index, 'comment')"
                rows="6"
                maxlength="250"
              />
              <button
                type="submit"
                for="edit-wishlist-item"
                v-on:click="
                updateWishlistItem(item.id);
                item.isEditing = false;
                editing = false;
              "
              >Save changes</button>
              <button
                for="edit-wishlist-item"
                type="button"
                v-on:click="
                cancelEdit;
                item.isEditing = false;
                editing = false;
              "
              >Cancel editing</button>
            </form>
          </div>
        </li>
      </ul>
      <button
        type="button"
        v-if="!addingItem"
        v-on:click="addingItem = true;"
        :disabled="editing"
      >Add new wishlist item</button>
      <div v-if="addingItem" class="wishlist-item-container-form-editing">
        <!-- required does not work because button is outside of form for styling purposes and on key up submits form automatically -->
        <form id="add-wishlist-item-form" v-on:submit.prevent="onSubmit" v-if="addingItem">
          <label for="add-new-item-description">Description:</label>
          <input
            type="text"
            id="add-new-item-description"
            v-model="addItemDescription"
            placeholder="e.g. Socks"
            maxlength="40"
          />
          <label for="add-new-item-url">Link to item:</label>
          <input type="text" id="add-new-item-url" v-model="addItemUrl" placeholder maxlength="200" />
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
        type="submit"
        v-on:click="addItem"
        id="add-item-button"
        v-if="addingItem"
      >Add this item</button>

      <button type="button" v-if="addingItem" v-on:click="cancelAddItem">Cancel changes</button>
      <!--  <button
      type="button"
      v-if="hasEdited && !addingItem && userGroupInfo.wishlist.length > 0"
      v-on:click="
        updateWishlist({ userId, groupId, wishlist: userGroupInfo.wishlist });
        hasEdited = false;
      "
      >Save all changes</button>-->
    </div>
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
    ...mapState("groups", ["fetchedUserGroupInfo"])
  },
  created() {
    console.log("created");
    this.fetchUserGroupInfo({ userId: this.userId, groupId: this.groupId });
    this.localStorageName = `undercoverElfMyWishlist${this.groupId}`;
    this.userGroupInfo = JSON.parse(localStorage[this.localStorageName]);
    const copiedWishlist = this.userGroupInfo.wishlist.map(item => {
      return item;
    });
    this.copiedWishlist = copiedWishlist;
    console.log(this.userGroupInfo, "user group info");
  },
  beforeDestroy() {
    localStorage.removeItem(this.localStorageName);
  },
  methods: {
    ...mapActions("groups", ["fetchUserGroupInfo", "updateWishlist"]),
    updateDescription(event) {
      this.copiedUserGroupInfo.description = event.target.value;
    },
    updateItem(event, index, type) {
      this.copiedWishlist[index][type] = event.target.value;
    },
    updateWishlistItem(id) {
      // if updated description, url or comment is undefined, don't update it
      // Can't use v-model because using value to fill in the input box, so have to use the on input function. So, if only edit one thing, everything else will be blank, so have to separate them out like this because otherwise tries to submit blank values.

      // if the updated item doesn't have a url or comment, alert that it must have it

      this.userGroupInfo.wishlist.forEach((item, i) => {
        if (item.id === id) {
          console.log(
            item.description,
            "<--- item desc",
            this.copiedWishlist[i].description,
            "<--- desc",
            item.url,
            "<--- item url",
            this.copiedWishlist[i].url,
            "<--- url",
            item.comment,
            "<--- item comment",
            this.copiedWishlist[i].comment,
            "<--- comment"
          );

          if (item.description !== this.copiedWishlist[i].description) {
            item.description = this.copiedWishlist[i].description;
          }

          if (item.url !== this.copiedWishlist[i].url) {
            console.log("desc if");
            item.url = this.copiedWishlist[i].url;
          }

          if (item.comment !== this.copiedWishlist[i].comment) {
            item.comment = this.copiedWishlist[i].comment;
          }

          console.log(item.url, item.comment, item.comment.length);
          console.log(!item.url, !item.comment);
          if (!item.description) {
            alert("Item must have a description");
          } else if (!item.url && !item.comment) {
            // set wishlist back to how it was originally
            this.copiedWishlist[i] = item;
            alert("Item must have a link or a comment");
            console.log(item, this.copiedWishlist[i]);
            return;
          } else {
            item.isEditing = false;
            this.editing = false;
            console.log(item.isEditing);
            /* this.updateWishlist({
              userId: this.userId,
              groupId: this.groupId,
              wishlist: this.userGroupInfo.wishlist,
              localStorageName: this.localStorageName
            });*/
            console.log(this.userGroupInfo.wishlist);
            localStorage[this.localStorageName] = JSON.stringify(
              this.userGroupInfo.wishlist
            );
          }
        }
      });
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

        this.addItemDescription = "";
        this.addItemUrl = "";
        this.addItemComment = "";
        this.addingItem = false;
        console.log(this.userGroupInfo.wishlist);
        this.updateWishlist({
          userId: this.userId,
          groupId: this.groupId,
          wishlist: this.userGroupInfo.wishlist,
          localStorageName: this.localStorageName
        });
      }
    },
    cancelEdit() {
      this.updatedDescription = "";
      this.updatedUrl = "";
      this.updatedComment = "";
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
        this.updateWishlist({
          userId: this.userId,
          groupId: this.groupId,
          wishlist: this.userGroupInfo.wishlist,
          localStorageName: this.localStorageName
        });
      }
    }
  },
  data() {
    return {
      localStorageName: "",
      editing: false,
      addingItem: false,
      copiedWishlist: [],
      updatedDescription: "",
      updatedUrl: "",
      updatedComment: "",
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
  width: auto;
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
  width: 100%;
}

p {
  width: 60%;
  margin: 2rem auto;
  word-wrap: break-word;
}

.wishlist-item > div > p {
  padding: 0 1rem;
  width: auto;
  word-wrap: break-word;
  margin-top: 1ch;
}

.item-link {
  display: inline-block;
  word-break: break-word;
  padding: 0 1ch;
}

.wishlist-item-container {
  display: flex;
  width: 70%;
  flex-direction: row;
  border: 2px solid #2c3e50;
  border-radius: 1rem;
  margin: 2rem auto;
  justify-content: center;
}

.wishlist-item-container-form-editing {
  display: flex;
  flex-direction: row;
  border: 2px solid #2c3e50;
  background-color: #f0da9e;
  border-radius: 1rem;
  margin: 2rem auto;
  justify-content: center;
  width: 70%;
}

.wishlist-item-buttons {
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin-right: 1rem;
  margin-left: 1rem;
}

.wishlist-item-editing {
  background-color: #f0da9e;
}

p.description,
.item-link {
  margin: 1ch auto;
}

.item-link {
  margin: 0;
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

@media (max-width: 900px) {
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
    width: 100%;
  }

  .wishlist-item-container-form-editing {
    display: flex;
    flex-direction: column;
    width: auto;
  }

  .wishlist-item-buttons {
    display: flex;
    justify-content: center;
    flex-direction: row;
  }

  textarea {
    width: 90%;
  }
}
</style>

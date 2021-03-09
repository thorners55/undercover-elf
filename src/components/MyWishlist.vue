<template>
  <div>
    <router-link class="back-to" :to="`/groups/${groupId}/profile`">Back to {{ groupName }}</router-link>
    <div class="top-of-page">
      <img src="../assets/gift.svg" id="logo" width="50rem" />
      <h2>Wishlist</h2>
      <p v-if="myWishlist && myWishlist.length < 1">
        You have no items on your wishlist! Press 'Add new item' to get
        started!
      </p>
      <p>
        <b>Each item must have a description and either a link to the item or a comment</b>
      </p>
      <ul>
        <li v-for="(item, index) in myWishlist" :key="item.id" :item="item">
          <div class="wishlist-item-container" v-if="!item.isEditing">
            <div
              :class="
                  item.isEditing
                    ? 'wishlist-item-editing wishlist-item'
                    : 'wishlist-item'
                "
              v-if="!item.isEditing"
            >
              <!-- START wishlist item details -->
              <ul>
                <li class="description">{{ item.description }}</li>
                <li class="item-link" :href="`${item.url}`">
                  <a :href="item.url">{{ item.url }}</a>
                </li>
                <li>{{ item.comment }}</li>
              </ul>
              <!-- END wishlist item details -->
            </div>

            <!-- if this item isnt being edited, all other edit item buttons are disabled -->
            <div class="wishlist-item-buttons">
              <button
                class="edit"
                v-on:click="
                    item.isEditing = !item.isEditing;
                    editing = true;
                    editItem(index)
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
                    deleteItem(item.id);
                    editing = false;
                  "
              >
                <span class="edit-delete">
                  <i class="fas fa-trash-alt"></i>
                </span>
              </button>
            </div>
          </div>

          <!-- START editing an existing item -->
          <div v-if="item.isEditing" class="wishlist-item-container-form-editing">
            <form
              id="edit-wishlist-item"
              class="edit-wishlist-item"
              v-on:keyup.enter="submitUpdatedWishlistItem(item.id)"
              v-on:submit.prevent
            >
              <label for="update-item-description">Description:</label>
              <input
                type="text"
                id="update-item-description"
                :value="`${item.description}`"
                v-on:input="updateItem($event, index, 'description')"
                maxlength="40"
              />
              <label for="update-item-url">Link to item:</label>
              <input
                type="text"
                :value="`${item.url}`"
                v-on:input="updateItem($event, index, 'url')"
                maxlength="200"
              />
              <label for="update-item-comment">Comment:</label>
              <textarea
                type="text"
                id="update-item-comment"
                :value="`${item.comment}`"
                v-on:input="updateItem($event, index, 'comment')"
                rows="6"
                maxlength="250"
              />
              <button
                type="submit"
                for="edit-wishlist-item"
                v-on:click="submitUpdatedWishlistItem(item.id)"
              >Save changes</button>
              <button
                for="edit-wishlist-item"
                type="button"
                v-on:click="
                    cancelEdit(index, item.id);
                    item.isEditing = false;
                    editing = false; 
                  "
              >Cancel editing</button>
            </form>
          </div>
          <!-- START editing an existing item -->
        </li>
      </ul>

      <button
        type="button"
        v-if="!addingItem"
        v-on:click="addingItem = true"
        :disabled="editing"
      >Add new wishlist item</button>

      <!-- START new item being added -->
      <div v-if="addingItem" class="wishlist-item-container-form-editing">
        <form
          id="add-wishlist-item-form"
          v-on:submit="addItem"
          v-if="addingItem"
          v-on:keyup.enter="addItem"
          v-on:submit.prevent
        >
          <label for="add-new-item-description">Description:</label>
          <input
            type="text"
            id="add-new-item-description"
            v-model="addItemDescription"
            placeholder="e.g. Socks"
            maxlength="40"
            required
          />
          <label for="add-new-item-url">Link to item:</label>
          <input type="text" id="add-new-item-url" v-model="addItemUrl" placeholder maxlength="200" />
          <label for="add-new-item-comment">Comment:</label>
          <textarea
            type="text"
            id="add-new-item-comment"
            v-model="addItemComment"
            placeholder="e.g. Any above ankle length socks"
            rows="6"
            maxlength="250"
          />
          <button
            for="add-wishlist-item-form"
            type="submit"
            v-if="addingItem"
            v-on:click="addItem"
          >Add this item</button>
          <button type="button" v-if="addingItem" v-on:click="cancelAddItem">Cancel adding item</button>
        </form>
      </div>
      <!-- END new item being added -->
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { v4 as uuidv4 } from "uuid";

export default {
  name: "MyWishlist",
  computed: {
    groupId() {
      return this.$route.query.groupId;
    },
    ...mapGetters("demo", ["getMyWishlist"])
  },
  created() {
    let wishlistInfo = this.getMyWishlist(this.groupId);
    this.groupName = wishlistInfo.group.name;
    this.myWishlist = wishlistInfo.wishlist;
  },
  methods: {
    ...mapActions("demo", ["editWishlist", "updateWishlist"]),
    editItem(index) {
      this.originalItem = this.myWishlist[index];
    },
    updateItem(event, index, type) {
      // need to copy the original item to new reference before make any changes
      // only update the wishlist item once have pressed save changes
      this.myWishlist[index][type] = event.target.value;
    },
    submitUpdatedWishlistItem(id) {
      this.myWishlist.forEach(item => {
        if (item.id === id) {
          if (!item.description) {
            alert("Item must have a description");
          } else if (!item.url && !item.comment) {
            // stop from closing the edit form
            alert("Item must have a link or a comment");
            return;
          } else {
            item.isEditing = false;
            this.editing = false;
            this.updateWishlist({
              groupName: this.groupName,
              wishlist: this.myWishlist
            });
          }
        }
      });
    },
    addItem() {
      if (!this.addItemComment && !this.addItemUrl) {
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
        this.myWishlist.push(addedItem);
        this.addItemDescription = "";
        this.addItemUrl = "";
        this.addItemComment = "";
        this.addingItem = false;
        this.updateWishlist({
          groupName: this.groupName,
          wishlist: this.myWishlist
        });
      }
    },
    cancelEdit(index, id) {
      this.myWishlist[index] = this.originalItem;
      this.myWishlist.forEach(item => {
        if (item.id === id) {
          item.isEditing = false;
          this.editing = false;
          return;
        } else return;
      });
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
        const updatedWishlist = this.myWishlist.filter(item => {
          return item.id !== id;
        });

        this.myWishlist = updatedWishlist;

        this.updateWishlist({
          groupName: this.groupName,
          wishlist: updatedWishlist
        });
      }
    }
  },
  data() {
    return {
      groupName: "",
      myWishlist: [],
      editing: false,
      addingItem: false,
      addItemDescription: "",
      addItemUrl: "",
      addItemComment: "",
      originalItem: {}
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

li,
li.item-link {
  margin-bottom: 2ch;
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

.wishlist-item {
  padding: 1ch;
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

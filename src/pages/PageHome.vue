<template>
  <q-page class="relative-position">
    <q-scroll-area class="absolute full-height full-width">
      <div class="q-py-lg q-px-md row items-end q-col-gutter-md">
        <div class="col">
          <q-input
            class="mew-bweet"
            bottom-slots
            v-model="newBweetContent"
            placeholder="What's happening"
            counter
            maxlength="280"
            autogrow
          >
            <template v-slot:before>
              <q-avatar size="xl">
                <img src="https://cdn.quasar.dev/img/avatar5.jpg" />
              </q-avatar>
            </template>
          </q-input>
        </div>
        <div class="col col-shrink">
          <q-btn
            @click="addNewBweet"
            class="q-mb-lg"
            unelevated
            rounded
            color="primary"
            label="Bweet"
            no-caps
            :disable="!newBweetContent"
          />
        </div>
      </div>

      <q-separator class="divider" size="10px" color="grey-2" />

      <q-list>
        <transition-group
          appear
          enter-active-class="animated fadeIn slow"
          leave-active-class="animated fadeOut slow"
        >
          <q-item v-for="bweet in bweets" :key="bweet.id" class="q-py-md bweet">
            <q-item-section avatar top>
              <q-avatar>
                <img src="https://cdn.quasar.dev/img/avatar2.jpg" />
              </q-avatar>
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-subtitle1">
                <strong>Bernat Tous</strong>
                <span class="text-grey-7">
                  @bernat.tous
                  <br class="lt-md" />
                  &bull;
                  {{ bweet.date | relativeDate }}
                </span>
              </q-item-label>
              <q-item-label class="bweet-content text-body1">
                {{ bweet.content }}
              </q-item-label>
              <div class="bweet-icons row justify-between q-mt-sm">
                <q-btn
                  flat
                  round
                  size="sm"
                  color="grey"
                  icon="far fa-comment"
                />
                <q-btn
                  flat
                  round
                  size="sm"
                  color="grey"
                  icon="fas fa-retweet"
                />
                <q-btn
                  @click="toggleLiked(bweet)"
                  flat
                  round
                  size="sm"
                  :color="bweet.liked ? 'pink' : 'grey'"
                  :icon="bweet.liked ? 'fas fa-heart' : 'far fa-heart'"
                />
                <q-btn
                  @click="deleteBweet(bweet)"
                  flat
                  round
                  size="sm"
                  color="grey"
                  icon="fas fa-trash"
                />
              </div>
            </q-item-section>
          </q-item>
        </transition-group>
      </q-list>
    </q-scroll-area>
  </q-page>
</template>

<script>
import db from "src/boot/firebase";
import { formatDistance } from "date-fns";

export default {
  name: "PageHome",
  data() {
    return {
      newBweetContent: "",
      bweets: [
        // {
        //   content:
        //     "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quidem at culpa ipsum dolore praesentium maxime facilis adipisci aliquam obcaecati cumque earum magnam sed, illo vitae, cum ducimus commodi, ratione quo illum esse! Consequatur, blanditiis recusandae?",
        //   date: 1615148517828
        // },
        // {
        //   content:
        //     "Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio quis quae officia impedit ratione explicabo quod voluptatem nisi odit fugiat fugit, minima ipsum dolorem aliquam libero sequi, necessitatibus deserunt. Excepturi tenetur praesentium nisi similique delectus libero, quas repellendus vitae quo est earum totam. Quod nam, cupiditate nostrum consequatur error quis impedit doloribus exercitationem inventore fugiat!",
        //   date: 1615148538987
        // }
      ]
    };
  },
  filters: {
    relativeDate(value) {
      return formatDistance(value, new Date(), { addSuffix: true });
    }
  },
  methods: {
    addNewBweet() {
      let newBweet = {
        content: this.newBweetContent,
        date: Date.now(),
        liked: false
      };
      // Add a new document in collection "cities"
      db.collection("bweets")
        .add(newBweet)
        .then(docRef => {
          console.log("Bweet successfully added with ID: ", docRef.id);
        })
        .catch(error => {
          console.error("Error adding bweet: ", error);
        });
      this.newBweetContent = "";
    },
    deleteBweet(bweet) {
      db.collection("bweets")
        .doc(bweet.id)
        .delete()
        .then(() => {
          console.log("Bweet successfully deleted!");
        })
        .catch(error => {
          console.error("Error removing bweet: ", error);
        });
    },
    toggleLiked(bweet) {
      return db.collection("bweets").doc(bweet.id)
        .update({
          liked: !bweet.liked
        })
        .then(() => {
          console.log("Bweet successfully updated!");
        })
        .catch(error => {
          console.error("Error updating bweet: ", error);
        });
    }
  },
  mounted() {
    db.collection("bweets")
      .orderBy("date")
      .onSnapshot(snapshot => {
        snapshot.docChanges().forEach(change => {
          let bweetChange = change.doc.data();
          bweetChange.id = change.doc.id;
          if (change.type === "added") {
            console.log("New bweet: ", bweetChange);
            this.bweets.unshift(bweetChange);
          }
          if (change.type === "modified") {
            let index = this.bweets.findIndex(
              bweet => bweet.id === bweetChange.id
            );
            Object.assign(this.bweets[index], bweetChange);
            console.log("Modified bweet: ", bweetChange);
          }
          if (change.type === "removed") {
            let index = this.bweets.findIndex(
              bweet => bweet.id === bweetChange.id
            );
            this.bweets.splice(index, 1);
            console.log("Removed bweet: ", bweetChange);
          }
        });
      });
  }
};
</script>

<style lang="sass">
.mew-bweet
  textarea
    font-size: 19px
    line-height: 1.4 !important

.divider
  border-top: 1px solid
  border-bottom: 1px solid
  border-color: $grey-4

.bweet-content
  white-space: pre-line

.bweet-icons
  margin-left: -5px

.bweet + .bweet
  border-top: 1px solid rgba(0, 0, 0, 0.12)
</style>

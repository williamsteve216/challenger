<template>
  <q-page class="" style="background-color: hsl(223, 19%, 93%)">
    <div class="container q-pt-lg q-pb-xs">
      <div class="title text-dark q-pb-sm">Interactive Comment</div>
      <q-separator/>
      <q-toolbar class="q-pt-md">
        <q-toolbar-title>{{ user.username }}</q-toolbar-title>
        <q-btn color="primary" label="Choose user">
          <q-menu
            transition-show="jump-down"
            transition-hide="jump-up"
            auto-close
          >
            <q-list style="min-width: 100px" separator>
              <q-item
                clickable
                v-for="user in users"
                :key="user.username"
                @click="onChangeUser(user.username)"
              >
                <q-item-section>{{ user.username }}</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>
      </q-toolbar>
    </div>
    <div class="container q-pt-lg q-pb-lg">
      <interactive-comment
        v-for="comment in comments"
        :key="comment.id"
        :comment="JSON.parse(JSON.stringify(comment))"
        v-on:onSetScore="onChangeScore"
        :level="0"
        :idparent="comment.id"
        v-on:onSaveReplies="saveReplies"
        v-on:onGetParent="getParent"
      />
      <div class="new-message q-pa-lg q-mb-sm">
        <q-input
          outlined
          v-model="message"
          :dense="dense"
          autogrow
          placeholder="Add a comment..."
        >
          <template v-slot:before>
            <q-avatar>
              <img :src="user.image.png" />
            </q-avatar>
          </template>

          <template v-slot:after>
            <q-btn
              dense
              flat
              label="Send"
              no-caps
              class="btn-send"
              @click="onSendMessage()"
            />
          </template>
        </q-input>
      </div>
    </div>
  </q-page>
</template>

<script>
import interactiveComment from "src/components/interactive-comment.vue";
import { defineComponent } from "vue";
import { mapState, mapActions } from "vuex";
export default defineComponent({
  components: { interactiveComment },
  name: "PageIndex",
  data() {
    return {
      message: null,
      dense: false,
      allComments: [],
    };
  },
  watch: {
    commnents: function (val) {
      console.log(val);
      this.allComments = val;
    },
  },
  computed: {
    ...mapState("interactive", ["comments", "user", "users"]),
  },
  methods: {
    ...mapActions("interactive", [
      "sendMessage",
      "changeUser",
      "saveAllReplies",
      "addCommentID",
    ]),
    getParent(e) {
      if (typeof e === "object") {
        this.addCommentID(e.id);
      } else this.addCommentID(e);
    },
    saveReplies(e) {
      let replies = [];
      console.log(e);
      Object.keys(e.replies).forEach((key) => {
        replies.push(e.replies[key]);
      });
      let data = {
        id: e.id,
        replies: replies,
      };
      this.saveAllReplies(data);
      console.log(replies);
    },
    onChangeScore(param) {
      console.log(param);
    },
    onSendMessage() {
      let data = {
        content: this.message,
        level: 0,
      };
      this.sendMessage(data);
      this.message = null;
    },
    onChangeUser(username) {
      this.changeUser(username);
    },
  },
  beforeMount() {
    this.allComments = JSON.parse(JSON.stringify(this.comments));
  },
});
</script>
<style scoped lang="scss">
.title{
  font-size: 25px;
  font-weight: 400;
}
.container {
  max-width: 767px;
  margin: auto;
}
.new-message {
  background-color: white;
  border-radius: 12px;
  .btn-send {
    background-color: hsl(238, 40%, 52%);
    color: white;
    padding-left: 15px;
    padding-right: 15px;
  }
}
</style>

<template>
  <div :style="commentMargin">
    <q-card flat class="my-card q-mb-sm">
      <div class="content-box">
        <div class="btn-actions">
          <div class="wrap-btn">
            <q-btn label="-" flat dense @click="score--" />
            <q-btn :label="score >= 0 ? score : 0" flat dense />
            <q-btn label="+" flat dense @click="score++" />
          </div>
        </div>
        <div class="content-message">
          <q-toolbar class="bg-transparence">
            <q-avatar>
              <img :src="comment.user.image.png" />
            </q-avatar>
            <q-toolbar-title class="">
              <span class="name-section">{{ comment.user.username }}</span>
              <span class="q-pl-lg time-section">{{ comment.createdAt }}</span>
            </q-toolbar-title>
            <q-space />
            <q-btn
              flat
              dense
              icon="reply"
              label="Reply"
              no-caps
              class="btn-reply"
              @click="showReply(comment.user)"
              v-if="user.username != comment.user.username"
            />
            <q-btn
              flat
              dense
              icon="delete"
              label="Delete"
              no-caps
              class="btn-delete"
              @click="showDelete(comment)"
              v-if="user.username == comment.user.username"
            />
            <q-btn
              flat
              dense
              icon="edit"
              label="Edit"
              no-caps
              class="btn-reply"
              @click="showEdit(comment)"
              v-if="user.username == comment.user.username"
            />
          </q-toolbar>
          <div class="q-pt-xs content-text">
            {{ comment.content }}
          </div>
        </div>
      </div>
    </q-card>
    <div v-if="hasReplies">
      <interactive-comment
        v-for="reply in comment.replies"
        :key="reply.id"
        :idparent="reply.id"
        :comment="reply"
        v-on:onSetScore="onChangeScore"
        :spacing="spacing + 40"
        :level="level + 1"
        v-on:onSaveReplies="saveReplies"
        v-on:onGetParent ="getParent"
      />
    </div>
    <div class="new-message q-pa-lg q-mb-sm" v-if="showForm">
      <q-input
        ref="messagebox"
        outlined
        v-model="message"
        :dense="dense"
        autogrow
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
            @click="onSendMessageRepy()"
          />
        </template>
      </q-input>
    </div>
    <div class="new-message q-pa-lg q-mb-sm" v-if="showFormEdit">
      <q-input
        ref="messagebox"
        outlined
        v-model="selectComment.content"
        :dense="dense"
        autogrow
      >
        <template v-slot:before>
          <q-avatar>
            <img :src="selectComment.user.image.png" />
          </q-avatar>
        </template>

        <template v-slot:after>
          <q-btn
            dense
            flat
            label="Update"
            no-caps
            class="btn-send"
            @click="onSendMessageUpdate()"
          />
        </template>
      </q-input>
    </div>
    <q-dialog v-model="showConfirm" style="width: 400px">
      <q-card style="width: 400px" class="q-pb-md q-pt-sm card-dialog">
        <q-card-section>
          <div class="text-h6 text-title">Delete comment</div>
        </q-card-section>

        <q-card-section class="q-pt-none text-content">
          Are you sure you want to delete this comment? This will remove the
          comment and can't be undone
        </q-card-section>

        <q-card-actions align="center">
          <q-btn
            label="No Cancel"
            v-close-popup
            class="btn-cancel text-white"
          />
          <q-btn
            label="Yes, delete"
            v-close-popup
            class="btn-valid text-white"
            @click="onDelete()"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
export default {
  props: {
    comment: {
      type: Object,
      required: true,
    },
    spacing: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 0,
    },
    idparent: {
      type: Number,
      required: true,
    }
  },
  data() {
    return {
      score: 0,
      message: null,
      dense: false,
      showForm: false,
      showFormEdit: false,
      replies: [],
      userSent: null,
      showConfirm: false,
      selectComment: null,
    };
  },
  watch: {
    score: function (val) {
      if (val < 0) this.score = 0;
      let param = {
        id: this.comment.id,
        score: this.score,
      };
      this.$emit("onSetScore", param);
    },
  },
  computed: {
    ...mapState("interactive", ["user", "commentID"]),
    hasReplies() {
      const { replies } = this.comment;
      this.replies = replies;
      return replies && replies.length > 0;
    },
    commentMargin() {
      return {
        "margin-left": `${this.spacing}px`,
      };
    },
  },
  methods: {
      ...mapActions('interactive',[
          'addCommentID',
          'deleteComment',
          'updateComment'
      ]),
      getParent(e){
          if(typeof e ==='object'){
              this.addCommentID(e.id);
          }
          else this.addCommentID(e);
          this.$emit('onGetParent',this.idparent);
      },
    onDelete() {
        this.deleteComment(this.idparent);
    },
    showDelete(comment) {
      this.selectComment = comment;
      this.showConfirm = true;
      this.$emit('onGetParent',comment.id);
    },
    showEdit(comment) {
      this.selectComment = JSON.parse(JSON.stringify(comment));
      this.showFormEdit = true;
      this.$emit('onGetParent',comment);
    },
    saveReplies() {
      let parent = {
        id: this.idparent,
        replies: this.replies,
      };
      this.$emit("onSaveReplies", parent);
    },
    showReply(e) {
      this.userSent = e;
      this.showForm = !this.showForm;
      this.message = "@" + e.username;
    },
    onChangeScore(param) {
      console.log(param);
    },
    onSendMessageUpdate(){
        let data = {
        content: this.selectComment.content,
        replyingTo: this.selectComment.replyingTo,
        id: this.selectComment.id,
        createdAt: "1 min ago",
        score: 0,
        user: this.user,
        replies: this.selectComment.replies,
      };
      this.selectComment==null;
      //this.$emit("onSaveReplies", parent);
      this.updateComment(data);
      this.showFormEdit = false;
    },
    onSendMessageRepy() {
      let data = {
        content: this.message,
        replyingTo: this.userSent.name,
        id: Math.floor(Math.random() * 1000),
        createdAt: "1 min ago",
        score: 0,
        user: this.user,
        replies: [],
      };
      this.replies.push(data);
      this.message = "@" + this.userSent.username;
      let parent = {
        id: this.idparent,
        replies: this.replies,
      };
      this.$emit("onSaveReplies", parent);
      this.showForm = false;
    },
  },
  beforeMount() {
    this.score = this.comment.score;
    this.showForm = false;
    console.log(this.level);
  },
};
</script>
<style lang="scss">
.card-dialog {
  .text-title {
    color: hsl(212, 24%, 26%);
    font-weight: 700;
  }
  .btn-valid {
    background-color: hsl(358, 79%, 66%);
    color: "white";
  }
  .btn-cancel {
    background-color: hsl(212, 24%, 26%);
    color: "white";
  }
  .text-content {
    color: hsl(211, 10%, 45%);
    font-size: 16px;
  }
}
.my-card {
  font-family: "rubik";
  border-radius: 10px;
  .content-box {
    display: flex;
  }
}
.content-message {
  padding-top: 10px;
  padding-bottom: 25px;
  padding-left: 25px;
  padding-right: 25px;
  width: 100%;
  .q-toolbar {
    padding-left: 0;
    padding-right: 0;
    width: 100%;
    .name-section {
      font-size: 16px;
      font-weight: 600;
    }
    .time-section {
      font-size: 13px;
      color: hsl(211, 10%, 45%);
    }
    .btn-reply {
      font-size: 16px;
      color: hsl(238, 40%, 52%);
    }
    .btn-delete {
      font-size: 16px;
      color: hsl(358, 79%, 66%);
    }
  }
  .content-text {
    color: hsl(211, 10%, 45%);
    min-width: 100%;
  }
}
.btn-actions {
  padding-top: 20px;
  display: flex;
  margin-left: 25px;
  .wrap-btn {
    display: flex;
    flex-direction: column;
    background-color: hsl(239, 57%, 85%);
    height: fit-content;
    border-radius: 10px;
    .q-btn {
      height: 15px;
      padding-left: 10px;
      padding-right: 10px;
      border-radius: 10px;
      color: hsl(238, 40%, 52%);
      font-weight: 700;
    }
  }
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
  .q-input {
    display: hidden;
  }
}
</style>

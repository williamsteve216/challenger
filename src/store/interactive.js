const state = {
  comments: [
    {
      id: 1,
      content:
        "Impressive! Though it seems the drag feature could be improved. But overall it looks incredible. You've nailed the design and the responsiveness at various breakpoints works really well.",
      createdAt: "1 month ago",
      score: 12,
      user: {
        image: {
          png: "./images/avatars/image-amyrobson.png",
          webp: "./images/avatars/image-amyrobson.webp",
        },
        username: "amyrobson",
      },
      replies: [],
    },
    {
      id: 2,
      content:
        "Woah, your project looks awesome! How long have you been coding for? I'm still new, but think I want to dive into React as well soon. Perhaps you can give me an insight on where I can learn React? Thanks!",
      createdAt: "2 weeks ago",
      score: 5,
      user: {
        image: {
          png: "./images/avatars/image-maxblagun.png",
          webp: "./images/avatars/image-maxblagun.webp",
        },
        username: "maxblagun",
      },
      replies: [
        {
          id: 3,
          content:
            "If you're still new, I'd recommend focusing on the fundamentals of HTML, CSS, and JS before considering React. It's very tempting to jump ahead but lay a solid foundation first.",
          createdAt: "1 week ago",
          score: 4,
          replyingTo: "maxblagun",
          user: {
            image: {
              png: "./images/avatars/image-ramsesmiron.png",
              webp: "./images/avatars/image-ramsesmiron.webp",
            },
            username: "ramsesmiron",
          },
          replies: [],
        },
        {
          id: 4,
          content:
            "I couldn't agree more with this. Everything moves so fast and it always seems like everyone knows the newest library/framework. But the fundamentals are what stay constant.",
          createdAt: "2 days ago",
          score: 2,
          replyingTo: "ramsesmiron",
          user: {
            image: {
              png: "./images/avatars/image-juliusomo.png",
              webp: "./images/avatars/image-juliusomo.webp",
            },
            username: "juliusomo",
          },
          replies: [],
        },
      ],
    },
  ],
  commentID: [],
  users: [
    {
      image: {
        png: "images/image-juliusomo.png",
        webp: "./images/avatars/image-juliusomo.webp",
      },
      username: "juliusomo",
    },
    {
      image: {
        png: "images/image-amyrobson.png",
        webp: "./images/avatars/image-juliusomo.webp",
      },
      username: "amyrobson",
    },
    {
      image: {
        png: "images/image-maxblagun.png",
        webp: "./images/avatars/image-juliusomo.webp",
      },
      username: "maxblagun",
    },
    {
      image: {
        png: "images/image-ramsesmiron",
        webp: "./images/avatars/image-juliusomo.webp",
      },
      username: "ramsesmiron",
    },
  ],
  user: {
    image: {
      png: "./images/avatars/image-juliusomo.png",
      webp: "./images/avatars/image-juliusomo.webp",
    },
    username: "juliusomo",
  },
};
const getters = {};
const mutations = {
  setUser(state, payload) {
    const user = state.users.filter((u) => u.username == payload);
    state.user = user[0];
  },
  saveComment(state, payload) {
    console.log(payload);
    state.comments.push(payload);
  },
  setReplies(state, payload) {
    let data = state.comments.map(function (c) {
      if (c.id == payload.id) {
        c.replies = payload.replies;
      }
      return c;
    });
    state.comments = data;
  },
  setCommentID(state, payload) {
    if (!state.commentID.includes(payload)) state.commentID.push(payload);
  },
  setNewReplies(state, payload) {
    let commentID = JSON.parse(JSON.stringify(state.commentID)).reverse();
    console.log(commentID);
    if (commentID.length == 1 || commentID.length == 2) {
      if (commentID.length == 1) {
        state.comments = state.comments.filter((c) => c.id != commentID[0]);
      } else {
        let comment = state.comments.filter((c) => c.id == commentID[0])[0];
        comment.replies = comment.replies.filter((c) => c.id != commentID[1]);
        let coms = state.comments.map(function (c) {
          if (c.id == commentID[0]) {
            return comment;
          } else return c;
        });
        state.comments = coms;
      }
    } else {
      let oldComments = [];
      let comment = state.comments.filter((c) => c.id == commentID[0])[0];
      let replies = comment.replies;
      oldComments.push(comment);

      for (let i = 1; i < commentID.length - 1; i++) {
        comment = replies.filter((c) => c.id == commentID[i])[0];
        replies = comment.replies;
        if (i == commentID.length - 2) {
          comment.replies = comment.replies.filter(
            (c) => c.id != commentID[i + 1]
          );
        }
        oldComments.push(comment);
      }
      for (let i = oldComments.length - 1; i > 0; i--) {
        let comments = [];
        comments = oldComments[i - 1].replies.map(function (c) {
          if (c.id == oldComments[i].id) return oldComments[i];
          else return c;
        });
        oldComments[i - 1].replies = comments;
      }
      let coms = state.comments.map(function (c) {
        if (c.id == commentID[0]) {
          return oldComments[0];
        } else return c;
      });
      state.comments = coms;
    }
    state.commentID = [];
  },
  setUpdateComment(state, payload) {
    let commentID = JSON.parse(JSON.stringify(state.commentID)).reverse();
    console.log(commentID);
    if (commentID.length == 1 || commentID.length == 2) {
      if (commentID.length == 1) {
        state.comments = state.comments.map(function (c) {
          if (c.id == commentID[0]) {
            return payload;
          }
          else return c;
        });
      } else {
        let comment = state.comments.filter((c) => c.id == commentID[0])[0];
        comment.replies = comment.replies.map(function (c) {
          if (c.id == commentID[1]) return payload;
          else return c;
        });
        let coms = state.comments.map(function (c) {
          if (c.id == commentID[0]) {
            return comment;
          } else return c;
        });
        state.comments = coms;
      }
    } else {
      let oldComments = [];
      let comment = state.comments.filter((c) => c.id == commentID[0])[0];
      let replies = comment.replies;
      oldComments.push(comment);

      for (let i = 1; i < commentID.length - 1; i++) {
        comment = replies.filter((c) => c.id == commentID[i])[0];
        replies = comment.replies;
        if (i == commentID.length - 2) {
          /* comment.replies = comment.replies.filter(
            (c) => c.id != commentID[i + 1]
          ); */
          comment.replies = comment.replies.map(function (c) {
            if (c.id == commentID[i + 1]) return payload;
            else return c;
          });
        }
        oldComments.push(comment);
      }
      for (let i = oldComments.length - 1; i > 0; i--) {
        let comments = [];
        comments = oldComments[i - 1].replies.map(function (c) {
          if (c.id == oldComments[i].id) return oldComments[i];
          else return c;
        });
        oldComments[i - 1].replies = comments;
      }
      let coms = state.comments.map(function (c) {
        if (c.id == commentID[0]) {
          return oldComments[0];
        } else return c;
      });
      state.comments = coms;
    }
    state.commentID = [];
    console.log(state.comments);
  },
};
const actions = {
  sendMessage({ commit, state }, payload) {
    payload.id = Math.floor(Math.random() * 1000);
    payload.createdAt = "1 min ago";
    payload.score = 0;
    payload.user = state.user;
    payload.replies = [];
    commit("saveComment", payload);
  },
  changeUser({ commit }, payload) {
    commit("setUser", payload);
  },
  saveAllReplies({ commit }, payload) {
    commit("setReplies", payload);
  },
  addCommentID({ commit }, payload) {
    commit("setCommentID", payload);
  },
  deleteComment({ commit, state }, payload) {
    commit("setNewReplies", payload);
  },
  updateComment({ commit, state }, payload) {
    commit("setUpdateComment", payload);
  },
};
export default {
  namespaced: true,
  actions,
  getters,
  mutations,
  state,
};

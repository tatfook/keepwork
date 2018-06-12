<template>
  <div class='comp-comment' v-loading='loading'>
    <div class="style-0" v-if="getStyleId === 0">
      <div v-if="properties.switch.value">
        <h3>{{$t(options.title)}}</h3>
        <div class="comment-box">
          <div class="comment-item" v-for='comment in activePageCommentList' :key='comment._id'>
            <img :src="comment.userInfo.portrait">
            <div class="text">
              <h4>{{ comment.userInfo.displayName }}</h4>
              <p class="info">{{ comment.updateTime }}</p>
              <p>{{ comment.content }}</p>
            </div>
            <a class="delete-btn" @click="deleteComment(comment._id)">{{$t(options.delete)}}</a>
          </div>
        </div>
        <div class="comment-input">
          <textarea rows="3" v-model="content" :placeholder="$t(options.notice)"></textarea>
          <el-button @click="commit">{{$t(options.commit)}}</el-button>
        </div>
      </div>
      <div class="shutup-comment" v-if="!properties.switch.value">
        {{$t(options.close)}}
      </div>
    </div>
    <div class="style-1" v-if="getStyleId === 1">
      <div v-if="properties.switch.value">
        <div class="comment-box">
          <div class="comment-input">
            <textarea rows="3" v-model="content" :placeholder="$t(options.notice)"></textarea>
            <button @click="commit">{{$t(options.commit)}}</button>
          </div>
          <h3><img :src="getStyleOneId">{{$t(options.title)}}</h3>
          <hr>
          <div class="comment-item" v-for='comment in activePageCommentList' :key='comment._id'>
            <img :src="comment.userInfo.portrait">
            <div class="text">
              <h4>{{ comment.userInfo.displayName }}</h4>
              <p class="info">{{ comment.updateTime }}</p>
              <p>{{ comment.content }}</p>
              <hr>
            </div>
            <a class="delete-btn" @click="deleteComment(comment._id)">{{$t(options.delete)}}</a>
          </div>
        </div>
      </div>
      <div class="shutup-comment" v-if="!properties.switch.value">
        {{$t(options.close)}}
      </div>
    </div>
  </div>
</template>

<script>
import compBaseMixin from '../comp.base.mixin'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'AdiComment',
  mixins: [compBaseMixin],
  data() {
    return {
      loading: false,
      content: ''
    }
  },
  async mounted() {
    this.loading = true
    await this.getActivePageComments()
    this.loading = false
  },
  computed: {
    ...mapGetters({
      activePageCommentList: 'user/activePageCommentList'
    }),
    getStyleId() {
      return this.options.styleId || 0
    },
    getStyleOneId() {
      return require('@/../static/adi/comment/style-1-title-icon.png')
    }
  },
  methods: {
    ...mapActions({
      setActiveProperty: 'setActiveProperty',
      setActivePropertyData: 'setActivePropertyData',
      getActivePageComments: 'user/getActivePageComments',
      createCommentForActivePage: 'user/createCommentForActivePage',
      deleteCommentById: 'user/deleteCommentById'
    }),
    async commit() {
      let { content } = this

      if(!content) {
        return alert('请输入聊天内容');
      }

      this.loading = true
      await this.createCommentForActivePage({ content })
      this.content = ''
      this.loading = false
    },
    async deleteComment(commentId) {
      this.loading = true
      await this.deleteCommentById({ _id: commentId })
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.comp-comment {
  padding: 0;

  .style-0 {
    .comment-box {
      .comment-item {
        margin: 15px 0;
        position: relative;

        & > img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          float: left;
        }

        .text {
          padding-left: 90px;
          position: relative;
          min-height: 80px;
          padding-right: 30px;

          h4 {
            margin: 0;
          }

          .info {
            font-size: 12px;
            color: #999;
            margin-bottom: 5px;
          }
        }

        .delete-btn {
          position: absolute;
          right: 0;
          top: 0;
        }
      }
    }

    .comment-input {
      display: flex;
      align-items: flex-end;

      textarea {
        margin-right: 15px;
        resize: none;
        width: 100%;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
    }

    .shutup-comment {
      border: 1px solid #999999;
      padding: 60px;
      text-align: center;
    }
  }

  .style-1 {
    .comment-box {
      .comment-input {
        text-align: right;
        overflow: hidden;

        textarea {
          resize: none;
          width: 100%;
          height: 110px;
          border: 2px solid #d4d4d4;
          outline: none;
          background-color: #eeeeee;
          font-size: 14px;
          padding: 10px;
        }

        button {
          font-size: 14px;
          background-color: black;
          font-weight: 600;
          border: none;
          padding: 15px 25px;
          color: white;
          outline: none;
          cursor: pointer;
        }
      }

      & > h3 {
        font-weight: 900;
        font-size: 22px;

        img{
          vertical-align: middle;
          margin-right: 10px;
        }
      }

      & > hr {
        border: 1px solid #dddddd;
      }

      .comment-item {
        margin: 15px 0;
        position: relative;

        & > img {
          width: 80px;
          height: 80px;
          object-fit: cover;
          float: left;
        }

        .text {
          padding-left: 90px;
          position: relative;
          min-height: 80px;
          margin-bottom: 30px;

          hr {
            border: 1px solid #dddddd;
          }

          h4 {
            margin: 0;
          }

          .info {
            font-size: 12px;
            color: #999;
            margin-bottom: 5px;
          }
        }

        .delete-btn {
          position: absolute;
          right: 0;
          top: 0;
          cursor: pointer;
        }
      }
    }

    .shutup-comment {
      border: 1px solid #999999;
      padding: 60px;
      text-align: center;
    }
  }
}
</style>
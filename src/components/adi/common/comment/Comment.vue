<template>
  <div class='comp-comment' v-loading='loading'>
    <div>
      <h3>我要评论</h3>
      <div class="comments-box">
        <div class="comment-item clearfix" v-for='comment in activePageCommentList' :key='comment._id'>
          <img :src="comment.userInfo.portrait">
          <div class="text">
            <h4>{{ comment.userInfo.displayName }}</h4>
            <p class="info">{{ comment.updateTime }}</p>
            <p>{{ comment.content }}</p>
          </div>
          <a class="delete-btn" @click="deleteComment(comment._id)">删除</a>
        </div>
      </div>
      <div class="comment-input">
        <textarea rows="3" v-model="content" placeholder="Share your ideas!"></textarea>
        <el-button @click="commit">提交</el-button>
      </div>
    </div>
    <!-- <div class="text-center shutup-comment" ng-hide="!params.multiText_desc.is_mod_hide">
      评论功能已关闭
    </div> -->

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
    })
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
      this.loading = true
      await this.createCommentForActivePage({content})
      this.content = ''
      this.loading = false
    },
    async deleteComment(commentId) {
      this.loading = true
      await this.deleteCommentById({_id: commentId})
      this.loading = false
    },
  }
}
</script>

<style lang="scss" scoped>
.comp-comment {
  padding: 0;

  .info {
    font-size: 12px;
    color: #999;
    margin-bottom: 5px;
  }

  .comment-item {
    margin: 15px 0;
    position: relative;
  }

  .comment-item > img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    float: left;
  }

  .comment-item .text {
    padding-left: 90px;
    position: relative;
    min-height: 80px;
    padding-right: 30px;
  }

  .comment-input {
    display: flex;
    align-items: flex-end;
  }

  .comment-input textarea {
    margin-right: 15px;
    resize: none;
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  h4 {
    margin: 0;
  }

  .delete-btn {
    position: absolute;
    right: 0;
    top: 0;
  }

  .no_comment {
    padding: 30px;
    color: #999;
  }

  .shutup-comment {
    border: 1px solid #999999;
    padding: 60px;
  }
}
</style>
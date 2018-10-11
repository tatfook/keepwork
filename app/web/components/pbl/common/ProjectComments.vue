<template>
  <div class="project-comments">
    <div class="project-comments-header">
      评论<span class="project-comments-header-count">(已有{{projectCommentList.length}}条评论)</span>
    </div>
    <div class="project-comments-sends">
      <div class="project-comments-sends-profile-input">
        <img class="project-comments-profile" src="http://git.keepwork.com/gitlab_rls_kaitlyn/keepworkdatasource/raw/master/kaitlyn_images/img_1518086126317.png" alt="">
        <el-input placeholder="发表你的看法吧..." v-model='newCommenContent'></el-input>
      </div>
      <div class="project-comments-sends-operations">
        <el-button type="primary" :loading='isAddingComment' size="medium" @click="sendComment" :disabled="!newCommenContent">评论</el-button>
      </div>
    </div>
    <div class="project-comments-list" v-loading='isLoading'>
      <div class="project-comments-item" v-for="(comment, index) in projectCommentList" :key='index'>
        <img class="project-comments-profile project-comments-item-profile" :src="comment.extra.portrait || defaultPortrait" alt="">
        <div class="project-comments-item-detail">
          <p class="project-comments-item-username-time">{{comment.extra.nickname || comment.extra.username}}
            <span class="project-comments-item-time">{{comment.createdAt | formatDate}}</span>
          </p>
          <p class="project-comments-item-comment">{{comment.content}}</p>
          <el-button type="text" class="project-comments-item-delete" @click="deleteComment(comment)">删除</el-button>
        </div>
      </div>
    </div>
    <div class="project-comments-more">下滑加载更多</div>
  </div>
</template>
<script>
import dayjs from 'dayjs'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'ProjectComments',
  props: {
    projectId: {
      required: true
    }
  },
  async created() {
    await this.pblGetComments({
      objectType: 5,
      objectId: this.projectId
    })
  },
  data() {
    return {
      isAddingComment: false,
      isLoading: false,
      newCommenContent: '',
      defaultPortrait: require('@/assets/img/default_portrait.png')
    }
  },
  computed: {
    ...mapGetters({
      pblProjectCommentList: 'pbl/projectCommentList'
    }),
    projectCommentList() {
      return this.pblProjectCommentList({ projectId: this.projectId }) || []
    }
  },
  methods: {
    ...mapActions({
      pblGetComments: 'pbl/getComments',
      pblCreateComment: 'pbl/createComment',
      pblDeleteComment: 'pbl/deleteComment'
    }),
    async sendComment() {
      this.isAddingComment = true
      await this.pblCreateComment({
        objectType: 5,
        objectId: this.projectId,
        content: this.newCommenContent
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '评论成功'
          })
          this.isAddingComment = false
          this.newCommenContent = ''
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: '评论失败'
          })
          this.isAddingComment = false
          console.error(error)
        })
    },
    async deleteComment(commentDetail) {
      this.isLoading = true
      await this.pblDeleteComment({
        objectType: 5,
        objectId: this.projectId,
        commentId: commentDetail.id
      })
        .then(() => {
          this.isLoading = false
          this.$message({
            type: 'success',
            message: '评论删除成功'
          })
        })
        .catch(error => {
          this.isLoading = false
          this.$message({
            type: 'error',
            message: '评论删除失败'
          })
          console.error(error)
        })
    }
  },
  filters: {
    formatDate(date, formatType) {
      return dayjs(date).format('YYYY年MM月DD日 HH:mm:ss')
    }
  }
}
</script>
<style lang="scss">
.project-comments {
  background-color: #fff;
  &-profile {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
  }
  &-header {
    font-size: 16px;
    color: #303133;
    font-weight: bold;
    height: 56px;
    line-height: 56px;
    padding: 0 16px;
    &-count {
      font-size: 12px;
      font-weight: normal;
      color: #909399;
      margin-left: 8px;
    }
  }
  &-sends {
    padding: 24px 16px 24px 24px;
    border: 1px solid #e8e8e8;
    border-width: 1px 0;
    &-profile-input {
      padding-left: 64px;
      position: relative;
      img {
        position: absolute;
        left: 0;
      }
    }
    &-operations {
      text-align: right;
      padding-top: 16px;
    }
  }
  &-item {
    p {
      margin: 0;
    }
    display: flex;
    align-items: center;
    padding: 8px 24px;
    &-profile {
      margin-right: 16px;
      padding: 16px 0;
    }
    &-username-time {
      font-size: 14px;
      color: #303133;
      margin-bottom: 8px;
    }
    &-time {
      font-size: 12px;
      color: #909399;
      margin-left: 10px;
    }
    &-comment {
      font-size: 13px;
      color: #606266;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    &-detail {
      flex: 1;
      min-width: 0;
      position: relative;
    }
    &-delete {
      position: absolute;
      right: 0;
      top: 0;
      font-size: 14px;
      color: #909399;
      display: none;
    }
    &-detail:hover .el-button--text {
      display: inline-block;
    }
  }
  &-more {
    height: 36px;
    line-height: 36px;
    font-size: 12px;
    color: #909399;
    text-align: center;
    border-top: 1px solid #e8e8e8;
  }
}
</style>

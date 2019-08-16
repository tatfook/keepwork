<template>
  <div class="project-comments">
    <div class="project-comments-header">
      {{$t('project.comment')}}<span class="project-comments-header-count">({{$t('project.having')}}{{totalCommentCount}}{{$t('project.commentCount')}})</span>
    </div>
    <div class="project-comments-sends">
      <div class="project-comments-sends-profile-input">
        <img class="hidden-xs-only project-comments-profile" :src='userPortrait || defaultPortrait' alt="">
        <el-input :disabled='!isLoginUsercommentable' :placeholder="$t('project.writeComment')" v-model='newCommenContent' maxlength="1000"></el-input>
      </div>
      <div class="project-comments-sends-operations">
        <el-button type="primary" :loading='isAddingComment' size="medium" @click="sendComment" :disabled="!newCommenContent">{{$t('project.comment')}}</el-button>
      </div>
      <div class="project-comments-sends-login" v-if="!isLogined" @click="toLogin">{{$t("project.commentAfterLogin")}}</div>
    </div>
    <div class="project-comments-list" v-loading='isLoading'>
      <div class="project-comments-item" v-for="(comment, index) in commentList" :key='index'>
        <img class="project-comments-profile project-comments-item-profile" :src="comment.extra.portrait || defaultPortrait" alt="">
        <div class="project-comments-item-detail">
          <p class="project-comments-item-username-time">{{comment.extra.nickname || comment.extra.username}}
            <span class="project-comments-item-time">{{comment.createdAt | relativeTimeFilter(isEn)}}</span>
          </p>
          <p class="project-comments-item-comment">{{comment.content}}</p>
          <el-button v-if="comment.userId === loginUserId" type="text" class="project-comments-item-delete" @click="deleteComment(comment)"><i class="iconfont icon-delete1"></i> {{$t('project.delete')}}</el-button>
        </div>
      </div>
    </div>
    <div class="project-comments-more" v-loading='isGetCommentBtnLoading' @click="getMoreComment">{{isGetAllComment?$t('project.noMoreComment'):$t('project.viewMoreComments')}}</div>
  </div>
</template>
<script>
import moment from 'moment'
import 'moment/locale/zh-cn'
import { locale } from '@/lib/utils/i18n'
import { checkSensitiveWords } from '@/lib/utils/sensitive'
import { mapGetters, mapActions } from 'vuex'
import _ from 'lodash'
export default {
  name: 'ProjectComments',
  props: {
    projectId: {
      required: true
    },
    isLoginUsercommentable: Boolean
  },
  async created() {
    this.getCommentFromBackEnd()
  },
  data() {
    return {
      xPerPage: 6,
      xPage: 1,
      xOrder: 'updatedAt-desc',
      isAddingComment: false,
      isLoading: false,
      newCommenContent: '',
      defaultPortrait: require('@/assets/img/default_portrait.png'),
      commentList: [],
      isGetAllComment: false,
      isGetCommentBtnLoading: false,
      totalCommentCount: 0,
      isEn: locale === 'en-US'
    }
  },
  computed: {
    ...mapGetters({
      pblProjectCommentList: 'pbl/projectCommentList',
      userProfile: 'user/profile',
      loginUserId: 'user/userId',
      isRealNamed: 'user/isRealNamed',
      isLogined: 'user/isLogined'
    }),
    projectCommentList() {
      return this.pblProjectCommentList({ projectId: this.projectId }) || []
    },
    userPortrait() {
      return _.get(this.userProfile, 'portrait')
    }
  },
  methods: {
    ...mapActions({
      toggleRealName: 'user/toggleRealName',
      pblGetComments: 'pbl/getComments',
      pblCreateComment: 'pbl/createComment',
      pblDeleteComment: 'pbl/deleteComment',
      toggleLoginDialog: 'pbl/toggleLoginDialog'
    }),
    async getCommentFromBackEnd() {
      this.isGetCommentBtnLoading = true
      let newCommentResult = await this.pblGetComments({
        objectType: 5,
        objectId: this.projectId,
        xPage: this.xPage,
        xOrder: this.xOrder,
        xPerPage: this.xPerPage
      }).catch()
      this.totalCommentCount = newCommentResult.count
      let newCommentList = newCommentResult.rows
      if (newCommentList.length > 0) {
        this.isGetAllComment = false
        this.commentList = _.concat(this.commentList, newCommentList)
      } else {
        this.isGetAllComment = true
        this.xPage--
      }
      this.isGetCommentBtnLoading = false
    },
    getMoreComment() {
      if (this.isGetAllComment) {
        return
      }
      this.xPage++
      this.getCommentFromBackEnd()
    },
    toLogin() {
      this.toggleLoginDialog(true)
    },
    async sendComment() {
      if (!this.isLogined) {
        return this.toLogin()
      }
      if (!this.isRealNamed) {
        return this.toggleRealName(true)
      }
      this.isAddingComment = true
      let sensitiveResult = await checkSensitiveWords({
        checkedWords: this.newCommenContent
      }).catch()
      if (sensitiveResult && sensitiveResult.length > 0) {
        this.newCommenContent = _.get(
          sensitiveResult,
          '[0].word',
          this.newCommenContent
        )
        this.isAddingComment = false
        return
      }
      await this.pblCreateComment({
        objectType: 5,
        objectId: _.toString(this.projectId),
        content: this.newCommenContent
      })
        .then(newCommentDetail => {
          this.$message({
            type: 'success',
            message: this.$t('project.commentSuccessfully')
          })
          this.isAddingComment = false
          this.newCommenContent = ''
          this.resetCommentList()
        })
        .catch(error => {
          this.$message({
            type: 'error',
            message: '评论失败'
          })
          this.isAddingComment = false
          return
        })
    },
    resetCommentList() {
      this.xPage = 1
      this.commentList = []
      this.getCommentFromBackEnd()
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
            message: this.$t('project.commentDeleted')
          })
          this.resetCommentList()
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
    relativeTimeFilter(date, isEn) {
      isEn ? moment.locale('en') : moment.locale('zh-cn')
      return moment(date).fromNow()
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
    position: relative;
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
    &-login {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #fff;
      background-color: rgba(0, 0, 0, 0.6);
      &:hover {
        color: #409efe;
      }
    }
  }
  &-item {
    p {
      margin: 0;
    }
    display: flex;
    align-items: flex-start;
    padding: 24px;
    &-profile {
      margin-right: 16px;
    }
    &-username-time {
      font-size: 14px;
      color: #303133;
      margin-bottom: 10px !important;
    }
    &-time {
      font-size: 12px;
      color: #909399;
      margin-left: 10px;
    }
    &-comment {
      font-size: 13px;
      color: #606266;
      padding-right: 96px;
      line-height: 1.5;
      word-break: break-word;
      word-wrap: break-word;
    }
    &-detail {
      flex: 1;
      min-width: 0;
      position: relative;
    }
    &-delete {
      position: absolute;
      right: 14px;
      top: 50%;
      padding: 0;
      font-size: 13px;
      color: #909399;
      .iconfont {
        font-size: 14px;
      }
    }
  }
  &-more {
    height: 36px;
    line-height: 36px;
    font-size: 12px;
    color: #909399;
    text-align: center;
    border-top: 1px solid #e8e8e8;
    cursor: pointer;
  }
}

@media (max-width: 768px) {
  .project-comments {
    &-sends {
      &-profile-input {
        padding-left: 0;
      }
    }
    &-item {
      padding: 12px;
      &-profile {
        height: 40px;
        width: 40px;
        margin-right: 12px;
      }
      &-comment {
        font-size: 13px;
        color: #606266;
      }
    }
  }
}
</style>

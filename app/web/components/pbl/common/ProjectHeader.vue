<template>
  <div class="project-header">
    <div class="container">
      <el-breadcrumb separator="/" class="project-header-breadcrumb hidden-xs-only">
        <el-breadcrumb-item>
          <img class="project-header-breadcrumb-home-icon" src="@/assets/pblImg/home.png" alt="" @click="goHomePage">
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <a :href="`/u/${editingProjectUsername}`">{{editingProjectUsername}}</a>
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <el-dropdown @visible-change='dropdownVisibleChange' placement='bottom' trigger="click">
            <span class="el-dropdown-link">
              {{projectDisplayName}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu class="project-header-dropdown" slot="dropdown" v-loading='isDropdownLoading'>
              <el-dropdown-item @click.native="toProjectIndexPage(project)" :disabled='editingProjectName == project.name' v-for="(project, index) in userProjectList" :key="index">{{getProjectDisplayName(project)}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-breadcrumb-item>
      </el-breadcrumb>
      <div class="project-header-operations hidden-xs-only">
        <div class="project-header-operations-item">
          <el-popover placement="top" width="160" @show='showSocialShare'>
            <div class="kp-social-share"></div>
            <el-button slot="reference" plain size="medium">
              <i class="iconfont icon-share1"></i>{{$t("project.share")}}
            </el-button>
          </el-popover>
        </div>
        <div class="project-header-operations-item">
          <el-button plain size="medium" @click="toggleFavoriteProject" :loading="isFavoriteButtonLoading">
            <i class="iconfont" :class="favoriteIconClass"></i>{{isUserFavoriteProject ? $t("project.unstar") : $t("project.star")}}
          </el-button>
          <span class="project-header-operations-item-count">{{projectDetail.favoriteCount}}</span>
        </div>
        <div class="project-header-operations-item">
          <el-button plain size="medium" @click='toggleStarProject' :loading="isStarButtonLoading">
            <i class="iconfont" :class="starIconClass"></i>{{isUserStaredProject ? $t("project.unlike") : $t("project.like")}}
          </el-button>
          <span class="project-header-operations-item-count">{{projectDetail.star}}</span>
        </div>
      </div>
      <el-tabs v-model="activePageName" class="project-header-tabs" @tab-click="handleTabClick">
        <el-tab-pane name="ProjectIndexPage">
          <span slot="label" class="project-header-tabs-label">{{$t("project.main")}}</span>
        </el-tab-pane>
        <el-tab-pane name="ProjectWhiteBoard" v-if="!isProhibitView">
          <span slot="label" class="project-header-tabs-label">{{$t("project.whiteboard")}}</span>
        </el-tab-pane>
        <el-tab-pane name="EditProject" v-if="isLoginUserEditable">
          <span slot="label" class="project-header-tabs-label">{{$t("project.setting")}}</span>
        </el-tab-pane>
        <el-tab-pane name="DeleteProject" v-if="isLoginUserEditable">
          <span slot="label" class="project-header-tabs-label">{{$t('project.deleteProject')}}</span>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="project-index-phone-operations-foot hidden-sm-and-up">
      <span class="project-index-phone-operations-foot-item" @click="showTheCommentInput">
        <i class="iconfont icon-information"></i> 评论
      </span>
      <span :class="['project-index-phone-operations-foot-item', {'item-select': isUserStaredProject}]" @click='toggleStarProject'>
        <i :class="['iconfont', isUserStaredProject ? 'icon-like-fill' : 'icon-like1' ]"></i> 点赞
      </span>
      <span :class="['project-index-phone-operations-foot-item', {'item-select': isUserFavoriteProject}]" @click="toggleFavoriteProject">
        <i :class="['iconfont', isUserFavoriteProject ? 'icon-star-fill' : 'icon-star1' ]"></i> 收藏
      </span>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import 'social-share.js/dist/js/social-share.min.js'
import 'social-share.js/dist/css/share.min.css'
import scrollIntoView from 'scroll-into-view-if-needed'
export default {
  name: 'ProjectHeader',
  props: {
    projectDetail: Object,
    editingProjectUsername: String,
    editingUserId: Number,
    isLoginUserEditable: {
      type: Boolean,
      default: false
    },
    isProhibitView: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isDropdownLoading: false,
      isFavoriteButtonLoading: false,
      isStarButtonLoading: false,
      activePageName: this.$route.name
    }
  },
  mounted() {
    window.document.title = `${this.editingProjectName}`
  },
  computed: {
    ...mapGetters({
      userProjects: 'pbl/userProjects',
      projectFavoriteState: 'pbl/projectFavoriteState',
      projectStarState: 'pbl/projectStarState',
      isLogined: 'user/isLogined'
    }),
    editingProjectName() {
      return _.get(this.projectDetail, 'name')
    },
    projectDisplayName() {
      return this.getProjectDisplayName(this.projectDetail)
    },
    editingProjectId() {
      return _.get(this.projectDetail, 'id')
    },
    userProjectList() {
      let userId = this.editingUserId
      return _.get(this.userProjects({ userId }), 'rows', [])
    },
    isUserFavoriteProject() {
      return this.projectFavoriteState({
        projectId: this.editingProjectId
      })
    },
    isUserStaredProject() {
      return this.projectStarState({ projectId: this.editingProjectId })
    },
    favoriteIconClass() {
      return this.isUserFavoriteProject ? 'icon-star-fill' : 'icon-star1'
    },
    starIconClass() {
      return this.isUserStaredProject ? 'icon-like-fill' : 'icon-like1'
    },
    shareUrl() {
      let origin = window.location.origin
      return `${origin}/pbl/project/${this.editingProjectId}`
    }
  },
  methods: {
    ...mapActions({
      pblGetUserProjects: 'pbl/getUserProjects',
      favoriteProject: 'pbl/favoriteProject',
      unFavoriteProject: 'pbl/unFavoriteProject',
      starProject: 'pbl/starProject',
      unStarProject: 'pbl/unStarProject',
      toggleLoginDialog: 'pbl/toggleLoginDialog'
    }),
    getProjectDisplayName(project) {
      return _.get(project, 'extra.worldTagName', project.name)
    },
    showTheCommentInput() {
      let input = document.querySelector(
        '#project-index-phone-comments .project-comments-sends-profile-input input'
      )
      input.focus()
      scrollIntoView(input)
    },
    goHomePage() {
      window.location.href = `/`
    },
    showMessage({ type = 'success', message = '操作成功' }) {
      this.$message({ type, message })
    },
    async dropdownVisibleChange(visible) {
      if (visible) {
        let userId = this.editingUserId
        this.isDropdownLoading = true
        await this.pblGetUserProjects({ userId })
        this.isDropdownLoading = false
      }
    },
    toProjectIndexPage(project) {
      let projectId = project.id
      this.$router.push({ path: `/project/${projectId}` })
    },
    async toggleStarProject() {
      if (!this.isLogined) {
        return this.toggleLoginDialog(true)
      }
      let projectId = this.editingProjectId
      this.isStarButtonLoading = true
      if (!this.isUserStaredProject) {
        await this.starProject({ projectId })
          .then(() => {
            this.showMessage({
              message: this.$t('project.successfullyLiked')
            })
            this.isStarButtonLoading = false
          })
          .catch(error => {
            this.showMessage({
              type: 'error',
              message: '点赞失败'
            })
            this.isStarButtonLoading = false
          })
      } else {
        await this.unStarProject({ projectId })
          .then(() => {
            this.showMessage({
              message: this.$t('project.successfullyUnliked')
            })
            this.isStarButtonLoading = false
          })
          .catch(error => {
            this.showMessage({
              type: 'error',
              message: '取消点赞失败'
            })
            this.isStarButtonLoading = false
          })
        this.isStarButtonLoading = false
      }
    },
    async toggleFavoriteProject() {
      if (!this.isLogined) {
        return this.toggleLoginDialog(true)
      }
      let objectId = this.editingProjectId
      let objectType = 5
      this.isFavoriteButtonLoading = true
      if (!this.isUserFavoriteProject) {
        await this.favoriteProject({ objectId, objectType })
          .then(() => {
            this.showMessage({
              message: this.$t('project.successfullyStarred')
            })
            this.isFavoriteButtonLoading = false
          })
          .catch(error => {
            this.showMessage({
              type: 'error',
              message: '收藏失败'
            })
            this.isFavoriteButtonLoading = false
          })
      } else {
        await this.unFavoriteProject({ objectId, objectType })
          .then(() => {
            this.showMessage({
              message: this.$t('project.successfullyUnstarred')
            })
            this.isFavoriteButtonLoading = false
          })
          .catch(error => {
            this.showMessage({
              type: 'error',
              message: '取消收藏失败'
            })
            this.isFavoriteButtonLoading = false
          })
        this.isFavoriteButtonLoading = false
      }
    },
    showSocialShare() {
      let projectImageUrl = _.get(this.projectDetail, 'extra.imageUrl')
      window.socialShare('.kp-social-share', {
        mode: 'prepend',
        url: this.shareUrl,
        description: `我将${this.editingProjectUsername}的项目${this.editingProjectName}分享给你`,
        title: `我将${this.editingProjectUsername}的项目${this.editingProjectName}分享给你`,
        sites: ['qq', 'qzone', 'weibo', 'wechat'],
        wechatQrcodeTitle: '', // 微信二维码提示文字
        wechatQrcodeHelper: this.$t('common.QR'),
        image: this.coverUrl
      })
    },
    handleTabClick(tabItem) {
      let { paneName } = tabItem
      this.$router.push({ name: paneName })
    }
  }
}
</script>

<style lang="scss">
.project-header {
  background-color: #fff;
  box-shadow: 0 1px 3px 0px rgba(0, 0, 0, 0.1);
  &-breadcrumb {
    font-size: 16px;
    padding-top: 24px;
    &-home-icon {
      vertical-align: middle;
    }
    .el-breadcrumb__inner a {
      color: inherit;
      font-weight: normal;
    }
    .el-breadcrumb__inner a:hover {
      color: #2296f3;
    }
    .el-breadcrumb__separator {
      font-weight: normal;
      font-size: 12px;
      vertical-align: middle;
    }
    .el-dropdown {
      font-size: 16px;
      font-weight: bold;
      color: #303133;
      cursor: pointer;
    }
  }
  &-dropdown {
    max-height: 200px;
    overflow: auto;
  }
  &-operations {
    text-align: right;
    line-height: 1;
    &-item {
      display: inline-block;
      margin-left: 12px;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      height: 32px;
      overflow: hidden;
      .el-button {
        background: linear-gradient(#fff, #f6f7f8);
        border: none;
        height: 32px;
        padding: 0 16px;
        .iconfont {
          margin-right: 6px;
          font-size: 20px;
          vertical-align: sub;
        }
      }
      &-count {
        font-size: 14px;
        color: #606266;
        border-left: 1px solid #dcdfe6;
        display: inline-block;
        padding: 0 16px;
        margin-left: -6px;
        height: 32px;
        line-height: 32px;
      }
      &-count + .el-button {
        border-radius: 4px 0 0 4px;
      }
    }
  }
  &-tabs {
    &-label {
      padding: 0 16px;
    }
    .el-tabs__header {
      margin-bottom: 0;
    }
    .el-tabs__nav-wrap::after {
      display: none;
    }
    .el-tabs__item {
      padding: 0 0 17px 0;
      height: auto;
      line-height: 1;
      border-bottom: 3px solid transparent;
    }
    .el-tabs__item.is-active {
      color: #303133;
      font-weight: bold;
      border-bottom: 3px solid #2397f3;
      transition: all ease-in-out 0.2s;
    }
    .el-tabs__active-bar {
      display: none;
    }
  }
}
.kp-social-share.social-share {
  text-align: center;
  .icon-wechat {
    visibility: hidden;
    height: 150px;
    .wechat-qrcode {
      top: 0;
      left: -40px;
      width: 110px;
      background-color: transparent;
      box-shadow: none;
      border: none;
      visibility: visible;
      display: block;
      height: 165px;
    }
    .wechat-qrcode::after {
      content: none;
    }
    h4 {
      display: none;
    }
  }
}

@media (max-width: 768px) {
  .project-header-tabs {
    .el-tabs__nav.is-top {
      width: 100%;
      display: flex;
      height: 40px;
      .el-tabs__item {
        line-height: 40px;
        width: 33.3333%;
        text-align: center;
      }
    }
  }
  .project-index-phone-operations-foot {
    height: 40px;
    position: fixed;
    z-index: 998;
    bottom: 0;
    right: 0;
    left: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #ffffff;
    box-shadow: 0 0 21px 8px rgba(165, 163, 139, 0.3);
    &-item {
      flex: 1;
      text-align: center;
      font-size: 16px;
      &:active {
        color: #4db5ff;
      }
      &.item-select {
        color: #2397f3;
      }
      &:not(:first-child) {
        border-left: 1px solid #cfcfcf;
      }
    }
  }
}
</style>

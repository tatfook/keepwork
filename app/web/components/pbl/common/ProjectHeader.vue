<template>
  <div class="project-header">
    <div class="container">
      <el-breadcrumb separator="/" class="project-header-breadcrumb">
        <el-breadcrumb-item :to="{ path: '/' }">
          <img class="project-header-breadcrumb-home-icon" src="@/assets/pblImg/home.png" alt="">
        </el-breadcrumb-item>
        <el-breadcrumb-item><a :href="'/' + editingProjectUsername" target="_blank">{{editingProjectUsername}}</a></el-breadcrumb-item>
        <el-breadcrumb-item>
          <el-dropdown @visible-change='dropdownVisibleChange' placement='bottom' trigger="click">
            <span class="el-dropdown-link">
              {{editingProjectName}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown" v-loading='isDropdownLoading'>
              <el-dropdown-item @click.native="toProjectIndexPage(project)" :disabled='editingProjectName == project.name' v-for="(project, index) in userProjectList" :key="index">{{project.name}}</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-breadcrumb-item>
      </el-breadcrumb>
      <div class="project-header-operations">
        <div class="project-header-operations-item">
          <el-button plain size="medium">
            <i class="iconfont icon-share1"></i>分享
          </el-button>
        </div>
        <div class="project-header-operations-item">
          <el-button plain size="medium" @click="toggleFavoriteProject" :loading="isFavoriteButtonLoading">
            <i class="iconfont" :class="favoriteIconClass"></i>{{isUserFavoriteProject ? '取消收藏': '收藏'}}
          </el-button>
          <span class="project-header-operations-item-count">{{projectDetail.favoriteCount}}</span>
        </div>
        <div class="project-header-operations-item">
          <el-button plain size="medium" @click='toggleStarProject' :loading="isStarButtonLoading">
            <i class="iconfont" :class="starIconClass"></i>{{isUserStaredProject ? '取消点赞': '点赞'}}
          </el-button>
          <span class="project-header-operations-item-count">{{projectDetail.star}}</span>
        </div>
      </div>
      <el-tabs v-model="activePageName" class="project-header-tabs" @tab-click="handleTabClick">
        <el-tab-pane name="ProjectIndexPage">
          <span slot="label" class="project-header-tabs-label">主页</span>
        </el-tab-pane>
        <!-- <el-tab-pane name="second">
          <span slot="label" class="project-header-tabs-label">白板</span>
        </el-tab-pane> -->
        <el-tab-pane name="EditProject">
          <span slot="label" class="project-header-tabs-label">设定</span>
        </el-tab-pane>
        <!-- <el-tab-pane name="fourth">
          <span slot="label" class="project-header-tabs-label">网站</span>
        </el-tab-pane> -->
      </el-tabs>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'ProjectHeader',
  props: {
    projectDetail: Object,
    editingProjectUsername: String,
    editingUserId: Number
  },
  data() {
    return {
      isDropdownLoading: false,
      isFavoriteButtonLoading: false,
      isStarButtonLoading: false,
      activePageName: this.$route.name
    }
  },
  computed: {
    ...mapGetters({
      userProjects: 'pbl/userProjects',
      projectFavoriteState: 'pbl/projectFavoriteState',
      projectStarState: 'pbl/projectStarState',
    }),
    editingProjectName() {
      return _.get(this.projectDetail, 'name')
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
    }
  },
  methods: {
    ...mapActions({
      pblGetUserProjects: 'pbl/getUserProjects',
      favoriteProject: 'pbl/favoriteProject',
      unFavoriteProject: 'pbl/unFavoriteProject',
      starProject: 'pbl/starProject',
      unStarProject: 'pbl/unStarProject'
    }),
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
      this.$router.push({ path: `/project/${projectId}/edit` })
    },
    async toggleStarProject() {
      let projectId = this.editingProjectId
      this.isStarButtonLoading = true
      if (!this.isUserStaredProject) {
        await this.starProject({ projectId })
          .then(() => {
            this.showMessage({
              message: '点赞成功'
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
              message: '取消点赞成功'
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
      let objectId = this.editingProjectId
      let objectType = 5
      this.isFavoriteButtonLoading = true
      if (!this.isUserFavoriteProject) {
        await this.favoriteProject({ objectId, objectType })
          .then(() => {
            this.showMessage({
              message: '收藏成功'
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
              message: '取消收藏成功'
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
</style>

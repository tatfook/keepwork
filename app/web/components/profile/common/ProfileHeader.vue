<template>
  <div class="profile-header">
    <div class="container">
      <el-breadcrumb separator="/" class="profile-header-breadcrumb hidden-sm-and-down">
        <el-breadcrumb-item :to="{ path: '/' }">
          <img class="profile-header-breadcrumb-home-icon" src="@/assets/pblImg/home.png" alt="" @click="goHomePage">
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <span>{{nowUsername}}</span>
        </el-breadcrumb-item>
      </el-breadcrumb>
      <el-tabs v-model="activePageName" class="profile-header-tabs" @tab-click="handleTabClick">
        <el-tab-pane name="ProfileIndexPage">
          <span slot="label" class="profile-header-tabs-label">{{$t("profile.overview")}}</span>
        </el-tab-pane>
        <el-tab-pane name="ProfileSocialPage">
          <span slot="label" class="profile-header-tabs-label">{{$t("profile.friends")}}</span>
        </el-tab-pane>
        <!-- <el-tab-pane name="ProfileProjectPage">
          <span slot="label" class="profile-header-tabs-label">{{$t("profile.projects")}}</span>
        </el-tab-pane> -->
      </el-tabs>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'ProfileHeader',
  props: {
    nowUsername: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      activePageName: this.$route.name
    }
  },
  methods: {
    goHomePage() {
      window.location.href = `/`
    },
    handleTabClick(tabItem) {
      let { paneName } = tabItem
      this.$router.push({ name: paneName })
    }
  },
  watch: {
    $route(newRoute) {
      this.activePageName = newRoute.name
    }
  }
}
</script>
<style lang="scss">
.profile-header {
  background-color: #fff;
  box-shadow: 0 1px 3px 0px rgba(0, 0, 0, 0.1);
  &-breadcrumb {
    font-size: 16px;
    padding-top: 24px;
    margin-bottom: 32px;
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
<style lang="scss">
@media only screen and (max-width: 991px) {
  .profile-header {
    padding: 0 16px;
        box-shadow: none;
    border-bottom: 1px solid #ebeef5;

    &-tabs {
      &-label {
        color: #909399;
      }
      .el-tabs__item.is-active {
        & > span {
          color: #303133;
        }
      }
    }
    .el-tabs__nav {
      width: 100%;
      display: flex;
      justify-content: space-around;
    }
  }
}
</style>

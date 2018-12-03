<template>
  <div class="profile-index">
    <div class="container">
      <div class="profile-index-sidebar">
        <user-basic-msg class="profile-index-sidebar-item" :nowUserDetail='nowUserDetail'></user-basic-msg>
        <user-certificates :nowUserDetail='nowUserDetail'></user-certificates>
      </div>
      <div class="profile-index-main">
        <div class="profile-index-infos profile-index-main-item">
          <div class="profile-index-infos-item">
            <i class="iconfont icon-folder-open"></i>
            <span class="profile-index-infos-label">项目</span>
            <div class="profile-index-infos-msg" v-if="nowUserDetail.rank.project > 0">
              <span class="profile-index-infos-msg-item">
                <span class="profile-index-infos-count">{{nowUserDetail.rank.project}}</span>个项目
              </span>
              <i class="iconfont icon-comma"></i>
              <span class="profile-index-infos-msg-item">
                <span class="profile-index-infos-count">{{nowUserDetail.rank.world}}</span>个3D世界
              </span>
              <i class="iconfont icon-comma"></i>
              <span class="profile-index-infos-msg-item">
                <span class="profile-index-infos-count">{{nowUserDetail.rank.site}}</span>个网站
              </span>
            </div>
            <div class="profile-index-infos-intro" v-else>
              项目是什么？如何创建项目？<span class="profile-index-infos-intro-link" @click="showLearnGuide">了解更多</span>
            </div>
            <router-link class="profile-index-infos-link" :to='{name:"ProfileProjectPage"}'>项目主页<i class="el-icon-arrow-right"></i></router-link>
            <create-project-guide :showGuideDialog="showGuideDialog" @close="closeLearnGuide"></create-project-guide>
          </div>
        </div>
        <recent-project class="profile-index-main-item" :nowUserDetail='nowUserDetail'></recent-project>
        <contribution-calendar class="profile-index-main-item" :nowUserDetail='nowUserDetail'></contribution-calendar>
        <user-experiences class="profile-index-main-item" :nowUserDetail='nowUserDetail'></user-experiences>
      </div>
    </div>
  </div>
</template>
<script>
import CreateProjectGuide from '@/components/common/CreateProjectGuide'
import ContributionCalendar from '@/components/common/ContributionCalendar'
import UserBasicMsg from './common/UserBasicMsg'
import RecentProject from './common/RecentProject'
import UserCertificates from './common/UserCertificates'
import UserExperiences from './common/UserExperiences'
export default {
  name: 'ProfileIndex',
  props: {
    nowUserDetail: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      showGuideDialog: false
    }
  },
  methods: {
    showLearnGuide() {
      this.showGuideDialog = true
    },
    closeLearnGuide() {
      this.showGuideDialog = false
    }
  },
  components: {
    UserBasicMsg,
    UserCertificates,
    RecentProject,
    ContributionCalendar,
    UserExperiences,
    CreateProjectGuide
  }
}
</script>
<style lang="scss">
.profile-index {
  padding-top: 24px;
  & > .container {
    display: flex;
  }
  &-sidebar {
    width: 272px;
    margin-right: 28px;
    &-item {
      margin-bottom: 24px;
      background-color: #fff;
    }
  }
  &-main {
    flex: 1;
    min-width: 0;
    &-item {
      margin-bottom: 24px;
    }
  }
  &-infos {
    background-color: #fff;
    padding: 2px 16px;
    &-item {
      height: 70px;
      display: flex;
      align-items: center;
      .iconfont:not(.icon-comma) {
        display: inline-block;
        width: 42px;
        height: 42px;
        text-align: center;
        line-height: 42px;
        background-color: #e9f4fe;
        color: #2397f3;
        font-size: 24px;
        border-radius: 4px;
      }
      .icon-comma {
        color: #ddd;
        font-size: 12px;
        vertical-align: text-bottom;
        bottom: -5px;
        position: relative;
        transform: scale(0.8);
        display: inline-block;
      }
    }
    &-label {
      font-size: 18px;
      color: #303133;
      font-weight: bold;
      margin: 0 48px 0 16px;
    }
    &-msg {
      flex: 1;
      &-item {
        font-size: 14px;
        color: #a0a4aa;
      }
    }
    &-intro {
      flex: 1;
      font-size: 14px;
      color: #c0c4cc;
      &-link {
        font-size: 12px;
        cursor: pointer;
        color: #3ea4fa;
        margin-left: 8px;
      }
    }
    &-count {
      font-weight: bold;
      color: #303133;
      font-size: 24px;
      margin-right: 8px;
    }
    &-link {
      font-size: 12px;
      color: #909399;
      text-decoration: none;
      .el-icon-arrow-right {
        margin-left: 4px;
      }
    }
  }
}
</style>

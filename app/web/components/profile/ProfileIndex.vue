<template>
  <div class="profile-index">
    <div class="container">
      <div class="profile-index-sidebar">
        <user-basic-msg class="profile-index-sidebar-item" :nowUserDetail='nowUserDetail'></user-basic-msg>
        <user-certificates></user-certificates>
      </div>
      <div class="profile-index-main">
        <div class="profile-index-infos">
          <div class="profile-index-infos-item">
            <i class="iconfont icon-folder-open"></i>
            <span class="profile-index-infos-label">项目</span>
            <div class="profile-index-infos-msg">
              <span class="profile-index-infos-msg-item">
                <span class="profile-index-infos-count">54</span>个项目
              </span>
              <span class="profile-index-infos-msg-item">
                <span class="profile-index-infos-count">41</span>个3D世界
              </span>
              <span class="profile-index-infos-msg-item">
                <span class="profile-index-infos-count">13</span>个网站
              </span>
            </div>
            <router-link class="profile-index-infos-link" :to='{name:"ProfileProjectPage"}'>项目主页<i class="el-icon-arrow-right"></i></router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import UserBasicMsg from './common/UserBasicMsg'
import UserCertificates from './common/UserCertificates'
export default {
  name: 'ProfileIndex',
  props: {
    nowUserDetail: {
      type: Object,
      required: true
    }
  },
  components: {
    UserBasicMsg,
    UserCertificates
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
  }
  &-infos {
    background-color: #fff;
    padding: 2px 16px;
    &-item {
      height: 70px;
      display: flex;
      align-items: center;
      .iconfont {
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

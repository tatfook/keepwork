<template>
  <div class="profile-social">
    <div class="container">
      <div class="profile-social-sidebar hidden-sm-and-down">
        <user-basic-msg class="profile-social-sidebar-item" :nowUserDetail='nowUserDetail' :isLoginUserEditable='isLoginUserEditable'></user-basic-msg>
      </div>
      <div class="profile-social-main">
        <el-tabs class="profile-social-tabs profile-social-main-item" v-model="activeName">
          <el-tab-pane name="favorite">
            <span slot='label'>关注</span>
            <user-list :nowProfileUserId="nowProfileUserId" listType='favorite'></user-list>
          </el-tab-pane>
          <el-tab-pane name="follow">
            <span slot='label'>粉丝</span>
            <user-list :nowProfileUserId="nowProfileUserId" listType='follow'></user-list>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import UserBasicMsg from './common/UserBasicMsg'
import UserList from './common/UserList'
export default {
  name: 'ProfileSocial',
  props: {
    nowUserDetail: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      activeName: 'favorite'
    };
  },
  computed: {
    ...mapGetters({
      loginUserId: 'user/userId'
    }),
    nowProfileUserId() {
      return this.nowUserDetail.id
    },
    isLoginUserEditable() {
      return this.loginUserId === this.nowProfileUserId
    }
  },
  components: {
    UserBasicMsg,
    UserList
  }
}
</script>
<style lang="scss">
.profile-social {
  padding-top: 24px;
  & > .container {
    display: flex;
  }
  &-sidebar {
    width: 272px;
    margin-right: 28px;
    &-item {
      background-color: #fff;
      margin-bottom: 24px;
    }
  }
  &-main {
    flex: 1;
    min-width: 0;
    &-item {
      background-color: #fff;
      margin-bottom: 24px;
      border: 1px solid #e8e8e8;
      border-radius: 4px;
    }
  }
  &-tabs {
    .el-tabs__header {
      margin-bottom: 0;
    }
    .el-tabs__nav-wrap {
      padding: 10px 16px;
      &::after {
        height: 1px;
        background-color: #e8e8e8;
      }
    }
    .el-tabs__active-bar {
      display: none;
    }
    .el-tabs__item {
      font-size: 14px;
      color: #909399;
      padding: 0 2px;
      & > span {
        display: inline-block;
        padding: 5px 18px;
        line-height: 1;
      }
    }
    .el-tabs__item.is-active {
      & > span {
        background-color: #2397f3;
        color: #fff;
        border-radius: 24px;
      }
    }
  }
}
</style>
<style lang="scss">
@media only screen and (max-width: 991px) {
  .profile-social {
    padding-top: 8px;
    &-tabs {
      .el-tabs__nav-wrap {
        padding: 6px 48px;
      }
      .el-tabs__nav {
        display: flex;
        width: 100%;
        justify-content: space-between;
      }
      .el-tabs__item {
        height: 28px;
        line-height: 28px;
      }
      .el-tabs__item.is-active {
        & > span {
          padding: 7px 30px;
          border-radius: 28px;
        }
      }
    }
  }
}
</style>

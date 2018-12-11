<template>
  <div class="profile-social">
    <div class="container">
      <div class="profile-social-sidebar hidden-sm-and-down">
        <user-basic-msg class="profile-social-sidebar-item" :nowUserDetail='nowUserDetail' :isLoginUserEditable='isLoginUserEditable'></user-basic-msg>
      </div>
      <div class="profile-social-main">
        <el-tabs class="profile-social-tabs profile-social-main-item" v-model="activeName" v-loading='isLoading'>
          <el-tab-pane name="favorite">
            <span slot='label'>{{$t('profile.following')}}</span>
            <user-list v-if="!isEmpty" :userList='userList'></user-list>
            <div v-if="isEmpty" class="profile-social-empty">
              <img :src="emptyImg" alt="">
              <div class="user-list-empty-info">{{emptyInfo}}</div>
            </div>
          </el-tab-pane>
          <el-tab-pane name="follow">
            <span slot='label'>{{$t('profile.followers')}}</span>
            <user-list v-if="!isEmpty" :userList='userList'></user-list>
            <div v-if="isEmpty" class="profile-social-empty">
              <img :src="emptyImg" alt="">
              <div class="user-list-empty-info">{{emptyInfo}}</div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
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
  mounted() {
    this.initFavoriteData()
  },
  data() {
    return {
      isLoading: false,
      activeName: 'favorite'
    };
  },
  computed: {
    ...mapGetters({
      loginUserId: 'user/userId',
      favoriteUsers: 'profile/favoriteUsers',
      followUsers: 'profile/followUsers'
    }),
    nowProfileUserId() {
      return this.nowUserDetail.id
    },
    isLoginUserEditable() {
      return this.loginUserId === this.nowProfileUserId
    },
    loginUserFavoriteUsers() {
      return this.favoriteUsers({ userId: this.loginUserId })
    },
    nowProfileFavoriteUsers() {
      return this.favoriteUsers({ userId: this.nowProfileUserId })
    },
    nowProfileFollowUsers() {
      return this.followUsers({ userId: this.nowProfileUserId })
    },
    isFavoriteType() {
      return this.activeName === 'favorite'
    },
    isFollowType() {
      return this.activeName === 'follow'
    },
    userList() {
      let list = []
      if (this.isFavoriteType) {
        list = this.nowProfileFavoriteUsers
      } else {
        list = this.nowProfileFollowUsers
      }
      let usersWithFollowState = _.map(list, user => {
        let isUserInLoginUserFavorites = _.find(this.loginUserFavoriteUsers, { 'id': user.id })
        return {
          ...user,
          isFollowed: !_.isUndefined(isUserInLoginUserFavorites)
        }
      })
      return usersWithFollowState
    },
    isEmpty() {
      return !Boolean(this.userList && this.userList.length)
    },
    emptyImg() {
      return this.isFavoriteType ? require('@/assets/img/default_followers.png') : require('@/assets/img/default_fans.png')
    },
    emptyInfo() {
      return this.isFavoriteType ? this.$t('profile.noFriendsToShow') : this.$t('profile.noFollowersToShow')
    }
  },
  methods: {
    ...mapActions({
      profileGetFavoriteUsers: 'profile/getFavoriteUsers',
      profileGetFollowUsers: 'profile/getFollowUsers'
    }),
    async initFavoriteData() {
      let userId = this.nowProfileUserId
      this.isLoading = true
      await Promise.all([
        this.isFavoriteType ? this.profileGetFavoriteUsers({ userId }) : this.profileGetFollowUsers({ userId }),
        this.profileGetFavoriteUsers({ userId: this.loginUserId }),
      ])
      this.isLoading = false
    }
  },
  watch: {
    activeName() {
      this.initFavoriteData()
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
  &-empty {
    text-align: center;
    padding: 36px 0 48px;
    font-size: 14px;
    color: #a6adb3;
    &-info {
      margin-top: 24px;
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

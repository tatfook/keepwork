<template>
  <div class="user-item">
    <div class="user-item-portrait">
      <img :src="user.portrait || defaultPortrait" alt="">
    </div>
    <div class="user-item-info">
      <router-link class="user-item-info-name" :to="{name: 'ProfileIndexPage', params: {username: user.username}}" target="_blank">{{user.nickname || user.username}}</router-link>
      <div class="user-item-info-desc">{{user.description}}</div>
    </div>
    <div class="user-item-operate" v-if="!isLoginUserBeNowUser">
      <el-button :class="followState | buttonClassFilter" :loading="isFavoriteButtonLoading" type="primary" @click="toggleFavoriteUser">{{followState ? $t('profile.followed'):$t('profile.follow')}}</el-button>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex"
export default {
  name: 'UserItem',
  props: {
    user: {
      type: Object,
      required: true
    },
    isGetRankDetailAfterFavorite: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isFavoriteButtonLoading: false,
      followState: this.user.isFollowed,
      defaultPortrait: require('@/assets/img/default_portrait.png')
    }
  },
  computed: {
    ...mapGetters({
      isLogined: 'user/isLogined',
      loginUserId: 'user/userId'
    }),
    originFollowState() {
      return this.user.isFollowed
    },
    nowUserId() {
      return this.user.id
    },
    isLoginUserBeNowUser() {
      return this.nowUserId === this.loginUserId
    }
  },
  methods: {
    ...mapActions({
      profileFavoriteUser: 'profile/favoriteUser',
      profileUnFavoriteUser: 'profile/unFavoriteUser',
      toggleLoginDialog: 'user/toggleLoginDialog'
    }),
    async toggleFavoriteUser() {
      if (!this.isLogined) {
        return this.toggleLoginDialog(true)
      }
      let objectId = this.nowUserId
      let objectType = 0
      this.isFavoriteButtonLoading = true
      let isGetRankDetailAfterFavorite = this.isGetRankDetailAfterFavorite
      if (!this.followState) {
        await this.profileFavoriteUser({ objectId, objectType, isGetRankDetailAfterFavorite })
          .then(() => {
            this.showMessage({
              message: this.$t('project.successfullyStarred')
            })
            this.isFavoriteButtonLoading = false
          })
          .catch(error => {
            this.isFavoriteButtonLoading = false
          })
      } else {
        await this.profileUnFavoriteUser({ objectId, objectType, isGetRankDetailAfterFavorite })
          .then(() => {
            this.showMessage({
              message: this.$t('project.successfullyUnstarred')
            })
            this.isFavoriteButtonLoading = false
          })
          .catch(error => {
            this.isFavoriteButtonLoading = false
          })
        this.isFavoriteButtonLoading = false
      }
      this.followState = !this.followState
    }
  },
  watch: {
    originFollowState(newVal) {
      this.followState = newVal
    }
  },
  filters: {
    buttonClassFilter(isFollowed) {
      return isFollowed ? 'button-outline' : ''
    }
  }
}
</script>
<style lang="scss">
.user-item {
  padding: 14px 48px 14px 24px;
  display: flex;
  align-items: center;
  &-portrait {
    margin-right: 16px;
    font-size: 0;
    img {
      display: inline-block;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      object-fit: cover;
    }
  }
  &-info {
    flex: 1;
    margin-right: 16px;
    &-name {
      font-size: 14px;
      color: #303133;
      text-decoration: none;
      &:hover {
        color: #2397f3;
      }
    }
    &-desc {
      font-size: 12px;
      color: #909399;
    }
  }
  &-operate {
    .el-button {
      font-size: 12px;
      width: 66px;
      padding: 5px 0;
    }
    .button-outline {
      background-color: transparent;
      color: #2397f3;
    }
  }
}
</style>
<style lang="scss">
@media only screen and (max-width: 991px) {
  .user-item {
    padding: 12px 16px;
    &-info {
      min-width: 0;
      &-desc {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>

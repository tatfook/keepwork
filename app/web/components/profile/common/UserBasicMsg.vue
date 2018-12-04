<template>
  <div class="user-basic-msg">
    <div class="user-basic-msg-profile">
      <img :src='nowUserDetail.portrait' alt="">
    </div>
    <div class="user-basic-msg-username">{{nowUserDetail.username}}</div>
    <div class="user-basic-msg-desc">{{nowUserDetail.description}}</div>
    <div class="user-basic-msg-rank-info">
      <div class="user-basic-msg-rank-info-item">
        <div class="user-basic-msg-rank-info-label">项目</div>
        <div class="user-basic-msg-rank-info-count">{{nowUserDetail.rank.project}}</div>
      </div>
      <div class="user-basic-msg-rank-info-item">
        <div class="user-basic-msg-rank-info-label">关注</div>
        <div class="user-basic-msg-rank-info-count">{{nowUserDetail.rank.follow}}</div>
      </div>
      <div class="user-basic-msg-rank-info-item">
        <div class="user-basic-msg-rank-info-label">粉丝</div>
        <div class="user-basic-msg-rank-info-count">{{nowUserDetail.rank.fans}}</div>
      </div>
    </div>
    <div class="user-basic-msg-operation">
      <el-button v-if="isLoginUserEditable">编辑个人资料</el-button>
      <el-button v-else type="primary" :loading="isFavoriteButtonLoading" @click="toggleFavoriteState">{{isLoginUserFavoritteNowUser ? '取消关注':'关注'}}</el-button>
    </div>
    <div class="user-basic-msg-infos">
      <div class="user-basic-msg-infos-item">
        <i class="iconfont icon-location"></i>{{nowUserDetail.extra.location || "未知地址"}}
      </div>
      <div class="user-basic-msg-infos-item">
        <i class="iconfont icon-link1"></i>keepwork.com/{{nowUserDetail.username}}
      </div>
      <div class="user-basic-msg-infos-item">
        <i class="iconfont icon-reloadtime"></i>注册于 {{nowUserDetail.createdAt | formatDate}}
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import dayjs from 'dayjs'
export default {
  name: 'UserBasicMsg',
  props: {
    nowUserDetail: {
      type: Object,
      required: true
    },
    isLoginUserEditable: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.initFavoriteState()
  },
  data() {
    return {
      isFavoriteButtonLoading: false
    }
  },
  computed: {
    ...mapGetters({
      isLogined: 'user/isLogined',
      loginUserId: 'user/userId',
      profileUserFavoriteState: 'profile/userFavoriteState'
    }),
    nowUserId() {
      return this.nowUserDetail.id
    },
    isLoginUserFavoritteNowUser() {
      return this.profileUserFavoriteState({
        userId: this.nowUserId
      })
    }
  },
  methods: {
    ...mapActions({
      profileGetFavoriteState: 'profile/getFavoriteState',
      toggleLoginDialog: 'user/toggleLoginDialog',
      profileFavoriteUser: 'profile/favoriteUser',
      profileUnFavoriteUser: 'profile/unFavoriteUser'
    }),
    async initFavoriteState() {
      await this.profileGetFavoriteState({
        objectId: this.nowUserId,
        objectType: 0
      })
    },
    async toggleFavoriteState() {
      if (!this.isLogined) {
        return this.toggleLoginDialog(true)
      }
      let objectId = this.nowUserId
      let objectType = 0
      this.isFavoriteButtonLoading = true
      if (!this.isLoginUserFavoritteNowUser) {
        await this.profileFavoriteUser({ objectId, objectType })
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
        await this.profileUnFavoriteUser({ objectId, objectType })
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
    }
  },
  watch: {
    loginUserId() {
      this.initFavoriteState()
    },
    nowUserId() {
      this.initFavoriteState()
    }
  },
  filters: {
    formatDate(date) {
      return dayjs(date).format('YYYY年MM月DD日 HH:mm')
    }
  }
}
</script>
<style lang="scss">
.user-basic-msg {
  font-size: 13px;
  text-align: center;
  color: #606266;
  &-profile {
    margin-top: 32px;
    display: inline-block;
    width: 100%;
    img {
      width: 96px;
      height: 96px;
      object-fit: cover;
      border-radius: 50%;
    }
  }
  &-username {
    font-size: 16px;
    margin: 16px 0 8px;
    color: #303133;
  }
  &-desc {
    color: #c0c4cc;
    font-size: 12px;
  }
  &-rank-info {
    display: flex;
    margin: 24px 0 18px;
    &-item {
      flex: 1;
    }
    &-count {
      font-size: 18px;
      color: #303133;
      font-weight: bold;
      margin-top: 8px;
    }
  }
  &-operation {
    padding: 0 32px;
    margin-bottom: 24px;
    .el-button {
      font-size: 13px;
      width: 100%;
      padding: 8.5px 0;
    }
    .el-button--default {
      background: linear-gradient(#fff, #f6f7f8);
    }
  }
  &-infos {
    border-top: 1px solid #e8e8e8;
    text-align: left;
    padding: 18px 24px;
    &-item {
      margin-bottom: 6px;
      &:last-child {
        margin-bottom: 0;
      }
      .iconfont {
        margin-right: 12px;
      }
    }
  }
}
</style>

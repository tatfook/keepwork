<template>
  <div class="user-basic-msg">
    <div class="user-basic-msg-profile">
      <user-portrait :user="nowUserDetail"></user-portrait>
    </div>
    <div class="user-basic-msg-username-desc">
      <div class="user-basic-msg-username">{{nowUserDetail.username}}</div>
      <div class="user-basic-msg-desc" :title="nowUserDetail.description">{{nowUserDetail.description}}</div>
    </div>
    <div class="user-basic-msg-rank-info hidden-sm-and-down">
      <div class="user-basic-msg-rank-info-item">
        <div class="user-basic-msg-rank-info-label">{{$t("profile.projects")}}</div>
        <div class="user-basic-msg-rank-info-count">{{nowUserDetail.rank.project}}</div>
      </div>
      <div class="user-basic-msg-rank-info-item">
        <div class="user-basic-msg-rank-info-label">{{$t("profile.following")}}</div>
        <div class="user-basic-msg-rank-info-count">{{nowUserDetail.rank.follow}}</div>
      </div>
      <div class="user-basic-msg-rank-info-item">
        <div class="user-basic-msg-rank-info-label">{{$t("profile.followers")}}</div>
        <div class="user-basic-msg-rank-info-count">{{nowUserDetail.rank.fans}}</div>
      </div>
    </div>
    <div class="user-basic-msg-operation">
      <el-button v-if="isLoginUserEditable" @click="isPersonalCenterShow = true">{{$t("profile.addBio")}}</el-button>
      <el-button v-else type="primary" :class="{'button-outline': isLoginUserFavoritteNowUser}" :loading="isFavoriteButtonLoading" @click="toggleFavoriteState">{{isLoginUserFavoritteNowUser ? $t("profile.followed"):$t("profile.follow")}}</el-button>
    </div>
    <div class="user-basic-msg-infos hidden-sm-and-down">
      <div class="user-basic-msg-infos-item">
        <i class="iconfont icon-location"></i>{{nowUserDetail.extra && nowUserDetail.extra.location || $t("profile.unknownAddress")}}
      </div>
      <div class="user-basic-msg-infos-item">
        <i class="iconfont icon-link1"></i>keepwork.com/u/{{nowUserDetail.username}}
      </div>
      <div class="user-basic-msg-infos-item">
        <i class="iconfont icon-reloadtime"></i>{{$t("profile.registerAt")}} {{nowUserDetail.createdAt | formatDate(formatType)}}
      </div>
    </div>
    <personal-center-dialog v-if="isLoginUserEditable" :show='isPersonalCenterShow' @close='isPersonalCenterShow = false'></personal-center-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import UserPortrait from '@/components/common/UserPortrait'
import { locale } from '@/lib/utils/i18n'
import moment from 'moment'
import PersonalCenterDialog from '@/components/common/PersonalCenterDialog'
import UserPortrait from '@/components/common/UserPortrait'
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
      isPersonalCenterShow: false,
      isFavoriteButtonLoading: false
    }
  },
  computed: {
    ...mapGetters({
      isLogined: 'user/isLogined',
      loginUserId: 'user/userId',
      profileUserFavoriteState: 'profile/userFavoriteState'
    }),
    formatType() {
      return locale === 'en-US'
        ? 'hh:mm a DD MMM. YYYY'
        : 'YYYY年MM月DD日 HH:mm'
    },
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
      this.isLogined &&
        (await this.profileGetFavoriteState({
          objectId: this.nowUserId,
          objectType: 0
        }))
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
  components: {
    UserPortrait,
    PersonalCenterDialog
  },
  filters: {
    formatDate(date, formatType) {
      return moment(date).format(formatType)
    }
  }
}
</script>
<style lang="scss">
.user-basic-msg {
  border: 1px solid #ebeef5;
  border-radius: 4px;
  font-size: 13px;
  text-align: center;
  color: #606266;
  &-profile {
    margin-top: 32px;
    display: inline-block;
    width: 100%;
  }
  &-username {
    font-size: 16px;
    margin: 16px 0 8px;
    color: #303133;
  }
  &-desc {
    color: #c0c4cc;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding: 0 16px;
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
    .button-outline {
      background-color: transparent;
      color: #2397f3;
    }
  }
  &-infos {
    border-top: 1px solid #e8e8e8;
    text-align: left;
    padding: 18px 24px;
    &-item {
      margin-bottom: 6px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
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
<style lang="scss">
@media only screen and (max-width: 991px) {
  .user-basic-msg {
    display: flex;
    align-items: center;
    padding: 20px 16px;
    background-color: #fff;
    border: none;
    &-profile {
      margin-top: 0;
      width: auto;
      font-size: 0;
    }
    &-username-desc {
      flex: 1;
      text-align: left;
      padding: 0 20px;
    }
    &-username {
      margin-top: 0;
    }
    &-desc {
      color: #909399;
    }
    &-operation {
      margin-bottom: 0;
      padding: 0;
      width: auto;
      .el-button {
        width: auto;
        min-width: 65px;
        padding: 8.5px 8px;
      }
    }
  }
}
</style>

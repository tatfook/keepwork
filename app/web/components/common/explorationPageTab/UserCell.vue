<template>
  <div class="user-cell">
    <div class="user-tab">
      <div class="user-tab-cover" @click="goUserHomePage(user)"><img class="user-tab-cover-img" :src="user.portrait || default_portrait" alt=""></div>
      <h5 class="user-tab-name" @click="goUserHomePage(user)">{{user.username}}</h5>
      <p class="user-tab-brief" :title="user.description">{{user.description || $t("common.noSelfIntro")}}</p>
      <div class="user-tab-abstract">
        <div>
          <p class="title">{{$t("explore.project")}}</p>
          <p class="amount">{{user.total_projects || 0}}</p>
        </div>
        <div class="member">
          <p class="title">{{$t("explore.following")}}</p>
          <p class="amount">{{user.total_follows || 0}}</p>
        </div>
        <div>
          <p class="title">{{$t("explore.followers")}}</p>
          <p class="amount">{{user.total_fans || 0}}</p>
        </div>
      </div>
      <div class="user-tab-join">
        <el-button type="primary" :class="['user-tab-join-button',{'is-followed': user.isFollowed}]" :loading="isLoading" @click="toggleFollow(user)">{{user.isFollowed ? $t("explore.followed") : $t("explore.follow")}}</el-button>
        <el-button class="user-tab-join-button" @click="goUserHomePage(user)">{{$t("explore.profile")}}</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import default_portrait from '@/assets/img/default_portrait.png'
import { keepwork, EsAPI } from '@/api'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'UserCell',
  props: {
    user: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      isLoading: false,
      default_portrait
    }
  },
  computed: {
    ...mapGetters({
      isLogined: 'user/isLogined',
    })
  },
  methods: {
    ...mapActions({
      toggleLoginDialog: 'pbl/toggleLoginDialog'
    }),
    showMessage({ type = 'success', message = '操作成功' }) {
      this.$message({ type, message })
    },
    async toggleFollow(user) {
      if (!this.isLogined) {
        return this.toggleLoginDialog(true)
      }
      this.isLoading = true
      if (!this.user.isFollowed) {
        await keepwork.favorites
          .favoriteObject({ objectId: user.id, objectType: 0 })
          .then(res => {
            this.showMessage({
              message: this.$t('explore.successfullyFollowed')
            })
            this.user.isFollowed = true
            this.user.total_fans = this.user.total_fans ? this.user.total_fans + 1 : 1
            this.isLoading = false
          })
          .catch(err => {
            this.showMessage({
              message: '关注失败'
            })
            this.isLoading = false
          })
      } else {
        await keepwork.favorites
          .unFavoriteObject({ objectId: user.id, objectType: 0 })
          .then(res => {
            this.showMessage({
              message: this.$t('explore.successfullyUnfollowed')
            })
            this.user.isFollowed = false
            this.user.total_fans =
              this.user.total_fans - 1 < 0 ? 0 : this.user.total_fans - 1
            this.isLoading = false
          })
          .catch(err => {
            this.showMessage({
              message: '取消关注失败'
            })
            this.isLoading = false
          })
      }
    },
    goUserHomePage() {
      window.location.href = `/u/${this.user.username}`
    }
  }
}
</script>

<style lang="scss">
.user-cell {
  .user-tab {
    width: 286px;
    border: 1px solid #e8e8e8;
    background: #fff;
    padding: 30px 0;
    text-align: center;
    margin: 0 auto 10px;
    transition: all 200ms ease-in;
    &:hover {
      box-shadow: 0 12px 24px -6px rgba(0, 0, 0, 0.16);
      transition: all 200ms ease-in;
    }
    &-cover {
      width: 96px;
      height: 96px;
      cursor: pointer;
      margin: 0 auto;
      &-img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        object-fit: cover;
      }
    }
    &-name {
      font-size: 16px;
      color: #333;
      margin: 18px 0;
      line-height: 22px;
      cursor: pointer;
    }
    &-brief {
      font-size: 12px;
      color: #999;
      margin: 9px 9px;
      line-height: 16px;
      height: 18px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    &-abstract {
      display: flex;
      div {
        flex: 1;
        .title {
          font-size: 13px;
          color: #666;
        }
        .amount {
          line-height: 18px;
          font-size: 18px;
          color: #333;
        }
      }
      .member {
        position: relative;
      }
      .member::before {
        content: '';
        width: 1px;
        height: 20px;
        background: rgb(202, 200, 200);
        position: absolute;
        left: 0;
        top: 32px;
      }
      .member::after {
        content: '';
        width: 1px;
        height: 20px;
        background: rgb(202, 200, 200);
        position: absolute;
        right: 0;
        top: 32px;
      }
    }
    &-join {
      padding-top: 6px;
      &-button {
        height: 32px;
        width: 108px;
        padding: 0;
      }
    }
    .is-followed {
      background: #5fe1af;
      border: 1px solid #5fe1af;
    }
  }
}
@media screen and (max-width: 768px) {
  .user-cell {
    .user-tab {
      width: 164px;
      padding: 6px;
      font-size: 12px;
      &-cover {
        width: 56px;
        height: 56px;
      }
      &-name {
        font-size: 12px;
        margin: 8px;
      }
      &-brief {
        margin: 3px;
      }
      &-abstract {
        div {
          .title,
          .amount {
            font-size: 12px;
            height: 18px;
            margin: 10px 0;
          }
        }
        .member::before,
        .member::after {
          height: 20px;
          position: absolute;
          top: 22px;
        }
      }
      &-join {
        &-button {
          width: 70px;
        }
      }
    }
  }
}
</style>


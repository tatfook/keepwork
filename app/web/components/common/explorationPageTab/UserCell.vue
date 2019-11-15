<template>
  <div class="user-cell">
    <div class="user-tab">
      <div class="user-tab-cover">
        <a :href="`/u/${user.username}`" target="_blank">
          <user-portrait class="user-tab-cover-img" :width="96" :user="user"></user-portrait>
        </a>
      </div>
      <h5 class="user-tab-name"><a :href="`/u/${user.username}`" target="_blank">{{user.username}}</a></h5>
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
        <a class="user-tab-join-button" :href="`/u/${user.username}`" target="_blank">{{$t("explore.profile")}}</a>
      </div>
    </div>
  </div>
</template>
<script>
import UserPortrait from '@/components/common/UserPortrait'
import { keepwork, EsAPI } from '@/api'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'UserCell',
  components: {
    UserPortrait
  },
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
      isLoading: false
    }
  },
  computed: {
    ...mapGetters({
      isLogined: 'user/isLogined'
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
            this.user.total_fans = this.user.total_fans
              ? this.user.total_fans + 1
              : 1
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
      margin: 18px 0;
      line-height: 22px;
      & > a {
        color: #333;
        text-decoration: none;
        &:hover {
          color: #2397f3;
        }
      }
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
      & a {
        display: inline-block;
        border: 1px solid #dcdfe6;
        line-height: 32px;
        text-decoration: none;
        border-radius: 4px;
        margin-left: 10px;
        color: #606266;
        &:hover {
          color: #409eff;
          border-color: #c6e2ff;
          background-color: #ecf5ff;
        }
      }
    }
    .is-followed {
      background-color: transparent;
      color: #2397f3;
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


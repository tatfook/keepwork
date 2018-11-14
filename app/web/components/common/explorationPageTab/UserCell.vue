<template>
  <div class="user-cell">
    <div class="user-tab">
      <img class="user-tab-cover" @click="goUserHomePage(user)" :src="user.portrait || default_portrait" alt="">
      <h5 class="user-tab-name" @click="goUserHomePage(user)">{{user.username}}</h5>
      <p class="user-tab-brief" :title="user.description">{{user.description || '这家伙很懒，没有简介！'}}</p>
      <div class="user-tab-abstract">
        <div>
          <p class="title">项目</p>
          <p class="amount">{{user.total_projects || 0}}</p>
        </div>
        <div class="member">
          <p class="title">关注</p>
          <p class="amount">{{user.total_follows || 0}}</p>
        </div>
        <div>
          <p class="title">粉丝</p>
          <p class="amount">{{user.total_fans || 0}}</p>
        </div>
      </div>
      <div class="user-tab-jion">
        <el-button type="primary" :class="['user-tab-jion-button',{'is-followed': user.isFollowed}]" :loading="isLoading" @click="toggleFollow(user)">{{user.isFollowed ? '已关注' : '关注'}}</el-button>
        <el-button class="user-tab-jion-button" @click="goUserHomePage(user)">主页</el-button>
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
          .favoriteProject({ objectId: user.id, objectType: 0 })
          .then(res => {
            this.showMessage({
              message: '关注成功'
            })
            this.user.isFollowed = true
            this.user.total_fans = this.user.total_fans + 1
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
          .unFavoriteProject({ objectId: user.id, objectType: 0 })
          .then(res => {
            this.showMessage({
              message: '取消关注成功'
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
      this.$message({
        type: 'warning',
        message: '程序员小姐姐努力开发中'
      })
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
      border-radius: 50%;
      object-fit: cover;
      cursor: pointer;
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
    &-jion {
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
</style>


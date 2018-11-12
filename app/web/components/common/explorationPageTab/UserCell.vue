<template>
  <div class="user-cell">
    <div class="user-tab">
      <img class="user-tab-cover" @click="goUserHomePage(user)" :src="user.portrait || default_portrait" alt="">
      <h5 class="user-tab-name" @click="goUserHomePage(user)">{{user.username}}</h5>
      <p class="user-tab-brief">{{user.desc || '这家伙很懒，没有简介！'}}</p>
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
        <el-button type="primary" :class="['user-tab-jion-button',{'is-followed': true}]" :loading="false" @click="toggleFollow(user)">{{'已关注'}}</el-button>
        <el-button class="user-tab-jion-button" @click="goUserHomePage(user)">主页</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import default_portrait from '@/assets/img/default_portrait.png'

export default {
  name: "UserCell",
  props: {
    user:{
      type: Object,
      default(){
        return {}
      }
    }
  },
  methods: {
    showMessage({ type = 'success', message = '操作成功' }) {
      this.$message({ type, message })
    },
    async toggleFollow(user) {
      if (!this.isLogined) {
        return this.toggleLoginDialog(true)
      }
      if (true) {
        await keepwork.favorites
          .favoriteProject({ objectId: user.id, objectType: 0 })
          .then(res => {
            this.showMessage({
              message: '关注成功'
            })
            this.targetPage(this.currentPage)
            this.getFollows()
          })
          .catch(err => {
            this.showMessage({
              message: '关注失败'
            })
          })
      } else {
        await keepwork.favorites
          .unFavoriteProject({ objectId: user.id, objectType: 0 })
          .then(res => {
            this.showMessage({
              message: '取消关注成功'
            })
            this.targetPage(this.currentPage)
            this.getFollows()
          })
          .catch(err => {
            this.showMessage({
              message: '取消关注失败'
            })
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
  // .user-tab {
    // .el-row {
      .user-tab {
        width: 286px;
        border: 1px solid #e8e8e8;
        background: #fff;
        padding: 30px 0;
        text-align: center;
        margin: 0 auto 10px;
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
          margin: 9px 0;
          line-height: 16px;
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
    // }
  // }
}
</style>


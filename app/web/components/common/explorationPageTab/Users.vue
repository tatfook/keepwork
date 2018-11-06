<template>
  <div class="user-tab">
    <div class="search-result-total">搜索到：<span>{{usersCount}}</span>个结果</div>
    <el-row>
      <el-col :sm="12" :md="6" v-for="(user,index) in allUsersData" :key="user.id">
        <div class="user-tab">
          <img class="user-tab-cover" :src="user.portrait || default_portrait" alt="">
          <h5 class="user-tab-name">{{user.username}}</h5>
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
            <el-button type="primary" :class="['user-tab-jion-button',{'is-followed': isFollow(user,index)}]" :loading='isFollowLoading[index]' @click="toggleFollow(user,index)">{{isFollow(user,index) ? '已关注' : '+ 关注'}}</el-button>
            <el-button class="user-tab-jion-button" @click="goUserHomePage(user,index)">主页</el-button>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="all-projects-pages" v-if="usersCount > perPage">
      <div class="block">
        <span class="demonstration"></span>
        <el-pagination background @current-change="targetPage" layout="prev, pager, next" :page-size="perPage" :total="usersCount">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'
import default_portrait from '@/assets/img/default_portrait.png'
import { keepwork, EsAPI } from '@/api'

export default {
  name: 'Users',
  props: {
    searchKey: String,
    sortUsers: String
  },
  data() {
    return {
      perPage: 12,
      page: 1,
      loading: true,
      default_portrait,
      isFollowLoading: [],
      userAllFollows: [],
      currentPage: 1
    }
  },
  async mounted() {
    await this.targetPage(this.page)
    this.isFollowLoading = Array.apply(
      null,
      Array(this.allUsersData.length)
    ).map(() => false)
    this.loading = false
  },
  computed: {
    ...mapGetters({
      allUsers: 'pbl/allUsers',
      userProfile: 'user/profile'
    }),
    usersCount() {
      return _.get(this.allUsers, 'total', 0)
    },
    allUsersData() {
      let hits = _.get(this.allUsers, 'hits', [])
      return hits
    },
    userId() {
      return _.get(this.userProfile, 'id', '')
    },
    isFollow() {
      return (user, index) => {
        return this.userAllFollows.map(item => item.objectId).includes(user.id)
      }
    }
  },
  methods: {
    ...mapActions({
      getAllUsers: 'pbl/getAllUsers',
      getUserFavorite: 'pbl/getUserFavorite'
    }),
    showMessage({ type = 'success', message = '操作成功' }) {
      this.$message({ type, message })
    },
    async targetPage(targetPage) {
      this.currentPage = targetPage
      this.loading = true
      this.$nextTick(async () => {
        await this.getAllUsers({
          page: targetPage,
          per_page: this.perPage,
          q: this.searchKey,
          sort: this.sortUsers
        })
        this.loading = false
        this.getFollows()
      })
    },
    async getFollows() {
      let searchUserIsMyFavorite = []
      _.map(this.allUsersData, i => {
        searchUserIsMyFavorite.push(i.id)
      })
      await keepwork.favorites
        .getUserSearchAllFavorites({
          userId: this.userId,
          objectType: 0,
          objectId: {
            $in: searchUserIsMyFavorite
          }
        })
        .then(res => {
          this.userAllFollows = _.get(res, 'rows', [])
        })
    },
    async toggleFollow(user, index) {
      this.isFollowLoading[index] = true
      if (!this.isFollow(user,index)) {
        await keepwork.favorites
          .favoriteProject({ objectId: user.id, objectType: 0 })
          .then(res => {
            this.showMessage({
              message: '关注成功'
            })
            this.targetPage(this.currentPage)
            this.getFollows()
            this.isFollowLoading[index] = false
          })
          .catch(err => {
            this.showMessage({
              message: '关注失败'
            })
            this.isFollowLoading[index] = false
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
            this.isFollowLoading[index] = false
          })
          .catch(err => {
            this.showMessage({
              message: '取消关注失败'
            })
            this.isFollowLoading[index] = false
          })
      }
    },
    goUserHomePage(){
      alert('程序员小姐姐努力开发中')
    }
  }
}
</script>
<style lang="scss">
.user-tab {
  .el-row {
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
  }
}
</style>



<template>
  <div class="user-field" v-loading="loading">
    <el-row>
      <el-col :sm="12" :md="6" :xs="12" v-for="(user) in allUsersData" :key="user.id">
        <user-cell :user="user"></user-cell>
      </el-col>
    </el-row>
    <div class="user-field-pages" v-if="usersCount > perPage">
      <el-pagination background @current-change="targetPage" layout="prev, pager, next" :page-size="perPage" :total="usersCount">
      </el-pagination>
    </div>
    <transition name="fade">
      <div v-if="nothing" class="user-field-nothing">
        <img class="user-field-nothing-img" src="@/assets/pblImg/no_result.png" alt="">
        <p class="user-field-nothing-tip">{{$t('explore.noResults')}}</p>
      </div>
    </transition>
  </div>
</template>
<script>
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'
import default_portrait from '@/assets/img/default_portrait.png'
import { keepwork, EsAPI } from '@/api'
import UserCell from './UserCell'
import TabMixin from './TabMixin'

export default {
  name: 'UsersField',
  props: {
    searchKey: String,
    sortUsers: String
  },
  data() {
    return {
      loading: true,
      default_portrait,
      userAllFollows: [],
      currentPage: 1
    }
  },
  mixins: [TabMixin],
  async mounted() {
    await this.targetPage(this.page)
  },
  components: {
    UserCell
  },
  computed: {
    ...mapGetters({
      allUsers: 'pbl/allUsers',
      userProfile: 'user/profile'
    }),
    nothing() {
      return this.allUsersData.length === 0 && !this.loading
    },
    usersCount() {
      return _.get(this.allUsers, 'total', 0)
    },
    allUsersData() {
      let hits = _.get(this.allUsers, 'hits', [])
      let users = _.map(hits, user => {
        return {
          ...user,
          isFollowed: this.userAllFollows
            .map(item => item.objectId)
            .includes(user.id)
        }
      })
      return users
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
      getUserFavorite: 'pbl/getUserFavorite',
      toggleLoginDialog: 'pbl/toggleLoginDialog'
    }),
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
        this.$emit('getAmount', this.usersCount)
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
    }
  }
}
</script>
<style lang="scss" scoped>
.user-field {
  .fade-enter-active {
    transition: opacity 2s;
  }
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
  &-pages {
    margin-top: 40px;
    text-align: center;
  }
  &-nothing {
    min-height: 500px;
    text-align: center;
    &-img {
      margin: 128px 0 32px;
    }
    &-tip {
      color: #606266;
      font-size: 14px;
    }
  }
}
</style>



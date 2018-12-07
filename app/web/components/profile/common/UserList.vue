<template>
  <div class="user-list">
    <user-item v-if="!isEmpty" class="user-list-item" v-for="(user, index) in userList" :key="index" :user="user"></user-item>
    <div v-if="isEmpty" class="user-list-empty">
      <img :src="emptyImg" alt="">
      <div class="user-list-empty-info">{{emptyInfo}}</div>
    </div>
  </div>
</template>
<script>
import UserItem from './UserItem'
import { mapActions, mapGetters } from 'vuex';
export default {
  name: 'UserList',
  props: {
    listType: {
      validator: function (value) {
        return ['favorite', 'follow'].indexOf(value) !== -1
      }
    },
    nowProfileUserId: {
      type: Number,
      required: true
    }
  },
  mounted() {
    this.initFavoriteData()
  },
  computed: {
    ...mapGetters({
      favoriteUsers: 'profile/favoriteUsers',
      followUsers: 'profile/followUsers'
    }),
    nowProfileFavoriteUsers() {
      return this.favoriteUsers({ userId: this.nowProfileUserId })
    },
    nowProfileFollowUsers() {
      return this.followUsers({ userId: this.nowProfileUserId })
    },
    isFavoriteType() {
      return this.listType === 'favorite'
    },
    isFollowType() {
      return this.listType === 'follow'
    },
    userList() {
      if (this.isFavoriteType) {
        return this.nowProfileFavoriteUsers
      } else {
        return this.nowProfileFollowUsers
      }
    },
    isEmpty() {
      return !Boolean(this.userList.length)
    },
    emptyImg() {
      return this.isFavoriteType ? require('@/assets/img/default_followers.png') : require('@/assets/img/default_fans.png')
    },
    emptyInfo() {
      return this.isFavoriteType ? '还未关注任何人' : '还没有粉丝~'
    }
  },
  methods: {
    ...mapActions({
      profileGetFavoriteUsers: 'profile/getFavoriteUsers',
      profileGetFollowUsers: 'profile/getFollowUsers'
    }),
    async initFavoriteData() {
      let userId = this.nowProfileUserId
      if (this.isFavoriteType) {
        await this.profileGetFavoriteUsers({ userId })
      } else {
        await this.profileGetFollowUsers({ userId })
      }
    }
  },
  components: {
    UserItem
  }
}
</script>
<style lang="scss">
.user-list {
  &-item {
    border-bottom: 1px solid #e8e8e8;
    &:last-child {
      border-bottom: none;
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

<template>
  <div class="user-list">
    <user-item class="user-list-item" v-for="(user, index) in userList" :key="index" :user="user" :isGetRankDetailAfterFavorite='isGetRankDetailAfterFavorite'></user-item>
  </div>
</template>
<script>
import UserItem from './UserItem'
export default {
  name: 'UserList',
  props: {
    userList: {
      type: Array,
      default: []
    },
    isGetRankDetailAfterFavorite: {
      type: Boolean,
      default: false
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
}
</style>

<template>
  <div class="account-tab">
    <img
      class="account-tab-avatar"
      :src="avatar"
      alt="avatar"
    >
    <div class="account-tab-username">{{ username }}</div>
    <el-button class="account-tab-button selected">我的账户</el-button>
    <el-button class="account-tab-button">交易明细</el-button>
    <el-button class="account-tab-button">优惠卷</el-button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'AccountTab',
  computed: {
    ...mapGetters({
      userProfile: 'user/profile'
    }),
    avatar() {
      return this.userProfile.portrait || require('@/assets/img/default_portrait.png')
    },
    username() {
      return this.userProfile.username
    }
  }
}
</script>

<style lang="scss">
.account-tab {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #fff;
  &-avatar {
    width: 96px;
    height: 96px;
    object-fit: cover;
    border-radius: 50%;
    margin-top: 27px;
  }
  &-username {
    color: #333333;
    font-size: 16px;
    margin-top: 23px;
    margin-bottom: 13px;
  }
  &-button {
    margin-top: 20px;
    width: 100%;
    max-width: 220px;
    height: 38px;
    margin-left: 0 !important;
    &.selected {
      background: #2397f3;
      color: #fff;
      border: none;
    }
    &:last-child {
      margin-bottom: 77px;
    }
  }
}
</style>


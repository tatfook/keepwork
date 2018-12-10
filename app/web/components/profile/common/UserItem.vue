<template>
  <div class="user-item">
    <div class="user-item-portrait">
      <img :src="user.portrait || defaultPortrait" alt="">
    </div>
    <div class="user-item-info">
      <router-link class="user-item-info-name" :to="{name: 'ProfileIndexPage', params: {username: user.username}}" target="_blank">{{user.nickname || user.username}}</router-link>
      <div class="user-item-info-desc">{{user.description}}</div>
    </div>
    <div class="user-item-operate">
      <el-button :type="user.isFollowed | buttonTypeFilter" plain>{{user.isFollowed ? '取消关注':'关注'}}</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'UserItem',
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      defaultPortrait: require('@/assets/img/default_portrait.png')
    }
  },
  filters: {
    buttonTypeFilter(isFollowed) {
      return isFollowed ? 'text' : 'primary'
    }
  }
}
</script>
<style lang="scss">
.user-item {
  padding: 14px 48px 14px 24px;
  display: flex;
  align-items: center;
  &-portrait {
    margin-right: 16px;
    font-size: 0;
    img {
      display: inline-block;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      object-fit: cover;
    }
  }
  &-info {
    flex: 1;
    margin-right: 16px;
    &-name {
      font-size: 14px;
      color: #303133;
      text-decoration: none;
      &:hover {
        color: #2397f3;
      }
    }
    &-desc {
      font-size: 12px;
      color: #909399;
    }
  }
  &-operate {
    .el-button {
      font-size: 12px;
    }
    .el-button--primary {
      padding: 5px 14px;
      background-color: transparent;
      color: #2397f3;
      border-color: #2397f3;
    }
    .el-button--text {
      color: #909399;
      &:hover,
      &:focus {
        color: #2397f3;
        border-color: transparent;
      }
    }
  }
}
</style>

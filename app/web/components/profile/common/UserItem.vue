<template>
  <div class="user-item">
    <div class="user-item-portrait">
      <img :src="user.portrait || defaultPortrait" alt="">
    </div>
    <div class="user-item-info">
      <router-link class="user-item-info-name" :to="{name: 'ProfileIndexPage', params: {username: user.username}}" target="_blank">{{user.nickname}}</router-link>
      <div class="user-item-info-desc">{{user.description}}</div>
    </div>
    <div class="user-item-operate">
      <el-button type="primary" plain>关注</el-button>
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
      background-color: transparent;
      color: #2397f3;
      border-color: #2397f3;
      font-size: 12px;
      padding: 5px 14px;
    }
  }
}
</style>

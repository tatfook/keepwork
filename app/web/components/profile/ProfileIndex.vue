<template>
  <div class="profile-index">
    <div class="container">
      <div class="profile-index-sidebar">
        <user-basic-msg class="profile-index-sidebar-item" :nowUserDetail='nowUserDetail'></user-basic-msg>
      </div>
      <div class="profile-index-main"></div>
    </div>
  </div>
</template>
<script>
import UserBasicMsg from './common/UserBasicMsg'
export default {
  name: 'ProfileIndex',
  props: {
    nowUserDetail: {
      type: Object,
      required: true
    }
  },
  components: {
    UserBasicMsg
  }
}
</script>
<style lang="scss">
.profile-index {
  padding-top: 24px;
  & > .container {
    display: flex;
  }
  &-sidebar {
    width: 272px;
    margin-right: 28px;
    &-item {
      margin-bottom: 24px;
      background-color: #fff;
    }
  }
  &-main {
    flex: 1;
    min-width: 0;
  }
}
</style>

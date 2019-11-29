<template>
  <div class="teacher-message-list">
    <div class="teacher-message-list-header">
      校园OA
      <router-link class="teacher-message-list-header-link" :to="{name:'TeacherNewMessage'}">发消息</router-link>
    </div>
    <div class="teacher-message-list-main">
      <message-list-comp :roleId="2" />
    </div>
  </div>
</template>
<script>
import MessageListComp from '@/components/org/common/MessageListComp'
export default {
  name: 'TeacherMessageList',
  components: {
    MessageListComp,
  },
}
</script>
<style lang="scss" scoped>
.teacher-message-list {
  font-size: 14px;
  padding: 0 24px;
  height: 100%;
  background-color: #fff;
  &-header {
    height: 70px;
    line-height: 70px;
    font-size: 16px;
    position: relative;
    padding-right: 124px;
    border-bottom: 1px solid #d9d9d9;
    &-link {
      text-decoration: none;
      width: 90px;
      line-height: 28px;
      position: absolute;
      right: 0;
      top: 24px;
      color: #fff;
      background-color: #1385ff;
      border-radius: 4px;
      text-align: center;
      font-size: 14px;
    }
  }
}
</style>

<template>
  <div class="message-system">
    <div class="message-system-title">系统</div>
    <div class="message-system-item" v-for="item in [1,2,3,4,5,6,7,8]" :key="item">
      <img class="message-avatar" :src="systemAvatar" alt="系统头像">
      <div class="message-main">
        <span class="message-main-sender">系统</span>
        <span class="message-main-date">2019年4月16日 15:00</span>
        <div class="message-main-content">
          #NPL动画与编程大赛#开始啦！
          [截止时间]报名截至到2019年5月32日
          活动详情请戳
          #NPL动画与编程大赛#开始啦！
          [截止时间]报名截至到2019年5月32日
          活动详情请戳
          #NPL动画与编程大赛#开始啦！
          [截止时间]报名截至到2019年5月32日
          活动详情请戳
          #NPL动画与编程大赛#开始啦！
          [截止时间]报名截至到2019年5月32日
          活动详情请戳
          #NPL动画与编程大赛#开始啦！
          [截止时间]报名截至到2019年5月32日
          活动详情请戳
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import systemAvatar from '@/assets/message/system-avatar.png'
import moment from 'moment'
export default {
  name: 'MessageSystem',
  data() {
    return {
      systemAvatar
    }
  }
}
</script>

<style lang="scss" scoped>
.message-system {
  background: #fff;
  &-title {
    height: 56px;
    line-height: 56px;
    font-size: 16px;
    padding-left: 25px;
    border-bottom: 1px solid #e8e8e8;
  }

  &-item {
    min-height: 88px;
    box-sizing: border-box;
    padding-left: 24px;
    display: flex;
    border-bottom: 1px solid #e8e8e8;
    .message-avatar {
      height: 56px;
      width: 56px;
      margin-top: 16px;
      display: inline-block;
      border-radius: 50%;
    }
    .message-main {
      flex: 1;
      padding: 20px 26px;
      &-sender {
        font-size: 14px;
        color: #303133;
        margin-right: 15px;
      }
      &-date {
        font-size: 12px;
        color: #c0c4cc;
      }
      &-content {
        margin-top: 14px;
        color: #606266;
        font-size: 14px;
        line-height: 1.8;
      }
    }
  }
}
</style>


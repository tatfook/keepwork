<template>
  <div class="message-container">
    <div class="message-tab-left">
      <div class="message-tab">
        <div class="message-tab-item is-title">{{$t('message.messageCenter')}}</div>
        <div class="message-tab-item is-active">{{$t('message.system')}}</div>
      </div>
    </div>
    <div class="message-main-content">
      <router-view></router-view>
    </div>
  </div>
</template>

 
<script>
export default {
  name: 'MessageContainer'
}
</script>

<style lang="scss" scoped>
.message-container {
  display: flex;
  padding-top: 24px;
  max-width: 1200px;
  margin: 0 auto;
  .message-tab-left {
    width: 271px;
    .message-tab {
      background: #fff;
      &-item {
        height: 48px;
        line-height: 48px;
        padding: 0 18px;
        font-size: 14px;
        border-bottom: 1px solid #e8e8e8;
        cursor: pointer;
        &.is-title {
          cursor: default;
        }
        &.is-active {
          color: #2497f3;
          position: relative;
          &::before {
            content: '';
            display: inline-block;
            height: 50%;
            width: 2px;
            background: #2497f3;
            position: absolute;
            left: 0;
            top: 25%;
          }
        }
      }
    }
  }
  .message-main-content {
    flex: 1;
    margin-left: 29px;
    margin-bottom: 24px;
  }
}
</style>

<template>
  <div class="message-list-comp" v-loading="isLoading">
    <div class="message-list-comp-header">共发送{{sendedMessages.length}}条消息</div>
    <div class="message-list-comp-container">
      <div class="message-list-comp-item" v-for="(message, index) in sendedMessages" :key="index">
        <div class="message-list-comp-item-header">
          <div class="message-list-comp-time">{{message.createdAt|formatTime}}</div>
          <div class="message-list-comp-receiver" :title="message.sendTo">{{message.sendTo}}</div>
          <div class="message-list-comp-checkbox" v-if="message.sendSms>0">
            <el-checkbox :value="true" disabled>短信提醒家长</el-checkbox>
          </div>
        </div>
        <div class="message-list-comp-item-content">{{message.msg.text}}</div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
export default {
  name: 'MessageListComp',
  async mounted() {
    this.isLoading = true
    try {
      await this.getSendedMessage({
        roleId: 64,
      })
    } catch (error) {}
    this.isLoading = false
  },
  data() {
    return {
      isLoading: false,
    }
  },
  computed: {
    ...mapGetters({
      sendedMessages: 'org/getSendedMessages',
    }),
  },
  methods: {
    ...mapActions({
      getSendedMessage: 'org/getSendedMessage',
    }),
  },
  filters: {
    formatTime(time) {
      return moment(time).format('YYYY/MM/DD HH:mm')
    },
  },
}
</script>
<style lang="scss" scoped>
.message-list-comp {
  font-size: 14px;
  color: #303133;
  padding-bottom: 16px;
  &-header {
    padding: 16px 0;
    color: #8c8c8c;
  }
  &-item {
    margin-bottom: 8px;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    padding: 20px 8px;
    &-header {
      display: flex;
      align-items: flex-end;
    }
    &-content {
      margin-top: 16px;
    }
  }
  &-time {
    font-size: 12px;
    color: #c0c4cc;
  }
  &-receiver {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    padding: 0 24px;
  }
}
</style>

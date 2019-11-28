<template>
  <div class="message-list-comp" v-loading="isLoading">
    <div class="message-list-comp-header">共发送<span class="message-list-comp-header-count">{{sendedMessagesCount}}</span>条消息</div>
    <div class="message-list-comp-container">
      <div class="message-list-comp-item" v-for="(message, index) in sendedMessagesList" :key="index">
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
    <div class="message-list-comp-pagination" v-if="sendedMessagesCount>10">
      <el-pagination background :page-sizes="[10,20,40,60,80,100,200,300]" @current-change="changePage" @size-change="handleSizeChange" :current-page="nowPage" :page-size="perPage" layout="total,sizes,prev,pager,next,jumper" :total="sendedMessagesCount">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
export default {
  name: 'MessageListComp',
  props: {
    roleId: {
      type: Number,
      required: true,
    },
  },
  mounted() {
    this.toGetSendedMessage()
  },
  data() {
    return {
      isLoading: false,
      nowPage: 1,
      perPage: 10,
    }
  },
  computed: {
    ...mapGetters({
      sendedMessages: 'org/getSendedMessages',
    }),
    sendedMessagesCount() {
      return this.sendedMessages.count
    },
    sendedMessagesList() {
      return this.sendedMessages.rows
    },
  },
  methods: {
    ...mapActions({
      getSendedMessage: 'org/getSendedMessage',
    }),
    async toGetSendedMessage() {
      this.isLoading = true
      try {
        await this.getSendedMessage({
          roleId: this.roleId,
          'x-per-page': this.perPage,
          'x-page': this.nowPage,
          'x-order': 'createdAt-desc',
        })
      } catch (error) {}
      this.isLoading = false
    },
    changePage(page) {
      this.nowPage = page
      this.toGetSendedMessage()
    },
    handleSizeChange(size) {
      this.perPage = size
      this.toGetSendedMessage()
    },
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
    &-count {
      color: #1385ff;
      font-weight: bold;
    }
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
    /deep/ .el-checkbox__input.is-disabled + span.el-checkbox__label {
      color: #8c8c8c;
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
  &-pagination {
    text-align: center;
    padding: 40px 0;
  }
}
</style>

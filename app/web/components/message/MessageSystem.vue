<template>
  <div class="message-system">
    <div class="message-system-title">系统</div>
    <div class="message-system-item" v-for="item in systemMessages" :key="item.id">
      <img class="message-avatar" :src="systemAvatar" alt="系统头像">
      <div class="message-main">
        <span class="message-main-sender">系统</span>
        <span class="message-main-date">{{item.createdAt | formatDate}}</span>
        <div class="message-main-content" v-html="item.messages.msg.text">
        </div>
      </div>
    </div>
    <div class="message-pagination">
      <el-pagination :hide-on-single-page="hideOnSinglePage" :page-size="10" :total="5" layout="prev, pager, next">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import systemAvatar from '@/assets/message/system-avatar.png'
import moment from 'moment'
import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'
export default {
  name: 'MessageSystem',
  data() {
    return {
      systemAvatar,
      hideOnSinglePage: false
    }
  },
  filters: {
    formatDate(date) {
      return date ? moment(date).format('YYYY-M-DD H:mm') : ''
    }
  },
  async mounted() {
    await this.getMessages()
    if (this.currentPageUnreadMessageIDs) {
      await this.signMessages(this.currentPageUnreadMessageIDs)
    }
  },
  methods: {
    ...mapActions({
      getMessages: 'message/getMessages',
      signMessages: 'message/signMessages',
      getUnreadMessages: 'message/getUnreadMessages'
    })
  },
  computed: {
    ...mapGetters({
      messages: 'message/messages'
    }),
    systemMessages() {
      return _.filter(
        _.get(this.messages, 'rows', []),
        item => item.messages.sender === 0
      )
    },
    currentPageUnreadMessageIDs() {
      return _.map(
        _.filter(this.systemMessages, item => item.state === 0),
        msg => msg.id
      )
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
      }
    }
  }
  .message-pagination {
    display: flex;
    justify-content: flex-end;
  }
}
</style>


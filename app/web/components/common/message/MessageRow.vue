<template>
  <div class="message-row">
    <div class="message-row-item">
      <user-portrait class="message-avatar" :width="56" :user="user"></user-portrait>
      <div class="message-main">
        <span class="message-main-sender">{{senderName}}</span>
        <span class="message-main-date">{{data.createdAt | formatDate}}</span>
        <div class="message-main-content" v-html="data.messages.msg.text">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import systemAvatar from '@/assets/message/system-avatar.png'
import UserPortrait from '@/components/common/UserPortrait'
import scrollIntoView from 'scroll-into-view-if-needed'
import moment from 'moment'
import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'
export default {
  name: 'MessageRow',
  components: {
    UserPortrait,
  },
  props: {
    data: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  data() {
    return {
      systemAvatar,
    }
  },
  filters: {
    formatDate(date) {
      return date ? moment(date).format('YYYY-M-DD H:mm') : ''
    },
  },
  computed: {
    senderName() {
      return this.isSystemMessage ? this.$t('message.system') : _.get(this.data, 'messages.senderName')
    },
    senderPortrait() {
      return this.isSystemMessage ? this.systemAvatar : _.get(this.data, 'messages.senderPortrait')
    },
    user() {
      const { vip = 0, tLevel = 0 } = this.data.messages
      return {
        portrait: this.senderPortrait,
        vip,
        tLevel,
      }
    },
    isSystemMessage() {
      const msgType = _.get(this.data, 'messages.msg.type', '')
      return msgType === 0
    },
  },
}
</script>

<style lang="scss" scoped>
.message-row {
  background: #fff;

  &-item {
    min-height: 88px;
    box-sizing: border-box;
    padding-left: 24px;
    display: flex;
    border-bottom: 1px solid #e8e8e8;
    word-break: break-all;
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
        /deep/ a {
          color: #409eff;
        }
      }
    }
  }
}
</style>


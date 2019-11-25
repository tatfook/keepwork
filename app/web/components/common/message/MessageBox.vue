<template>
  <el-popover popper-class="user-message-popper" placement="bottom" width="320" @show="initScroll" trigger='hover'>
    <div ref="scroll" class="user-message-main">
      <div :class="['user-message-row', { 'is-read': item.status === 1 }]" v-for="item in allMessages" :key="item.id" @click="toMessageDetail(item)">
        <span :class="['message-pointer', { 'is-read': item.status === 1 }]"></span>
        <span class="message-title">[{{formatName(item)}}]</span>
        <span class="message-content">
          {{item.content}}
        </span>
        <span class="message-date">{{item.createdAt | formatDate}}</span>
      </div>
    </div>
    <div class="user-message-button" @click="toMessageCenter">{{$t('message.openMessageCenter')}}</div>
    <div slot="reference" class="user-message-icon-container">
      <el-badge :value="unreadMessagesCount" :hidden="unreadMessagesCount === 0" :max="99" class="user-message-badge">
        <i class="iconfont icon-message-fill user-message-icon"></i><span class="hidden-xs-only">{{$t('message.message')}}</span>
      </el-badge>
    </div>
  </el-popover>
</template>


<script>
import { mapActions, mapGetters } from 'vuex'
import { keepwork } from '@/api'
import moment from 'moment'
export default {
  name: 'MessageBox',
  props: {
    perPage: {
      type: Number,
      default: 10
    }
  },
  filters: {
    formatDate(date) {
      const _date = moment(date)
      return _date.isSame(moment(), 'day')
        ? _date.format('H:mm')
        : _date.format('MM/DD')
    }
  },
  data() {
    return {
      loadingMore: false,
      isBindEvent: false
    }
  },
  async created() {
    this.initMessageBox()
  },
  computed: {
    ...mapGetters({
      unreadMessagesCount: 'message/unreadMessagesCount',
      messagesBox: 'message/messagesBox',
      userIsLogined: 'user/isLogined'
    }),
    allMessages() {
      return _.map(_.get(this.messagesBox, 'rows', []), item => {
        const html = _.get(item, 'messages.msg.text', '')
        const content = html
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&quot;/g, '"')
          .replace(/&apos;/g, "'")
          .replace(/&amp;/g, '&')
          .replace(/&nbsp;/g, '')
          .replace(/<\/?.+?\/?>/g, '')
          .replace(/<[^>]+>/g, '')
        return { ...item, content }
      })
    },
    messagesCount() {
      return _.get(this.messagesBox, 'count', 0)
    },
    msgScroll() {
      return this.$refs.scroll
    }
  },
  methods: {
    ...mapActions({
      loadMessages: 'message/loadMessages'
    }),
    formatName(data) {
      return _.get(data, 'messages.lessonOrganizations.name', '系统消息')
    },
    async initMessageBox() {
      if (this.userIsLogined) {
        const params = { 'x-page': 1, 'x-per-page': this.perPage }
        await this.$nextTick()
        await this.loadMessages(params)
      }
    },
    throttleScroll: _.throttle(function() {
      const {
        scrollHeight,
        scrollTop,
        offsetHeight,
        clientHeight
      } = this.msgScroll
      const height = clientHeight || offsetHeight
      if (!this.loadingMore && height + scrollTop + 10 >= scrollHeight) {
        this.loadMoreMessages()
      }
    }, 300),
    async initScroll() {
      if (!this.isBindEvent) {
        await this.$nextTick()
        const msgScrollHeight = this.msgScroll.scrollHeight
        this.msgScroll.addEventListener('scroll', this.throttleScroll)
        this.isBindEvent = true
      }
    },
    async loadMoreMessages() {
      if (this.allMessages.length < this.messagesCount) {
        this.loadingMore = true
        await this.loadMessages({
          'x-per-page': _.add(this.allMessages.length, this.perPage)
        })
        this.loadingMore = false
      }
    },
    toMessageCenter() {
      this.$emit('toMessageCenter')
    },
    async toMessageDetail(message) {
      const { id, lessonOrganizations } = message.messages
      const organizationId = lessonOrganizations.id
      const { data: msgIndex = 1 } = await keepwork.messages.getMessageIndex({
        id,
        organizationId
      })
      const page = _.ceil(_.divide(msgIndex, this.perPage))
      this.$emit('toMessageDetail', {
        organizationId,
        page,
        id
      })
    }
  }
}
</script>


<style lang="scss">
.user-message-popper {
  padding: 0px;
  .user-message-main {
    height: 250px;
    padding: 12px 0;
    overflow-y: auto;
    .user-message-row {
      display: flex;
      font-size: 14px;
      line-height: 21px;
      padding: 10px 6px;
      &.is-read {
        color: #c0c4cc;
      }
      &:hover {
        color: #2397f3;
        cursor: pointer;
        background: #ecf5ff;
      }
      .message-pointer {
        display: inline-block;
        height: 5px;
        width: 5px;
        padding: 0;
        right: 0;
        border-radius: 50%;
        background-color: #f56c6c;
        color: #fff;
        text-align: center;
        vertical-align: middle;
        white-space: nowrap;
        border: 1px solid #fff;
        margin-top: 8px;
        margin-right: 4px;
        &.is-read {
          visibility: hidden;
        }
      }
      .message-content {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-height: 20px;
        -webkit-box-orient: vertical;
        padding: 0 12px 0 6px;
      }
      .message-date {
        font-size: 12px;
      }
    }
  }
  .user-message-button {
    text-align: center;
    cursor: pointer;
    height: 45px;
    line-height: 45px;
    font-size: 13px;
    border-top: 1px solid #e8e8e8;
  }
}
.message-dropdown {
  .message {
    position: relative;
    .news {
      width: 10px;
      height: 10px;
      background: red;
      position: absolute;
      border-radius: 50%;
      top: -4px;
      right: -12px;
    }
  }
  &-list {
    .el-dropdown-menu__item {
      display: flex;
      .message-desc {
        flex: 1;
      }
      .detail-time {
        text-align: right;
        width: 38px;
        margin-left: 18px;
      }
    }
  }
}
</style>
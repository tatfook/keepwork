<template>
  <div class="org-header">
    <el-menu class="org-header-menu" mode="horizontal">
      <el-menu-item index='1' v-if="orgLogo">
        <img class="org-header-brand" :src="orgLogo" alt="KeepWork">
      </el-menu-item>
      <el-menu-item class="org-header-name" index='2'>
        {{currentOrg.name}}
      </el-menu-item>
      <el-menu-item v-if="isLogin" index='3' class="pull-right" @click="logout">
        {{$t('org.logout')}}
      </el-menu-item>
      <el-menu-item v-if="!isLogin" index='3-1' class="pull-right" @click="toLoginPage">
        登录
      </el-menu-item>
      <el-menu-item index='5' v-if="isLogin" class="pull-right user-message-menu-item right-icon-item">
        <el-popover popper-class="user-message-popper" placement="bottom" width="320" @show="initScroll" trigger='hover'>
          <div ref="scroll" class="user-message-main">
            <div :class="['user-message-row', { 'is-read': item.state === 1 }]" v-for="item in allMessages" :key="item.id" @click="toMessageDetail(item)">
              <span :class="['message-pointer', { 'is-read': item.state === 1 }]"></span>
              <span class="message-title">[{{$t('message.system')}}]</span>
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
      </el-menu-item>
      <el-menu-item index='4' class="pull-right">
        <a class="org-header-more-learn" href="/s" target="_blank">{{$t('org.moreStudy')}}</a>
      </el-menu-item>
      <el-menu-item index='6' class="pull-right">
        <el-button @click="toTeachCenter" class="teach-center-button" type="primary">教学中心</el-button>
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'
export default {
  name: 'OrgHeader',
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
      msgScroll: null,
      perPage: 10,
      loadingMore: false
    }
  },
  computed: {
    ...mapGetters({
      getToken: 'org/getToken',
      currentOrg: 'org/currentOrg',
      userIsLogined: 'user/isLogined',
      unreadMessagesCount: 'message/unreadMessagesCount',
      messagesBox: 'message/messagesBox'
    }),
    orgLogo() {
      return _.get(this.currentOrg, 'logo')
    },
    orgId() {
      return _.get(this.currentOrg, 'id')
    },
    isLogin() {
      return Boolean(this.getToken())
    },
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
    }
  },
  async created() {
    await this.initMessageBox()
  },
  methods: {
    ...mapActions({
      userLogout: 'user/logout',
      loadMessages: 'message/loadMessages',
      isAdmin: 'org/isAdmin',
      isTeacher: 'org/isTeacher'
    }),
    async logout() {
      this.$confirm(this.$t('org.logoutTips'), this.$t('org.logoutHint'), {
        confirmButtonText: this.$t('common.Sure'),
        cancelButtonText: this.$t('common.Cancel'),
        type: 'warning'
      })
        .then(() => {
          this.userLogout().catch()
        })
        .catch(err => console.error(err))
    },
    toLoginPage() {
      this.$router.push({
        name: 'OrgLogin'
      })
    },
    async initMessageBox() {
      if (this.userIsLogined) {
        const params = { 'x-page': 1, 'x-per-page': this.perPage }
        await this.$nextTick()
        await this.loadMessages(params)
      }
    },

    async initScroll() {
      this.$nextTick(() => {
        this.msgScroll = document.querySelector('.user-message-main')
        const msgScrollHeight = this.msgScroll.scrollHeight
        this.msgScroll.addEventListener('scroll', async e => {
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
        })
      })
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
      this.$router.push({ name: 'orgMessage' })
    },
    toMessageDetail(message) {
      const { messageId } = message
      this.$router.push({
        name: 'orgMessage',
        query: { orgId: this.orgId, messageId }
      })
    },
    toTeachCenter() {
      if (this.isAdmin) {
        return this.$router.push({ name: 'OrgPackages' })
      }
      if (this.isTeacher) {
        return this.$router.push({ name: 'OrgTeacher' })
      }
      this.$router.push({ name: 'OrgStudent' })
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
        // height: 40px;
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
.org-header {
  border-bottom: solid 1px #e6e6e6;
  background-color: #fff;
  .user-message-icon-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 48px;
    line-height: 48px;
    .user-message-badge {
      line-height: 22px;
      .el-badge__content {
        height: 16px;
        line-height: 16px;
        padding: 0 4px;
        font-size: 12px;
      }
    }
    .user-message-icon {
      font-size: 30px;
    }
  }
  &-name {
    font-weight: bold;
  }
  &-menu {
    padding: 12px 0;
    max-width: 1200px;
    margin: 0 auto;
    &.el-menu--horizontal {
      border-bottom: none;
    }
    & > .el-menu-item {
      height: 48px;
      line-height: 48px;
      font-size: 18px;
      color: #333;
      &.pull-right {
        float: right;
        font-size: 14px;
      }
      & a {
        text-decoration: none;
        color: #409efe;
        &:hover {
          color: #409efe;
        }
      }
    }
  }
  &-brand {
    height: 48px;
    width: 150px;
    object-fit: contain;
  }
  /deep/ .el-menu-item.is-active {
    color: #909399;
    border-bottom: none;
    border-bottom-color: #fff;
    &:hover {
      color: #909399;
    }
  }
  /deep/ .teach-center-button {
    padding: 5px 30px;
    background: #1385ff;
  }
}
</style>
<style lang="scss" scoped>
@media print {
  .org-header {
    & .pull-right {
      display: none;
    }
  }
}
</style>

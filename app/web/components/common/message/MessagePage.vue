<template>
  <div class="message-container" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.8)">
    <div class="message-tab-left">
      <div class="message-tab">
        <div class="message-tab-item is-title">{{$t('message.messageCenter')}}</div>
        <div :class="['message-tab-item can-click', { 'is-active': selectedMessageTabID === org.organizationId }]" @click="switchMessageTab(org.organizationId)" v-for="org in sortedUnreadList" :key="org.organizationId">
          <el-badge :hidden="org.unReadCount === 0" :value="org.unReadCount" :max="99" class="message-tab-item-badge">
            {{org.organizationName}}
          </el-badge>
        </div>
      </div>
    </div>
    <div class="message-main">
      <div class="message-main-title">{{currentTabName}}</div>
      <message-row v-for="item in currentTabMessages" :data="item" :id="`msg-${item.messages.id}`" :key="item.id"></message-row>
      <div class="message-pagination" v-if="isShowPagination">
        <el-pagination background :current-page.sync="currentPage" @current-change="switchPage" :hide-on-single-page="true" :page-size="perPage" :total="messagesCount" layout="prev, pager, next">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

 
<script>
import MessageRow from './MessageRow'
import systemAvatar from '@/assets/message/system-avatar.png'
import scrollIntoView from 'scroll-into-view-if-needed'
import moment from 'moment'
import { mapActions, mapGetters } from 'vuex'
import { keepwork } from '@/api'
import _ from 'lodash'
export default {
  name: 'MessagePage',
  components: {
    MessageRow,
  },
  data() {
    return {
      systemAvatar,
      perPage: 10,
      currentPage: 1,
      myOrgList: [],
      selectedMessageTabID: 0,
      loading: false,
      isFirstFetch: true,
    }
  },
  watch: {
    $route: {
      immediate: true,
      async handler(route) {
        try {
          this.loading = true
          if (this.isFirstFetch) {
            await this.getUnreadList()
            this.isFirstFetch = false
          }
          const { organizationId = 0, id = 0, page = 1 } = route.query
          this.selectedMessageTabID = _.toNumber(organizationId)
          this.currentPage = _.toNumber(page)
          const params = {
            'x-page': page,
            'x-per-page': this.perPage,
            organizationId,
          }
          await this.getMessages(params)
          await this.signCurrentPageMessages()
          this.blingTheMessage(id)
        } catch (error) {
          console.error(error)
        } finally {
          this.loading = false
        }
      },
    },
  },
  computed: {
    ...mapGetters({
      messages: 'message/messages',
      unreadList: 'message/unreadList',
    }),
    sortedUnreadList() {
      return _.sortBy(this.unreadList, item => item.organizationId)
    },
    currentTabMessages() {
      return _.get(this.messages, 'rows', [])
    },
    messagesCount() {
      return _.get(this.messages, 'count', 0)
    },
    isShowPagination() {
      return this.messagesCount > this.perPage
    },
    currentPageUnreadMessageIDs() {
      return _.map(_.filter(this.currentTabMessages, item => item.status === 0), msg => msg.id)
    },
    currentTabName() {
      const org = _.find(this.unreadList, item => item.organizationId === this.selectedMessageTabID)
      return _.get(org, 'organizationName', '')
    },
  },
  methods: {
    ...mapActions({
      getMessages: 'message/getMessages',
      signMessages: 'message/signMessages',
      getUnreadMessages: 'message/getUnreadMessages',
      getUnreadList: 'message/getUnreadList',
    }),
    async signCurrentPageMessages() {
      if (this.currentPageUnreadMessageIDs.length) {
        await this.signMessages(this.currentPageUnreadMessageIDs)
        await this.getUnreadList()
      }
    },
    async switchMessageTab(id) {
      this.selectedMessageTabID = id
      this.$router.push({
        query: {
          organizationId: id,
          page: 1,
        },
      })
    },
    async scrollEle() {
      const messageTitleEle = document.querySelector('.message-main-title')
      if (messageTitleEle) {
        scrollIntoView(messageTitleEle, {
          scrollMode: 'if-needed',
          behavior: 'smooth',
        })
      }
    },
    async switchPage(page) {
      this.currentPage = page
      const { id, ...query } = this.$route.query
      this.$router.push({
        query: { ...query, page },
      })
      this.$nextTick(() => this.scrollEle())
    },
    blingTheMessage(id) {
      this.$nextTick(() => {
        const messageEle = document.querySelector(`#msg-${id}`)
        if (messageEle) {
          scrollIntoView(messageEle, {
            scrollMode: 'if-needed',
            behavior: 'smooth',
          })
          messageEle.classList.add('bling')
        }
      })
    },
  },
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
        &.can-click {
          color: #999;
          &:hover {
            background: rgba(35, 151, 243, 0.05);
          }
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
        &-badge {
          /deep/ .el-badge__content.is-fixed {
            top: 18px;
            right: 0;
          }
        }
      }
    }
  }
  .message-main {
    flex: 1;
    margin-left: 29px;
    margin-bottom: 24px;
    &-title {
      background: #fff;
      height: 56px;
      line-height: 56px;
      font-size: 16px;
      padding-left: 25px;
      border-bottom: 1px solid #e8e8e8;
    }
    .message-pagination {
      display: flex;
      justify-content: flex-end;
      padding: 10px 0;
      background: #f5f5f5;
    }
    .bling {
      animation: flash 1.2s linear 3;
    }
    @keyframes flash {
      from {
        color: #409eff;
        background: #ecf5ff;
      }
      to {
      }
    }
  }
}
</style>

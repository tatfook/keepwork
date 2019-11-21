<template>
  <div class="message-container" v-loading="loading" element-loading-text="拼命加载中" element-loading-spinner="el-icon-loading" element-loading-background="rgba(255, 255, 255, 0.8)">
    <div class="message-tab-left">
      <div class="message-tab">
        <div class="message-tab-item is-title">{{$t('message.messageCenter')}}</div>
        <div :class="['message-tab-item', { 'is-active': selectedMessageTabID === 0 }]" @click="switchMessageTab(0)">{{$t('message.system')}}</div>
        <div :class="['message-tab-item', { 'is-active': selectedMessageTabID === org.id }]" @click="switchMessageTab(org.id)" v-for="org in myOrgList" :key="org.id">{{org.name}}</div>
      </div>
    </div>
    <div class="message-main">
      <div class="message-main-title">{{currentTabName}}</div>
      <message-row v-for="item in currentTabMessages" :data="item" :id="`msg-${item.messageId}`" :key="item.id"></message-row>
      <div class="message-pagination" v-if="isShowPagination">
        <el-pagination background :current-page.sync="currentPage" @current-change="getCurrentPageMessages" :hide-on-single-page="true" :page-size="perPage" :total="messagesCount" layout="prev, pager, next">
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
    MessageRow
  },
  data() {
    return {
      systemAvatar,
      perPage: 10,
      currentPage: 1,
      myOrgList: [],
      selectedMessageTabID: 0,
      loading: false
    }
  },
  async created() {
    await this.getMyOrgList()
    const { messageId = 0, page = 0, orgId = 0 } = this.$route.query
    if (page) {
      this.currentPage = _.toNumber(page)
    }
    this.selectedMessageTabID = orgId
    const params = { 'x-page': this.currentPage, 'x-per-page': this.perPage }
    await this.getMessages(params)
    // if (this.currentPageUnreadMessageIDs.length) {
    //   await this.signMessages(this.currentPageUnreadMessageIDs)
    //   this.getMessages(params)
    // }
    if (messageId) {
      this.blingTheMessage(messageId)
    }
  },
  watch: {
    async selectedMessageTabID(id) {
      console.log(id)
    }
  },
  computed: {
    ...mapGetters({
      messages: 'message/messages'
    }),
    currentTabMessages() {
      return _.filter(
        _.get(this.messages, 'rows', []),
        item => item.messages.sender === 0
      )
    },
    messagesCount() {
      return _.get(this.messages, 'count', 0)
    },
    isShowPagination() {
      return this.messagesCount > this.perPage
    },
    currentPageUnreadMessageIDs() {
      return _.map(
        _.filter(this.currentTabMessages, item => item.state === 0),
        msg => msg.id
      )
    },
    currentTabName() {
      if (this.selectedMessageTabID) {
        const org = _.find(
          this.myOrgList,
          item => item.id === this.selectedMessageTabID
        )
        return _.get(org, 'name', '')
      }
      return '系统消息'
    }
  },
  methods: {
    ...mapActions({
      getMessages: 'message/getMessages',
      signMessages: 'message/signMessages',
      getUnreadMessages: 'message/getUnreadMessages'
    }),
    switchMessageTab(id) {
      this.selectedMessageTabID = id
      this.$router.push({
        query: {
          tabID: id
        }
      })
    },
    async getMyOrgList() {
      this.myOrgList = await keepwork.lessonOrganizations.getUserOrganizations()
    },
    async getCurrentPageMessages(pageIndex) {
      try {
        this.loading = true
        const params = {
          'x-page': pageIndex,
          'x-per-page': this.perPage
        }
        await this.getMessages(params)
        if (this.currentPageUnreadMessageIDs.length) {
          await this.signMessages(this.currentPageUnreadMessageIDs)
        }
        this.loading = false
        this.$router.push({ query: { page: pageIndex } })
        this.$nextTick(() => {
          const messageTitleEle = document.querySelector('.message-main-title')
          if (messageTitleEle) {
            scrollIntoView(messageTitleEle, {
              scrollMode: 'if-needed',
              behavior: 'smooth'
            })
          }
        })
      } catch (error) {
        console.error(error)
      } finally {
        this.loading = false
      }
    },
    blingTheMessage(id) {
      this.$nextTick(() => {
        const messageEle = document.querySelector(`#msg-${id}`)
        if (messageEle) {
          scrollIntoView(messageEle, {
            scrollMode: 'if-needed',
            behavior: 'smooth'
          })
          messageEle.classList.add('bling')
        }
      })
    }
  }
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
      animation: flash 2s linear 1;
    }
    @keyframes flash {
      from {
        color: #2397f3;
        background: #ecf5ff;
      }

      to {
      }
    }
  }
}
</style>

<template>
  <el-scrollbar class="history-list" :native="false">
    <div class="history-list-header">
      <div class="history-list-header-version">{{$t("editor.versionLabel")}}</div>
      <div class="history-list-header-username">{{$t("editor.operatorLabel")}}</div>
      <div class="history-list-header-date">{{$t("editor.updateAtLabel")}}</div>
    </div>
    <div class="history-list-item" :class="{'history-list-item-active': activeVersion == history.version, 'disabled': getIsHistoryDisabled(history)}" v-for="(history, index) in historyList" :key="index" @click="getHistoryContent(history)" :title='getHoverMessage(history)'>
      <div class="history-list-item-version">{{history.version}}
        <span class="history-list-item-version-sub">{{history.message | sourceVersionFilter}}</span>
      </div>
      <div class="history-list-item-username" :title="history.committer.name | oldNameFilter">{{history.committer.name | oldNameFilter}}</div>
      <div class="history-list-item-date">{{history.date | formatTime }}</div>
    </div>
    <div v-infinite-scroll="loadMore" infinite-scroll-disabled="isBusy" infinite-scroll-distance="0"></div>
  </el-scrollbar>
</template>
<script>
const SourceVersionStr = '|FROM'
import moment from 'moment'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'HistoryList',
  data() {
    return {
      initialIndex: 0,
      perPage: 10,
      historyList: [],
      isBusy: false,
      nowPage: 1,
      activeVersion: undefined
    }
  },
  computed: {
    ...mapGetters({
      activePageInfo: 'activePageInfo'
    })
  },
  methods: {
    ...mapActions({
      gitlabGetFileHistoryList: 'gitlab/getFileHistoryList'
    }),
    getIsHistoryDisabled(history) {
      return history.short_id === 'pending'
    },
    getHistoryList(page, perPage) {
      let projectPath = _.get(this.activePageInfo, 'sitepath')
      let filePath = _.get(this.activePageInfo, 'fullPath')
      this.isBusy = true
      return new Promise(async resolve => {
        let result = await this.gitlabGetFileHistoryList({
          projectPath,
          filePath,
          page,
          perPage
        }).catch()
        this.historyList = _.concat(this.historyList, result)
        if (result.total > this.historyList.length) {
          this.isBusy = false
        }
        resolve()
      })
    },
    getHistoryContent(historyParam) {
      let history = historyParam || this.historyList[this.initialIndex]
      if (this.getIsHistoryDisabled(history)) {
        !this.activeVersion && this.initialIndex++ && this.getHistoryContent()
        return
      }
      let commitId = history.commitId
      let version = history.version
      this.activeVersion = version
      this.$emit('selectHistory', { commitId, version })
    },
    async loadMore() {
      await this.getHistoryList(this.nowPage++, this.perPage)
      !this.activeVersion && this.getHistoryContent()
    },
    getHoverMessage(history) {
      if (this.getIsHistoryDisabled(history)) return '同步中'
      let commitMessage = history.message
      let index = commitMessage.indexOf(SourceVersionStr)
      if (index == -1) {
        return
      } else {
        let sourceVersion = commitMessage.substring(
          index + SourceVersionStr.length
        )
        let nowVersion = history.version
        return this.$t('editor.versionRecoverFrom', {
          nowVersion,
          sourceVersion
        })
      }
    }
  },
  filters: {
    formatTime(time) {
      return moment(time).format('YYYY/MM/DD HH:mm')
    },
    sourceVersionFilter(commitMessage) {
      if (!commitMessage) return ''
      let index = commitMessage.indexOf(SourceVersionStr)
      return index != -1
        ? '(' + commitMessage.substring(index + SourceVersionStr.length) + ')'
        : ''
    },
    oldNameFilter(name) {
      return _.replace(name, /^(gitlab_rls_|gitlab_www_|gitlab_test_)/, '')
    }
  }
}
</script>
<style lang="scss">
.history-list {
  padding: 16px 0;
  height: 100%;
  &-header {
    display: flex;
    padding: 8px 20px 16px;
    font-size: 14px;
    &-version {
      width: 80px;
    }
    &-username {
      flex: 1;
      padding: 0 8px;
    }
    &-date {
      width: 112px;
      text-align: center;
    }
  }
  &-item {
    font-size: 14px;
    color: #241c17;
    display: flex;
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
    cursor: pointer;
    &:hover {
      background-color: #f3f6f9;
    }
    &-active {
      background-color: #d4e8fb;
    }
    &.disabled {
      color: #909399;
      cursor: not-allowed;
    }
    &-version {
      width: 80px;
      &-sub {
        color: #909399;
      }
    }
    &-username {
      flex: 1;
      padding: 0 8px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    &-date {
      width: 112px;
      text-align: center;
      white-space: nowrap;
    }
  }
}
</style>

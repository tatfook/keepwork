<template>
  <el-scrollbar class="history-list" :native="false">
    <div class="history-list-header">
      <div class="history-list-header-version">{{$t("editor.versionLabel")}}</div>
      <div class="history-list-header-username">{{$t("editor.operatorLabel")}}</div>
      <div class="history-list-header-date">{{$t("editor.updateAtLabel")}}</div>
    </div>
    <div class="history-list-item" :class="{'history-list-item-active': activeVersion == history.version}" v-for="(history, index) in historyList" :key="index" @click="getHistoryContent(history)" :title='getHoverMessage(history)'>
      <div class="history-list-item-version">{{history.version}}
        <span class="history-list-item-version-sub">{{history.message | sourceVersionFilter}}</span>
      </div>
      <div class="history-list-item-username" :title="history.author_name | oldNameFilter">{{history.author_name | oldNameFilter}}</div>
      <div class="history-list-item-date">{{history.authored_date | formatTime }}</div>
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
        this.historyList = _.concat(this.historyList, result.commits)
        if (result.total > this.historyList.length) {
          this.isBusy = false
        }
        resolve()
      })
    },
    getHistoryContent(history) {
      let version = history.version
      let commitId = history.short_id
      this.activeVersion = version
      this.$emit('selectHistory', { commitId, version })
    },
    async loadMore() {
      await this.getHistoryList(this.nowPage++, this.perPage)
      !this.activeVersion && this.getHistoryContent(this.historyList[0])
    },
    getHoverMessage(history) {
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

<template>
  <el-scrollbar class="history-list" :native="false">
    <div class="history-list-header">
      <div class="history-list-header-version">版本</div>
      <div class="history-list-header-username">操作人</div>
      <div class="history-list-header-date">恢复时间</div>
    </div>
    <div class="history-list-item" :class="{'history-list-item-active': selectedCommitId == history.short_id}" v-for="(history, index) in historyList" :key="index" @click="getHistoryContent(history)">
      <div class="history-list-item-version">V{{history.version}}</div>
      <div class="history-list-item-username">{{history.author_name}}</div>
      <div class="history-list-item-date">{{history.authored_date | formatTime }}</div>
    </div>
  </el-scrollbar>
</template>
<script>
import moment from 'moment'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'HistoryList',
  async mounted() {
    let projectPath = _.get(this.activePageInfo, 'sitepath')
    let result = await this.gitlabGetFileHistoryList({
      projectPath
    })
    this.historyList = result.commits
  },
  data() {
    return {
      historyList: [],
      selectedCommitId: ''
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
    getHistoryContent(history) {
      let commitId = history.short_id
      this.selectedCommitId = commitId
      this.$emit('selectHistory', commitId)
    }
  },
  filters: {
    formatTime(time) {
      return moment(time).format('YYYY/MM/DD HH:mm')
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
    &-version {
      width: 80px;
    }
    &-username {
      flex: 1;
      padding: 0 8px;
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
    }
    &-username {
      flex: 1;
      padding: 0 8px;
    }
  }
}
</style>

<template>
  <div class="file-history">
    <div class="file-history-sidebar">
      <div class="file-history-header">
        <i class="iconfont icon-historyrecord"></i>
        <span class="file-history-header-title">历史记录</span>
        <i class="iconfont icon-ziyuan1"></i>
        <i class="iconfont icon-ziyuan3" @click="closeHistory"></i>
      </div>
      <history-list @selectHistory="getFileContentByCommitId"></history-list>
    </div>
    <div class="file-history-preview">preview</div>
    <div class="file-history-raw">raw</div>
  </div>
</template>
<script>
import HistoryList from './HistoryList'
import { mapActions } from 'vuex'
export default {
  name: 'FileHistory',
  methods: {
    ...mapActions({
      toggleFileHistoryVisibility: 'toggleFileHistoryVisibility'
    }),
    closeHistory() {
      this.toggleFileHistoryVisibility({ isVisible: false })
    },
    getFileContentByCommitId(commitId) {
      console.log(commitId)
    }
  },
  components: {
    HistoryList
  }
}
</script>
<style lang="scss" scoped>
.file-history {
  display: flex;
  &-sidebar {
    width: 440px;
  }
  &-preview,
  &-raw {
    flex: 1;
    border-left: 15px solid #cdd4db;
  }
}
</style>

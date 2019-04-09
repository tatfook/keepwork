<template>
  <div class="history-list">
    <div class="history-list-item" v-for="(history, index) in historyList" :key="index" @click="getHistoryContent(history)">
      <div class="history-list-item-version">V{{history.version}}</div>
      <div class="history-list-item-username">{{history.author_name}}</div>
      <div class="history-list-item-date">{{history.authored_date | formatTime }}</div>
    </div>
  </div>
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
      historyList: []
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
      let commitId = history._id
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
  &-item {
    font-size: 16px;
    color: #241c17;
    display: flex;
    height: 40px;
    line-height: 40px;
    padding: 0 20px;
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

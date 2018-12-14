<template>
  <div class="project-boards">
    <el-card class="project-boards-card" shadow="never" v-loading='isLoading'>
      <div slot="header" class="clearfix">
        <span class="project-boards-card-label">{{$t("project.projectWhiteboard")}}</span>
        <router-link :to="{ name: 'ProjectWhiteBoard', path:moreBoardLink }" class="project-boards-card-link">{{$t("project.readMore")}}<i class="el-icon-arrow-right"></i></router-link>
      </div>
      <div class="project-boards-list" v-if="projectIssueList.length >0">
        <div class="project-boards-item" v-for="(issue, index) in projectIssueList" :key="index" @click="showIssueDetail(issue)">
          <div class="project-boards-item-icon">
            <i class="el-icon-warning" v-show="issue.state === 0"></i>
            <i class="el-icon-success" v-show="issue.state === 1"></i>
          </div>
          <span class="project-boards-item-title" :title="issue.title">{{issue.title}}</span>
          <span class="project-boards-item-time">{{isEn ? $t('common.update') : ''}} {{issue.updatedAt | relativeTimeFilter(isEn)}}{{isEn ? '' : $t('common.update')}}</span>
        </div>
      </div>
      <div class="project-boards-empty" v-else>{{$t("project.noContent")}}</div>
    </el-card>
    <issue-detail v-if="isIssueDetailDialogShow" :show='isIssueDetailDialogShow' :projectDetail='projectDetail' :issue='issueDetail' :isProhibitEdit="isProhibitEdit" @close="handleIssueDialogClose"></issue-detail>
  </div>
</template>
<script>
import IssueDetail from '@/components/pbl/IssueDetail'
import moment from 'moment'
import 'moment/locale/zh-cn'
import { locale } from '@/lib/utils/i18n'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'ProjectBoards',
  props: {
    projectId: {
      required: true
    },
    projectDetail: {
      type: Object,
      required: true
    },
    isProhibitView: {
      type: Boolean,
      default: false
    },
    isProhibitEdit: {
      type: Boolean,
      default: false
    }
  },
  async mounted() {
    await this.getProjectIssues({
      objectId: this.projectId,
      objectType: 5,
      'x-per-page': 10,
      'x-page': 1,
      'x-order': 'createdAt-desc'
    })
    this.projectIssues = this.projectIssueList
  },
  data() {
    return {
      isLoading: false,
      projectIssues: [],
      isEn: locale === 'en-US',
      isIssueDetailDialogShow: false,
      issueDetail: {}
    }
  },
  computed: {
    ...mapGetters({
      pblIssuesList: 'pbl/issuesList'
    }),
    projectIssueList() {
      return _.get(
        this.pblIssuesList({ projectId: this.projectId }),
        'rows',
        []
      ).slice(0, 10)
    },
    moreBoardLink() {
      return `${this.projectId}/whiteboard`
    }
  },
  methods: {
    ...mapActions({
      getProjectIssues: 'pbl/getProjectIssues'
    }),
    showIssueDetail(issue) {
      this.issueDetail = issue
      this.isIssueDetailDialogShow = true
    },
    handleIssueDialogClose() {
      this.isIssueDetailDialogShow = false
      this.issueDetail = {}
    }
  },
  filters: {
    relativeTimeFilter(date, isEn) {
      const offset = moment().utcOffset()
      isEn ? moment.locale('en') : moment.locale('zh-cn')
      return moment(date)
        .utcOffset(offset)
        .fromNow()
    }
  },
  components: {
    IssueDetail
  }
}
</script>
<style lang="scss">
.project-boards {
  &-card {
    &-label {
      font-weight: bold;
    }
    &-link {
      font-size: 12px;
      text-decoration: none;
      float: right;
      color: #909399;
    }
  }
  &-item {
    display: flex;
    padding: 8px 0;
    cursor: pointer;
    &-icon {
      margin-right: 8px;
      line-height: 1;
    }
    &-title {
      flex: 1;
      margin-right: 18px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 14px;
      color: #303133;
      line-height: 1;
    }
    &-time {
      font-size: 12px;
      color: #909399;
      align-items: center;
    }
    .el-icon-warning {
      color: #f3b623;
    }
    .el-icon-success {
      color: #63e08f;
    }
  }
  &-empty {
    font-size: 14px;
  }
}
</style>

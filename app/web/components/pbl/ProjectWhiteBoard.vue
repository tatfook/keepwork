<template>
  <div class="project-white-board">
    <div class="project-white-board-content">
      <div class="project-white-board-header">
        <div class="project-white-board-header-search">
          <el-input size="medium" :placeholder="$t('project.searchMethod')" v-model="searchKeyWord" class="input-with-select" @keyup.enter.native="searchIssue">
            <el-button slot="append" icon="el-icon-search" @click="searchIssue"></el-button>
          </el-input>
        </div>
        <div class="project-white-board-header-filter hidden-sm-and-down">
          {{$t("project.filter")}}：
          <span class="project-white-board-header-rank" @click="showAllIssues">{{$t("project.all")}}({{issuesOpenCount + issuesCloseCount}})</span>
          <span class="project-white-board-header-rank" @click="showUnfinishedIssues">
            <i class="iconfont icon-warning-circle-fill"></i>{{$t("project.inProgress")}} ({{issuesOpenCount}})
          </span>
          <span class="project-white-board-header-rank" @click="showFinishedIssues">
            <i class="iconfont icon-check-circle-fill"></i>{{$t("project.finished")}} ({{issuesCloseCount}})
          </span>
        </div>
        <el-button class="project-white-board-header-new" type="primary" :disabled="isProhibitEdit" size="medium" @click="goNewIssue">+ {{$t("project.createNewIssue")}}</el-button>
      </div>
      <div class="project-white-board-list">
        <div class="project-white-board-list-item" v-for="(issue,index) in projectIssues" :key="index">
          <div class="project-white-board-list-brief">
            <div class="project-white-board-list-title" @click="goIssueDetail(issue)">
              <i :class="['iconfont', issue.state == 0 ? 'icon-warning-circle-fill':'icon-check-circle-fill']"></i>
              <span class="project-white-board-list-text" :title="issue.title">{{issue.title}}</span>
              <span class="project-white-board-list-number">#{{issue.no}}</span>
            </div>
            <div class="project-white-board-list-intro">
              <span class="project-white-board-list-time">{{isEn ? $t('common.update') : ''}} {{relativeTime(issue.updatedAt)}}{{isEn ? '' : $t('common.update')}}</span>
              <span class="project-white-board-list-creator">
                {{$t("project.createBy")}}
                <span class="project-white-board-list-creator-name">{{issue.user.username}}</span>
                {{$t("project.created")}}
              </span>
              <div class="project-white-board-list-tags">
                <span class="project-white-board-list-tags-item" v-for="(tag,i) in issueTagArr(issue)" :key="i">{{tag}}</span>
              </div>
            </div>
          </div>
          <div class="project-white-board-list-asignees  hidden-sm-and-down" v-if="issue.assigns.length > 0">
            <img class="project-white-board-list-asignees-item" v-for="player in issue.assigns" :key="player.id" :src="player.portrait || default_portrait" alt="" :title="player.username">
          </div>
        </div>
      </div>
    </div>
    <new-issue v-if="isNewIssueRendered" :show="showNewIssue" :projectId="projectId" @close="closeNewIssue"></new-issue>
    <issue-detail v-if="isIssueDetailRendered" :show="showIssueDetail" @close="closeIssueDetail" :issue="selectedIssue" :projectDetail="pblProjectDetail" :isProhibitEdit="isProhibitEdit" :currPage="page" :searchKeyWord="searchKeyWord" :state='state'></issue-detail>
    <div class="all-issue-pages" v-if="issuesCount > perPage">
      <el-pagination background @current-change="targetPage" layout="prev, pager, next" :page-size="perPage" :total="issuesCount">
      </el-pagination>
    </div>
  </div>
</template>
<script>
import 'element-ui/lib/theme-chalk/display.css'
import NewIssue from './NewIssue'
import IssueDetail from './IssueDetail'
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
import 'moment/locale/zh-cn'
import { locale } from '@/lib/utils/i18n'
import default_portrait from '@/assets/img/default_portrait.png'

export default {
  name: 'ProjectWhiteBoard',
  data() {
    return {
      projectIssues: [],
      showNewIssue: false,
      showIssueDetail: false,
      isNewIssueRendered: false,
      isIssueDetailRendered: false,
      searchKeyWord: '',
      default_portrait,
      selectedIssue: {},
      perPage: 25,
      page: 1,
      state: null
    }
  },
  props: {
    isProhibitView: {
      type: Boolean,
      default: false
    },
    isProhibitEdit: {
      type: Boolean,
      default: false
    }
  },
  components: {
    NewIssue,
    IssueDetail
  },
  computed: {
    ...mapGetters({
      issuesList: 'pbl/issuesList',
      projectDetail: 'pbl/projectDetail',
      isLogined: 'user/isLogined'
    }),
    projectIssueList() {
      return _.get(this.issuesList({ projectId: this.projectId }), 'rows', [])
    },
    issuesCount() {
      return _.get(this.issuesList({ projectId: this.projectId }), 'count', 0)
    },
    issuesOpenCount() {
      return _.get(
        this.issuesList({ projectId: this.projectId }),
        'openCount',
        0
      )
    },
    issuesCloseCount() {
      return _.get(
        this.issuesList({ projectId: this.projectId }),
        'closeCount',
        0
      )
    },
    unfinishedProjectIssueList() {
      return _.filter(this.projectIssueList, i => i.state === 0)
    },
    finishedProjectIssueList() {
      return _.filter(this.projectIssueList, i => i.state === 1)
    },
    isEn() {
      return locale === 'en-US'
    },
    projectId() {
      return _.get(this.$route, 'params.id')
    },
    pblProjectDetail() {
      return this.projectDetail({ projectId: this.projectId })
    }
  },
  async mounted() {
    if (this.isProhibitView) {
      return this.$router.push({
        name: 'ProjectIndexPage',
        params: { id: this.projectId }
      })
    }
    await this.targetPage(this.page)
    this.projectIssues = this.projectIssueList
  },
  watch: {
    projectIssueList(newIssueList) {
      this.projectIssues = _.concat(newIssueList)
    },
    async searchKeyWord(key, oldKey) {
      let payload = {
        objectId: this.projectId,
        objectType: 5,
        'x-per-page': this.perPage,
        'x-page': 1,
        'x-order': 'createdAt-desc'
      }
      if (key) payload['text-like'] = `%${key}%`
      await this.getProjectIssues(payload)
      this.projectIssues = this.projectIssueList
    }
  },
  methods: {
    ...mapActions({
      getProjectIssues: 'pbl/getProjectIssues',
      getProjectMember: 'pbl/getProjectMember',
      toggleLoginDialog: 'pbl/toggleLoginDialog'
    }),
    async targetPage(page) {
      this.page = page
      let payload = {
        objectId: this.projectId,
        objectType: 5,
        'x-per-page': this.perPage,
        'x-page': page,
        'x-order': 'createdAt-desc',
        'text-like': this.searchKeyWord ? `%${this.searchKeyWord}%` : undefined,
        state: _.isNull(this.state) ? undefined : this.state
      }
      await this.getProjectIssues(payload)
    },
    searchIssue() {
      this.targetPage(1)
      this.projectIssues = this.projectIssueList
    },
    goNewIssue() {
      if (!this.isLogined) {
        return this.toggleLoginDialog(true)
      }
      if (!this.isProhibitEdit) {
        this.isNewIssueRendered = true
        this.showNewIssue = true
      }
    },
    closeNewIssue() {
      this.showNewIssue = false
    },
    goIssueDetail(issue) {
      this.selectedIssue = issue
      this.isIssueDetailRendered = true
      this.showIssueDetail = true
    },
    closeIssueDetail() {
      this.showIssueDetail = false
    },
    showAllIssues() {
      this.state = null
      this.targetPage(1)
    },
    async showFinishedIssues() {
      this.state = 1
      this.targetPage(1)
    },
    async showUnfinishedIssues() {
      this.state = 0
      this.targetPage(1)
    },
    relativeTime(time) {
      const offset = moment().utcOffset()
      this.isEn ? moment.locale('en') : moment.locale('zh-cn')
      return moment(time)
        .utcOffset(offset)
        .fromNow()
    },
    sortByUpdateAt(obj1, obj2) {
      return obj1.updatedAt >= obj2.updatedAt ? -1 : 1
    },
    issueTagArr(issue) {
      if (_.get(issue, 'tags', '')) {
        return _.get(issue, 'tags', '').split('|')
      }
    }
  }
}
</script>

<style lang="scss">
.project-white-board {
  background: #f5f5f5;
  padding: 24px 0 120px;
  &-content {
    background: #fff;
    max-width: 1200px;
    border: 1px solid #e8e8e8;
    box-sizing: border-box;
    margin: 0 auto;
  }
  &-header {
    height: 60px;
    display: flex;
    align-items: center;
    padding: 0 16px;
    border-bottom: 1px solid #e8e8e8;
    &-search {
      width: 340px;
      .el-input-group__append {
        background: #fff;
      }
    }
    &-filter {
      flex: 1;
      font-size: 12px;
      padding-left: 40px;
      display: flex;
      align-items: center;
    }
    &-rank {
      margin-left: 14px;
      display: inline-flex;
      align-items: center;
      cursor: pointer;
      .icon-check-circle-fill {
        color: #62e08f;
        font-size: 20px;
        margin-right: 4px;
      }
      .icon-warning-circle-fill {
        color: #f3b623;
        font-size: 20px;
        margin-right: 4px;
      }
      &:hover {
        color: #409eff;
      }
    }
    &-new {
      width: 116px;
    }
  }
  &-list {
    width: 100%;
    &-item {
      padding: 6px 16px;
      display: flex;
      color: #909399;
      border-bottom: 1px solid #f5f5f5;
      &:last-child {
        border-bottom: none;
      }
    }
    &-brief {
      flex: 1;
    }
    &-title {
      display: flex;
      align-items: center;
      line-height: 35px;
      font-size: 14px;
      font-weight: bold;
      cursor: pointer;
      .iconfont {
        font-size: 22px;
        margin-right: 13px;
      }
      .icon-warning-circle-fill {
        color: #f3b623;
      }
      .icon-check-circle-fill {
        color: #62e08f;
      }
    }
    &-text {
      cursor: pointer;
      display: inline-block;
      max-width: 80%;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: #303133;
    }
    &-number {
      margin-left: 10px;
    }
    &-intro {
      padding-left: 35px;
      font-size: 12px;
    }
    &-time {
      margin-right: 8px;
    }
    &-creator {
      margin-right: 20px;
      &-name {
        color: #409eff;
      }
    }
    &-tags {
      display: inline-block;
      &-item {
        background: #eee;
        display: inline-block;
        padding: 2px 4px;
        border-radius: 2px;
        margin-right: 5px;
      }
    }
    &-asignees {
      width: 300px;
      display: flex;
      align-items: center;
      flex-direction: row-reverse;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      &-item {
        width: 24px;
        height: 24px;
        object-fit: cover;
        border: 1px solid #eee;
        border-radius: 50%;
        margin-right: 5px;
      }
    }
  }
  .all-issue-pages {
    margin: 50px auto 0;
    text-align: center;
  }
}
</style>

<template>
  <div class="form-feedback">
    <div class="form-feedback-header">
      <router-link :to="{name:'OrgForms'}">表单管理</router-link>
      &gt;
      <span class="form-feedback-header-name">{{formName}}</span>
      <span class="form-feedback-header-state" :class="{'is-danger': formState == 2}">{{formState | formStateTextFilter}}</span>
    </div>
    <div class="form-feedback-count-row">
      <div class="form-feedback-count">反馈数：{{formFeedbackCount}}</div>
      <div class="form-feedback-count-buttons">
        <el-button size="medium" @click="exportData">导出</el-button>
        <el-button size="medium" type="primary">打印</el-button>
      </div>
    </div>
    <div class="form-feedback-search">
      <label>显示：</label>
      <el-select v-model="filterType">
        <el-option v-for="(option, index) in filterOptions" :key="index" :label="option.label" :value="option.value"></el-option>
      </el-select>
    </div>
    <el-table class="form-feedback-table" :data="filteredFeedback" style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column fixed type="selection" width="50">
      </el-table-column>
      <el-table-column fixed type="index" label="序号" width="50" show-overflow-tooltip>
      </el-table-column>
      <el-table-column fixed label="提交时间" width="100" show-overflow-tooltip>
        <template slot-scope="scope">
          {{getFormatTime(scope.row.createdAt)}}
        </template>
      </el-table-column>
      <el-table-column width="120" v-for="(quiz, index) in formQuizzes" :key="index" :render-header="renderTableHeader" show-overflow-tooltip>
        <template slot-scope="scope">{{findAQuizAnswer(quiz, scope.row.quizzes)}}</template>
      </el-table-column>
      <el-table-column fixed="right" label="状态" width="80" show-overflow-tooltip>
        <template slot-scope="scope">
          <span class="form-feedback-table-state" :class="scope.row.state | stateClassFilter">{{getSubmitStateTextFilter(scope.row.state)}}</span>
        </template>
      </el-table-column>
      <el-table-column fixed="right" prop="comment" label="备注" width="60" show-overflow-tooltip>
      </el-table-column>
      <el-table-column fixed="right" label="" width="90" show-overflow-tooltip>
        <template slot-scope="scope">
          <el-button type="text" size="medium" @click="showEditDialog(scope.row)">
            <i class="iconfont icon-edit1"></i>编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog custom-class="form-feedback-dialog" title="编辑" :visible.sync="isEditDialogVisible" width="560" :before-close="handleEditDialogClose" v-loading="isDialogLoading">
      <div class="form-feedback-dialog-item">
        <label for="state">状态：</label>
        <el-select class="form-feedback-dialog-item-main" v-model="activeSubmit.state" placeholder="请选择">
          <el-option v-for="item in operateOptions" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="form-feedback-dialog-item">
        <label for="state">备注：</label>
        <el-input class="form-feedback-dialog-item-main" placeholder="请输入..." v-model="activeSubmit.comment"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleEditDialogClose">取 消</el-button>
        <el-button type="primary" @click="editSubmitState">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'
export default {
  name: 'FormFeedback',
  async mounted() {
    this.isLoading = true
    await Promise.all([
      this.orgGetSubmitList({ formId: this.formId }),
      this.orgGetForms({ formId: this.formId })
    ])
    this.isLoading = false
  },
  data() {
    return {
      isLoading: false,
      activeSubmit: {},
      operateOptions: [
        { label: '未处理', value: 0 },
        { label: '通过', value: 1 },
        { label: '不通过', value: 2 }
      ],
      filterOptions: [
        {
          label: '全部',
          value: 0,
          states: [0, 1, 2]
        },
        {
          label: '通过',
          value: 1,
          states: [1]
        },
        {
          label: '不通过',
          value: 2,
          states: [2]
        },
        {
          label: '未处理',
          value: 3,
          states: [0]
        },
        {
          label: '已处理',
          value: 4,
          states: [1, 2]
        }
      ],
      filterType: 0,
      isDialogLoading: false,
      isEditDialogVisible: false,
      multipleSelection: []
    }
  },
  computed: {
    ...mapGetters({
      getFormDetailById: 'org/getFormDetailById',
      getFormFeedbackById: 'org/getFormFeedbackById'
    }),
    formId() {
      return _.get(this.$route, 'params.id')
    },
    formDetail() {
      return this.getFormDetailById({ id: this.formId }) || {}
    },
    formName() {
      return _.get(this.formDetail, 'name')
    },
    formState() {
      return _.get(this.formDetail, 'state')
    },
    formQuizzes() {
      return _.get(this.formDetail, 'quizzes')
    },
    formFeedbackCount() {
      return _.get(this.formDetail, 'submitCount')
    },
    submitList() {
      return this.getFormFeedbackById({ id: this.formId })
    },
    visibleStates() {
      return _.find(this.filterOptions, {
        value: this.filterType
      }).states
    },
    filteredFeedback() {
      return _.filter(this.submitList, submit => {
        let { state } = submit
        return (
          _.findIndex(this.visibleStates, stateItem => stateItem == state) != -1
        )
      })
    }
  },
  methods: {
    ...mapActions({
      orgGetForms: 'org/getForms',
      orgGetSubmitList: 'org/getSubmitList',
      orgUpdateSubmit: 'org/updateSubmit'
    }),
    handleEditDialogClose() {
      this.isEditDialogVisible = false
      this.activeSubmit = {}
    },
    showEditDialog(submit) {
      this.activeSubmit = _.cloneDeep(submit)
      this.isEditDialogVisible = true
    },
    async editSubmitState() {
      let { id, formId, state, comment } = this.activeSubmit
      this.isDialogLoading = true
      await this.orgUpdateSubmit({
        formId,
        submitId: id,
        submitData: { state, comment }
      })
      this.isDialogLoading = false
      this.handleEditDialogClose()
    },
    renderTableHeader(h, { column, $index }) {
      let index = $index - 3
      let title = _.get(this.formQuizzes, `${index}.title`)
      return (
        <span class="table-title" title={title}>
          {title}
        </span>
      )
    },
    exportData() {
      if (this.multipleSelection.length === 0) {
        this.$message(this.$t('org.exportData'))
        return
      }
      import('@/components/common/Export2Excel').then(excel => {
        excel.export_json_to_excel({
          header: _.concat(['提交时间'], this.getQizzesTitleHeader(), [
            '状态',
            '备注'
          ]),
          data: this.getDataForExcel(),
          filename: `${this.formName}的反馈表`
        })
      })
    },
    getQizzesTitleHeader() {
      return _.map(this.formQuizzes, quiz => {
        return quiz.title
      })
    },
    findAQuizAnswer(quiz, quizzesWithAnswer) {
      let { title } = quiz
      let quizWithAnswer = _.find(
        quizzesWithAnswer,
        quizDetail => quizDetail.title == title
      )
      return quizWithAnswer.answer
    },
    getQuizzesAnswer(quizzesWithAnswer) {
      const self = this
      return _.map(this.formQuizzes, quiz => {
        return self.findAQuizAnswer(quiz, quizzesWithAnswer)
      })
    },
    getDataForExcel() {
      const self = this
      return _.map(this.multipleSelection, (data, index) => {
        const { createdAt, state, comment, quizzes } = data
        return _.concat(
          [self.getFormatTime(createdAt)],
          this.getQuizzesAnswer(quizzes),
          [self.getSubmitStateTextFilter(state), comment]
        )
      })
    },
    getFormatTime(time) {
      return moment(time).format('YYYY-MM-DD')
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    getSubmitStateTextFilter(state) {
      return state == 0 ? '未处理' : state == 1 ? '通过' : '未通过'
    }
  },
  filters: {
    formStateTextFilter(state) {
      return state == 0 ? '未发布' : state == 1 ? '收集中' : '停止'
    },
    stateClassFilter(state) {
      return state == 0 ? '' : state == 1 ? 'is-success' : 'is-danger'
    }
  }
}
</script>
<style lang="scss" scoped>
.form-feedback {
  background-color: #fff;
  font-size: 14px;
  &-header {
    font-size: 16px;
    height: 56px;
    line-height: 56px;
    border-bottom: 1px solid #e8e8e8;
    padding: 0 24px;
    &-state {
      font-size: 12px;
      display: inline-block;
      padding: 0 8px;
      height: 20px;
      line-height: 20px;
      color: #fff;
      background-color: #f39823;
      border-radius: 20px;
      margin-left: 8px;
      top: -2px;
      position: relative;
    }
    .is-danger {
      background-color: #f3234f;
    }
    a {
      text-decoration: none;
      color: #909399;
      &:hover {
        color: #2397f3;
      }
    }
  }
  &-count-row {
    display: flex;
    align-items: center;
    padding: 12px 24px;
    border-bottom: 1px solid #e8e8e8;
  }
  &-count {
    flex: 1;
  }
  &-search {
    padding: 12px 24px 0;
    .el-select {
      width: 90px;
    }
  }
  &-table {
    &-state {
      &.is-success {
        color: #3bf323;
      }
      &.is-danger {
        color: #f3234f;
      }
    }
    /deep/ .table-title {
      white-space: nowrap;
    }
  }
  &-dialog {
    &-item {
      display: flex;
      align-items: center;
      margin-bottom: 16px;
      &:last-child {
        margin-bottom: 0;
      }
      &-main {
        flex: 1;
      }
      label {
        flex-shrink: 0;
      }
    }
  }
}
</style>

<template>
  <div class="org-forms" v-loading="isLoading">
    <div class="org-forms-header">表单管理
      <el-button v-if="isFormExist" type="primary" size="medium" @click="toNewFormPage">创建表单</el-button>
    </div>
    <el-table v-if="isFormExist" class="org-forms-table" :data="formsList" stripe>
      <el-table-column label="表单名称" class-name="org-forms-table-name-row">
        <template slot-scope="scope">
          <div class="org-forms-table-name">
            <span>{{scope.row.name}}</span>
            <i class="iconfont icon-edit1" @click="renameForm(scope.row.id, scope.row.name)"></i>
          </div>
          <a class="org-forms-table-url" v-if="scope.row.state !== FormStateCode.unPublished" :href="scope.row.url" target="_blank">{{scope.row.url}}</a>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="175">
        <template slot-scope="scope">
          <span :class="scope.row.stateColClass">{{scope.row.stateText}}</span>
        </template>
      </el-table-column>
      <el-table-column label="反馈数" width="120">
        <template slot-scope="scope">
          <el-button v-if="scope.row.type == 3 && scope.row.submitCount > 0" type="text" @click="toFeedbackPage(scope.row.id)">{{scope.row.submitCount}}</el-button>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="" class-name="org-forms-table-operate-row">
        <template slot-scope="scope">
          <el-button v-if="scope.row.state === FormStateCode.unPublished" size="small" @click="toEditPage(scope.row.id)">编辑</el-button>
          <el-button size="small" @click="changeFormState(scope.row)">{{scope.row.buttonText}}</el-button>
          <el-dropdown trigger="click" @command="handleDropdownCommand">
            <span class="el-dropdown-link">
              <i class="iconfont icon-ellipsis"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item :command="{key: 'copy', detail: scope.row}">生成副本</el-dropdown-item>
              <el-dropdown-item :command="{key: 'print', detail: scope.row}">打印</el-dropdown-item>
              <el-dropdown-item :command="{key: 'delete', detail: scope.row}">删除</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <div v-if="!isFormExist" class="org-forms-empty">
      <div class="org-forms-empty-container">
        <p>你还没有表单哦，点击下方按钮去创建你的第一份表单吧！</p>
        <el-button type="primary" size="medium" @click="toNewFormPage">创建表单</el-button>
      </div>
    </div>
    <div v-if="!isFormExist" class="org-forms-templates">
      <div class="org-forms-templates-header">表单模板</div>
      <form-templates class="org-forms-templates-list" />
    </div>
    <el-dialog :visible.sync="isSuccessDialogShow" custom-class="org-form-dialog" center width="400px" :before-close="handleClose">
      <span slot="title">
        <i class="el-icon-success"></i> 表单发布成功！
      </span>
      <div class="org-form-dialog-name">{{activeForm.name}}</div>
      <p class="org-form-dialog-info">{{activeForm.url}}</p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="copyUrl">复制链接</el-button>
        <el-button type="primary" @click="openPreview">打开</el-button>
      </span>
    </el-dialog>
    <form-preview v-show="false" ref="formPreviewRef" :type="activeForm.type" :title="activeForm.title" :description="activeForm.description" :text="activeForm.text" :quizzes="activeForm.quizzes"></form-preview>
  </div>
</template>
<script>
import Vue from 'vue'
import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)
import { mapGetters, mapActions } from 'vuex'
import FormTemplates from './common/FormTemplates'
import FormPreview from '../common/FormPreview'
export default {
  name: 'OrgForms',
  async mounted() {
    await this.orgGetForms({ organizationId: this.currentOrgId })
  },
  data() {
    return {
      isLoading: false,
      activeForm: {},
      isSuccessDialogShow: false,
      FormStateCode: {
        unPublished: 0,
        doing: 1,
        stop: 2
      }
    }
  },
  computed: {
    ...mapGetters({
      formsListGetter: 'org/formsList',
      currentOrgId: 'org/currentOrgId'
    }),
    orgFormsList() {
      return this.formsListGetter({ id: this.currentOrgId })
    },
    isFormExist() {
      return Boolean(this.orgFormsList && this.orgFormsList.length)
    },
    formsList() {
      return _.map(this.orgFormsList, form => {
        let { id, state, submitCount, type } = form
        const { host, protocol } = window.location
        return {
          ...form,
          url: `${protocol}//${host}/org/${this.orgLoginUrl}/form/${id}`,
          stateText: this.getStateText(state),
          stateColClass: this.getStateClass(state),
          buttonText: this.getButtonText(state),
          submitCount
        }
      })
    },
    orgLoginUrl() {
      return _.get(this.$route, 'params.orgLoginUrl', '')
    }
  },
  methods: {
    ...mapActions({
      orgGetForms: 'org/getForms',
      orgUpdateForms: 'org/updateForm',
      orgCreateForm: 'org/createForm',
      orgDeleteForms: 'org/deleteForm'
    }),
    toEditPage(id) {
      this.$router.push({
        path: `forms/${id}/edit`
      })
    },
    toNewFormPage() {
      this.$router.push({
        name: 'NewForm'
      })
    },
    toFeedbackPage(id) {
      this.$router.push({
        path: `forms/${id}/feedback`
      })
    },
    getStateText(state) {
      return state === this.FormStateCode.doing
        ? '收集中'
        : state === this.FormStateCode.stop
        ? '停止'
        : '未发布'
    },
    getStateClass(state) {
      return state === this.FormStateCode.doing
        ? 'is-doing'
        : state === this.FormStateCode.stop
        ? 'is-stop'
        : ''
    },
    getButtonText(state) {
      return state === this.FormStateCode.doing
        ? '停止收集'
        : state === this.FormStateCode.stop
        ? '开始收集'
        : '发布'
    },
    async copyForm(formDetail) {
      let { description, name, title, text, type, quizzes } = formDetail
      this.isLoading = true
      await this.orgCreateForm({
        type,
        title,
        text,
        description,
        quizzes,
        name: name + '-副本'
      })
      this.isLoading = false
      this.$message({ type: 'success', message: '生成副本成功' })
    },
    printForm(formDetail) {
      this.activeForm = _.cloneDeep(formDetail)
      this.$nextTick(() => {
        const newWindow = window.open('', '标题')
        const bodyHtml = this.$refs.formPreviewRef.$el.innerHTML
        let headHtml = document.head.innerHTML
        headHtml = headHtml.replace('screen', 'screen,print')
        newWindow.document.write(
          `<html>${headHtml}<body>${bodyHtml}<script>setTimeout(function() {window.print(); window.close();}, 500)<\/script><\/body><\/html>`
        )
        this.activeForm = {}
      })
    },
    async renameForm(formId, formName) {
      this.$prompt('请输入表单名称', '表单重命名', {
        inputValue: formName,
        inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
        inputErrorMessage: '表单名称不能为空',
        confirmButtonText: '保存',
        cancelButtonText: '取消'
      })
        .then(async ({ value }) => {
          this.isLoading = true
          await this.orgUpdateForms({ formId, formDetail: { name: value } })
          this.isLoading = false
          this.updateSuccess()
        })
        .catch(() => {})
    },
    async changeFormState(formDetail) {
      let { state } = formDetail
      let targetState = state == 2 ? 1 : state + 1
      this.isLoading = true
      await this.orgUpdateForms({
        formId: formDetail.id,
        formDetail: { state: targetState }
      })
      this.isLoading = false
      if (state == 0) {
        this.activeForm = _.cloneDeep(formDetail)
        this.isSuccessDialogShow = true
        return
      }
      this.updateSuccess()
    },
    updateSuccess() {
      this.$message({
        type: 'success',
        message: '更新成功'
      })
    },
    async deleteForm(formDetail) {
      this.isLoading = true
      let { id } = formDetail
      await this.orgDeleteForms({ formId: id })
      this.isLoading = false
    },
    handleDropdownCommand(command) {
      let { key, detail } = command
      switch (key) {
        case 'copy':
          this.copyForm(detail)
          break
        case 'print':
          this.printForm(detail)
          break
        case 'delete':
          this.deleteForm(detail)
          break
        default:
          break
      }
    },
    handleClose() {
      this.isSuccessDialogShow = false
      this.activeForm = {}
    },
    openPreview() {
      window.open(this.activeForm.url, '_blank')
      this.handleClose()
    },
    copyUrl() {
      const self = this
      this.$copyText(this.activeForm.url)
        .then(() => {
          self.handleClose()
          this.$message({ type: 'success', message: '复制成功' })
        })
        .catch(e => {
          this.$message({
            showClose: true,
            message: this.$t('editor.copyFail'),
            type: 'error'
          })
        })
    }
  },
  components: {
    FormPreview,
    FormTemplates
  }
}
</script>
<style lang="scss" scoped>
.org-forms {
  background-color: #fff;
  display: flex;
  flex-direction: column;
  color: #303133;
  &-header {
    font-size: 16px;
    height: 56px;
    line-height: 56px;
    border-bottom: 1px solid #e8e8e8;
    padding: 0 24px;
    .el-button {
      float: right;
      top: 10px;
      position: relative;
    }
  }
  &-table {
    margin-top: -1px;
    /deep/ table tr &-name-row {
      padding-left: 14px;
    }
    /deep/ &-operate-row {
      padding-right: 14px;
      text-align: right;
      .el-button {
        border-radius: 8px;
      }
      .el-dropdown {
        cursor: pointer;
        margin-left: 24px;
      }
    }
    &-name {
      display: flex;
      span {
        max-width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
      .iconfont {
        flex: 1;
        color: #2397f3;
        margin-left: 8px;
        cursor: pointer;
      }
    }
    &-url {
      font-size: 12px;
      color: #c0c4cc;
      text-decoration: none;
      &:hover {
        color: #2397f3;
      }
    }
    /deep/ thead tr,
    /deep/ thead th {
      background-color: #ebf4ff;
    }
    /deep/ td,
    /deep/ th {
      border: none;
    }
    /deep/ th {
      padding: 0;
      height: 36px;
      line-height: 36px;
      color: #303133;
      font-weight: normal;
    }
    .is-doing {
      color: #f39823;
    }
    .is-stop {
      color: #f32d23;
    }
  }
  &-empty {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 14px;
    color: #999;
    p {
      margin: 0 0 20px 0;
    }
  }
  &-templates {
    border-top: 1px solid #e8e8e8;
    padding: 0 24px 16px;
    &-header {
      font-size: 16px;
      padding: 16px 0;
    }
  }
  /deep/ .org-form-dialog {
    font-size: 16px;
    &-name {
      color: #303133;
      text-align: center;
      font-size: 16px;
    }
    &-info {
      text-align: center;
      color: #909399;
    }
    .el-icon-success {
      font-size: 22px;
      vertical-align: middle;
      color: #1afa29;
    }
  }
}
</style>

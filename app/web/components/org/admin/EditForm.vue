<template>
  <div class="edit-form" v-loading="isLoading">
    <div class="edit-form-header">
      <div class="edit-form-header-breadcrumb">
        <router-link :to="{name:'OrgForms'}">表单管理</router-link>
        &gt;
        <span class="edit-form-header-breadcrumb-name">{{formName}}</span>
      </div>
      <div class="edit-form-header-buttons" v-if="formState == 0">
        <el-button size="medium" :disabled="!isFormDataValid" @click="saveForm">保存</el-button>
        <el-button size="medium" @click="showPreview">预览</el-button>
        <el-button size="medium" type="primary" :disabled="!isFormDataValid" @click="publishForm">发布</el-button>
      </div>
    </div>
    <div class="edit-form-container" v-if="formState == 0">
      <div class="edit-form-preview-zone">
        <form-preview :formDetail="formDetailData" :isEditable="true" />
      </div>
      <div class="edit-form-toolbar-zone">
        <edit-form-toolbar />
      </div>
    </div>
    <div class="edit-form-empty" v-if="formState != 0">
      该表单已经发布过，不能编辑
    </div>
    <el-dialog v-if="isDialogVisible" custom-class="edit-form-preview" fullscreen visible :before-close="handlePreviewClose">
      <form-preview :formDetail="formDetailData"></form-preview>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import FormPreview from '../common/FormPreview'
import EditFormToolbar from './common/EditFormToolbar'
export default {
  name: 'EditForm',
  async mounted() {
    this.isLoading = true
    await this.orgGetForms({})
    this.isLoading = false
    this.formDetailData = { ...this.formDetail, quizzes: this.formDetail.quizzes || [] }
    this.isLoadPerset = false
  },
  data() {
    return {
      isLoading: false,
      isDialogVisible: false,
      isLoadPerset: true,
      formDetailData: {},
    }
  },
  computed: {
    ...mapGetters({
      editingFormQuizzes: 'org/editingFormQuizzes',
      getFormDetailById: 'org/getFormDetailById',
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
    formType() {
      return _.get(this.formDetail, 'type')
    },
    formState() {
      return _.get(this.formDetail, 'state')
    },
    isFormDataValid() {
      if (!_.get(this.formDetailData, 'title')) return false
      const quizzes = this.editingFormQuizzes
      return quizzes && quizzes.length > 0
    },
  },
  methods: {
    ...mapActions({
      checkCurrentOrgExpire: 'org/checkCurrentOrgExpire',
      orgUpdateForm: 'org/updateForm',
      orgGetForms: 'org/getForms',
    }),
    showPreview() {
      this.isDialogVisible = true
    },
    handlePreviewClose() {
      this.isDialogVisible = false
    },
    showSuccessInfo(message) {
      this.$message({
        type: 'success',
        message,
      })
    },
    async saveForm() {
      let { title, description, text } = this.formDetailData
      this.isLoading = true
      await this.orgUpdateForm({
        formId: this.formId,
        formDetail: { title, description, text, quizzes: this.editingFormQuizzes },
      })
      this.isLoading = false
      this.showSuccessInfo('保存成功')
      this.$router.push({ name: 'OrgForms' })
    },
    async publishForm() {
      if (await this.checkCurrentOrgExpire()) return
      let { title, description, text, quizzes } = this.formDetailData
      this.isLoading = true
      await this.orgUpdateForm({
        formId: this.formId,
        formDetail: { title, description, text, quizzes, state: 1 },
      })
      this.isLoading = false
      this.showSuccessInfo('发布成功')
      this.$router.push({ name: 'OrgForms' })
    },
  },
  components: {
    FormPreview,
    EditFormToolbar,
  },
  watch: {
    formDetail(detail) {
      this.formDetailData = _.cloneDeep(detail)
    },
  },
}
</script>
<style lang="scss" scoped>
.edit-form {
  background-color: #fff;
  /deep/ &-preview {
    .el-dialog__close {
      font-size: 80px;
    }
  }
  &-header {
    font-size: 16px;
    height: 56px;
    line-height: 56px;
    border-bottom: 1px solid #e8e8e8;
    padding: 0 24px;
    display: flex;
    &-breadcrumb {
      flex: 1;
      color: #303133;
    }

    a {
      text-decoration: none;
      color: #909399;
      &:hover {
        color: #2397f3;
      }
    }
    .el-button--default {
      color: #303133;
      border-color: #909399;
      &.is-disabled {
        color: #c0c4cc;
        border-color: #ebeef5;
      }
    }
    .el-button + .el-button {
      margin-left: 16px;
    }
  }
  &-container {
    display: flex;
    padding: 32px 20px;
  }
  &-preview-zone {
    flex: 1;
    border: 1px solid #e8e8e8;
    border-radius: 8px;
  }
  &-toolbar-zone {
    width: 228px;
    margin-left: 20px;
  }
  &-empty {
    text-align: center;
    padding-top: 80px;
  }
  .el-dialog__wrapper {
    z-index: 99999 !important;
  }
  /deep/ .el-dialog {
    background-color: #f5f5f5;
  }
}
</style>

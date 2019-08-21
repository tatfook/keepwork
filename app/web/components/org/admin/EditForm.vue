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
    <div class="edit-form-content" v-if="formState == 0">
      <div class="edit-form-item">
        <label for="title">
          <span>*</span>名称:
        </label>
        <el-input id="title" v-model="formDetailData.title" placeholder="请输入..."></el-input>
      </div>
      <div class="edit-form-item">
        <label for="desc">描述:</label>
        <el-input id="desc" v-model="formDetailData.description" placeholder="请输入..."></el-input>
      </div>
      <div class="edit-form-item" v-if="!isLoadPerset">
        <label>
          <span>*</span>正文:
        </label>
        <quizzes-content class="edit-form-quizzes" v-if="formType === 3" ref="quizzesRef" @change="setFormContent"></quizzes-content>
        <rich-text-content v-else ref="richTextRef" @change="setFormContent"></rich-text-content>
      </div>
    </div>
    <div class="edit-form-empty" v-if="formState != 0">
      该表单已经发布过，不能编辑
    </div>
    <el-dialog v-if="isDialogVisible" custom-class="edit-form-preview" fullscreen visible :before-close="handlePreviewClose">
      <form-preview :type="formType" :title="formDetailData.title" :description="formDetailData.description" :text="formDetailData.text" :quizzes="formDetailData.quizzes"></form-preview>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import RichTextContent from './common/RichTextContent'
import QuizzesContent from '../common/QuizzesContent'
import FormPreview from '../common/FormPreview'
export default {
  name: 'EditForm',
  async mounted() {
    this.isLoading = true
    await this.orgGetForms({})
    this.isLoading = false
    this.formDetailData = _.cloneDeep(this.formDetail)
    this.isLoadPerset = false
  },
  data() {
    return {
      isLoading: false,
      isDialogVisible: false,
      isLoadPerset: true,
      formDetailData: {}
    }
  },
  computed: {
    ...mapGetters({
      getFormDetailById: 'org/getFormDetailById'
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
      let { title, plainText, quizzes } = this.formDetailData
      if (!title) return false
      if (this.formType == 3) return quizzes.length > 0
      return Boolean(plainText)
    }
  },
  methods: {
    ...mapActions({
      orgUpdateForm: 'org/updateForm',
      orgGetForms: 'org/getForms'
    }),
    showPreview() {
      this.setFormContent()
      this.isDialogVisible = true
    },
    handlePreviewClose() {
      this.isDialogVisible = false
    },
    setFormContent() {
      if (this.formType == 3) return this.setFormQuizzes()
      return this.setFormText()
    },
    setFormText() {
      let richTextRef = this.$refs.richTextRef
      let htmlStr = richTextRef.getHtmlStr()
      let textStr = richTextRef.getTextStr()
      this.$set(this.formDetailData, 'plainText', textStr)
      this.formDetailData.text = htmlStr
    },
    setFormQuizzes() {
      let quizzes = this.$refs.quizzesRef.quizzes
      this.formDetailData.quizzes = quizzes
    },
    showSuccessInfo(message) {
      this.$message({
        type: 'success',
        message
      })
    },
    async saveForm() {
      this.setFormContent()
      let { title, description, text, quizzes } = this.formDetailData
      this.isLoading = true
      await this.orgUpdateForm({
        formId: this.formId,
        formDetail: { title, description, text, quizzes }
      })
      this.isLoading = false
      this.showSuccessInfo('保存成功')
      this.$router.push({ name: 'OrgForms' })
    },
    async publishForm() {
      let { title, description, text, quizzes } = this.formDetailData
      this.isLoading = true
      await this.orgUpdateForm({
        formId: this.formId,
        formDetail: { title, description, text, quizzes, state: 1 }
      })
      this.isLoading = false
      this.showSuccessInfo('发布成功')
      this.$router.push({ name: 'OrgForms' })
    }
  },
  components: {
    QuizzesContent,
    FormPreview,
    RichTextContent
  },
  watch: {
    formDetail(detail) {
      this.formDetailData = _.cloneDeep(detail)
    }
  }
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
  &-content {
    padding: 24px;
    color: #303133;
  }
  &-item {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
    label {
      font-size: 14px;
      display: inline-block;
      margin-bottom: 8px;
      & > span {
        color: #e21b45;
        margin-right: 3px;
        font-size: 16px;
        display: inline-block;
        vertical-align: sub;
      }
    }
  }
  &-quizzes {
    background-color: #f5f5f5;
    padding: 20px;
    border-radius: 8px;
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

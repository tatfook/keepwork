<template>
  <div class="edit-form">
    <div class="edit-form-header">
      <div class="edit-form-header-breadcrumb">
        <router-link :to="{name:'OrgForms'}">表单管理</router-link>
        &gt;
        <span class="edit-form-header-breadcrumb-name">{{formName}}</span>
      </div>
      <div class="edit-form-header-buttons">
        <el-button size="medium">保存</el-button>
        <el-button size="medium" @click="showPreview">预览</el-button>
        <el-button size="medium" type="primary">发布</el-button>
      </div>
    </div>
    <div class="edit-form-content">
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
        <quizzes-content class="edit-form-quizzes" v-if="formType === 3" ref="quizzesRef"></quizzes-content>
        <rich-text-content v-else ref="richTextRef"></rich-text-content>
      </div>
    </div>
    <el-dialog v-if="isDialogVisible" fullscreen visible :before-close="handlePreviewClose">
      <form-preview :type="formType" :title="formDetailData.title" :description="formDetailData.description" :text="formDetailData.text" :quizzes="formDetailData.quizzes"></form-preview>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import RichTextContent from './common/RichTextContent'
import QuizzesContent from './common/QuizzesContent'
import FormPreview from './common/FormPreview'
export default {
  name: 'EditForm',
  async mounted() {
    await this.orgGetForms({})
    this.formDetailData = _.cloneDeep(this.formDetail)
    this.isLoadPerset = false
  },
  data() {
    return {
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
    formContent() {
      return _.get(this.formDetail, 'text', '')
    },
    formQuizzes() {
      return _.get(this.formDetail, 'quizzes', [])
    },
    formType() {
      return _.get(this.formDetail, 'type')
    }
  },
  methods: {
    ...mapActions({
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
      let htmlStr = this.$refs.richTextRef.getHtmlStr()
      this.formDetailData.text = htmlStr
    },
    setFormQuizzes() {
      let quizzes = this.$refs.quizzesRef.quizzes
      console.log(quizzes)
      this.formDetailData.quizzes = quizzes
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
  .el-dialog__wrapper {
    z-index: 99999 !important;
  }
  /deep/ .el-dialog {
    background-color: #f5f5f5;
  }
}
</style>

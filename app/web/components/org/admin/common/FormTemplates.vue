<template>
  <div class="form-templates" v-loading="isLoading">
    <div class="form-templates-list">
      <div class="form-templates-item" :class="{'selected': template.name === selectedTemplate.name}" v-for="(template, index) in formTemplates" :key="index">
        <div class="form-templates-item-box selct-show-border">
          <img class="form-templates-item-thumb" :src="template.thumb" :alt="template.name">
          <el-button v-if="isPreviewShow" class="form-templates-item-create select-show hover-show" type="primary" size="medium" @click="showPreview(template)">预览</el-button>
          <el-button v-if="!isPreviewShow" class="form-templates-item-create hover-show" type="primary" size="medium" @click="toNewFormPage">创建</el-button>
        </div>
        <div class="form-templates-item-name">{{template.name}}</div>
      </div>
    </div>
    <el-dialog top=“0” :visible.sync="isPreviewDialogVisible" custom-class="form-templates-preview" :before-close="handleClosePreview">
      <div class="form-templates-preview-close" @click="handleClosePreview">
        <i class="el-icon-circle-close"></i>
      </div>
      <img :src="selectedTemplate.preview" alt="template.name">
      <div class="form-templates-preview-button">
        <el-button type="primary" @click="showNamePrompt()">创建</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import formTemplates from '@/lib/formTemplates'
const {
  empty,
  admissionNotice,
  workSubmitNotice,
  applicationForm,
  selectedNotice
} = formTemplates

export default {
  name: 'FormTemplates',
  data() {
    return {
      isPreviewDialogVisible: false,
      isLoading: false,
      formTemplates: [
        {
          type: 0,
          thumb: require('@/assets/org/form_template1.png'),
          preview: require('@/assets/org/form_template1_preview.png'),
          name: '空白模板',
          templateParam: empty
        },
        {
          type: 1,
          thumb: require('@/assets/org/form_template2.png'),
          preview: require('@/assets/org/form_template2_preview.png'),
          name: '招生通知',
          templateParam: admissionNotice
        },
        {
          type: 2,
          thumb: require('@/assets/org/form_template3.png'),
          preview: require('@/assets/org/form_template3_preview.png'),
          name: '入学作品提交通知',
          templateParam: workSubmitNotice
        },
        {
          type: 3,
          thumb: require('@/assets/org/form_template4.png'),
          preview: require('@/assets/org/form_template4_preview.png'),
          name: '报名表',
          templateParam: applicationForm
        },
        {
          type: 4,
          thumb: require('@/assets/org/form_template5.png'),
          preview: require('@/assets/org/form_template5_preview.png'),
          name: '入选学员通知',
          templateParam: selectedNotice
        }
      ],
      selectedTemplate: {}
    }
  },
  computed: {
    nowPageName() {
      return _.get(this.$route, 'name')
    },
    isPreviewShow() {
      return this.nowPageName == 'NewForm'
    }
  },
  methods: {
    ...mapActions({
      orgCreateForm: 'org/createForm'
    }),
    handleClosePreview() {
      this.selectedTemplate = {}
      this.isPreviewDialogVisible = false
    },
    showPreview(template) {
      this.selectedTemplate = template
      this.isPreviewDialogVisible = true
    },
    showNamePrompt() {
      let {
        type,
        templateParam: { title, description, text, quizzes }
      } = this.selectedTemplate
      this.$prompt('名称', '创建表单', {
        inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
        inputErrorMessage: '表单名称不能为空',
        confirmButtonText: '保存',
        cancelButtonText: '取消'
      }).then(async ({ value }) => {
        this.createForm({
          type,
          title,
          text,
          description,
          quizzes,
          name: value
        })
      })
    },
    async createForm(newFormData) {
      this.isLoading = true
      try {
        let { id } = await this.orgCreateForm(newFormData)
        this.$message({ type: 'success', message: '创建成功' })
        this.$router.push({
          name: 'EditForm',
          params: {
            id
          }
        })
      } catch (error) {}
      this.isLoading = false
    },
    toNewFormPage() {
      this.$router.push({ name: 'NewForm' })
    }
  }
}
</script>
<style lang="scss" scoped>
.form-templates {
  font-size: 14px;
  &-item {
    display: inline-block;
    padding: 0 8px;
    margin-bottom: 24px;
    text-align: center;
    &:first-child {
      padding-left: 0;
    }
    &-box {
      position: relative;
      border: 2px solid transparent;
      border-radius: 12px;
      overflow: hidden;
      margin-bottom: 8px;
      width: 152px;
      &:hover {
        border-color: #2397f3;
        .hover-show {
          display: inline-block;
        }
      }
    }
    &-thumb {
      width: 100%;
      height: auto;
    }
    &-create {
      display: none;
      position: absolute;
      left: 50%;
      right: 50%;
      bottom: 50%;
      top: 50%;
      transform: translate(-50%, -18px);
      height: 36px;
    }
    &.selected {
      .selct-show-border {
        border-color: #2397f3;
      }
      .select-show {
        display: inline-block;
      }
    }
  }
  /deep/ &-preview {
    width: 800px;
    overflow: auto;
    text-align: center;
    height: 60vh;
    margin: 20vh auto;
    border-radius: 8px;
    &-close {
      position: absolute;
      cursor: pointer;
      right: 24px;
      color: #fff;
      top: 8px;
      font-size: 24px;
    }
    &-button {
      border-top: 1px solid #e8e8e8;
      padding: 20px 0;
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      background-color: #fff;
    }
    .el-button {
      width: 100px;
      font-size: 14px;
      height: 32px;
      line-height: 32px;
      padding: 0;
    }
    img {
      width: 100%;
      height: auto;
    }
    .el-dialog__header {
      display: none;
    }
    .el-dialog__body {
      padding: 0;
      height: 100%;
      padding-bottom: 73px;
      box-sizing: border-box;
      overflow: auto;
    }
  }
}
</style>

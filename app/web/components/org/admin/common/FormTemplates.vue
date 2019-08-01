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
    <div class="form-templates-preview" v-if="isPreviewShow">
      <img :src="selectedTemplate.preview" alt="template.name">
      <div class="form-templates-preview-button">
        <el-button type="primary" @click="showNamePrompt()">创建</el-button>
      </div>
    </div>
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
  mounted() {
    this.isPreviewShow && (this.selectedTemplate = this.formTemplates[0])
  },
  data() {
    return {
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
    showPreview(template) {
      this.selectedTemplate = template
    },
    showNamePrompt() {
      let {
        type,
        templateParam: { title, description, text, quizzes }
      } = this.selectedTemplate
      this.$prompt('名称', '创建表单', {
        confirmButtonText: '保存',
        cancelButtonText: '取消'
      }).then(async ({ value }) => {
        this.isLoading = true
        await this.orgCreateForm({
          type,
          title,
          text,
          description,
          quizzes,
          name: value
        })
        this.$message({ type: 'success', message: '创建成功' })
        this.isLoading = false
        this.$router.push({
          name: 'OrgForms'
        })
      })
    },
    toNewFormPage() {
      this.$router.push({ name: 'NewForm' })
    }
  }
}
</script>
<style lang="scss" scoped>
.form-templates {
  display: flex;
  font-size: 14px;
  &-list {
    flex: 1;
  }
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
  &-preview {
    width: 326px;
    text-align: center;
    border: 1px solid #e8e8e8;
    border-radius: 8px;
    box-shadow: 0px 2px 8px 2px rgba(184, 184, 184, 0.5);
    &-button {
      border-top: 1px solid #e8e8e8;
      padding: 20px 0;
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
  }
}
</style>

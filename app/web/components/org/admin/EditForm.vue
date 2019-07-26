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
        <el-button size="medium">预览</el-button>
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
        <el-input id="content" v-model="formDetailData.desc" placeholder="请输入..."></el-input>
      </div>
      <div class="edit-form-item">
        <label>
          <span>*</span>正文:
        </label>
        <rich-text-content :originContent="formContent"></rich-text-content>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
import RichTextContent from './common/RichTextContent'
export default {
  name: 'EditForm',
  mounted() {
    this.formDetailData = _.cloneDeep(this.formDetail)
  },
  data() {
    return {
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
      return _.get(this.formDetail, 'content', '')
    }
  },
  components: {
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
}
</style>

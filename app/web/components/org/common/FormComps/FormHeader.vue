<template>
  <div class="form-header">
    <h1 :title="title">{{title}}</h1>
    <p :title="description">{{description}}</p>
    <div class="operates" v-if="isEditable">
      <i class="iconfont icon-edit--" @click="showHeaderEditor"></i>
    </div>
    <el-dialog v-if="isEditable" title="表头" :visible.sync="isHeaderEditorShow" :before-close="handleEditorClose" width="424px">
      <el-form label-position="top" :model="formData" :rules="headerRules">
        <el-form-item label="标题" prop="title">
          <el-input v-model="formData.title"></el-input>
        </el-form-item>
        <el-form-item label="描述" prop="description">
          <el-input v-model="formData.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="handleEditorClose">取消</el-button>
        <el-button type="primary" @click="saveNewHeader">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'FormHeader',
  props: {
    headerData: {
      type: Object,
      default: () => {
        return {}
      },
    },
    isEditable: Boolean,
  },
  data() {
    return {
      formData: {},
      isHeaderEditorShow: false,
      headerRules: {
        title: [{ required: true, message: '请输入标题' }],
      },
    }
  },
  computed: {
    ...mapGetters({
      editingForm: 'org/editingForm',
    }),
    title() {
      return this.headerData.title
    },
    description() {
      return this.headerData.description
    },
  },
  methods: {
    ...mapActions({
      setEditingForm: 'org/setEditingForm',
    }),
    showHeaderEditor() {
      let { title, description } = this.headerData
      this.formData = { title, description }
      this.isHeaderEditorShow = true
    },
    handleEditorClose() {
      this.isHeaderEditorShow = false
      this.formData = {}
    },
    saveNewHeader() {
      let { title, description } = this.formData
      this.setEditingForm({ ...this.editingForm, title, description })
      this.handleEditorClose()
    },
  },
}
</script>
<style lang="scss" scoped>
.form-header {
  background-color: #2397f3;
  height: 116px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: relative;
  &:hover {
    .operates {
      display: unset;
    }
  }
  h1 {
    font-size: 24px;
    color: #fff;
    margin: 0;
    font-weight: normal;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 100%;
  }
  p {
    font-size: 14px;
    color: #5bf5ff;
    max-width: 468px;
    text-align: center;
    margin: 8px 0 0 0;
    line-clamp: 2;
    -webkit-line-clamp: 2;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }
  .operates {
    position: absolute;
    right: 10px;
    top: 8px;
    display: none;
  }
  .iconfont {
    display: inline-block;
    color: #fff;
    cursor: pointer;
    font-size: 18px;
  }
  .el-dialog__wrapper /deep/.el-dialog {
    background-color: #fff;
  }
  /deep/.el-form-item__label {
    line-height: inherit;
  }
}
</style>

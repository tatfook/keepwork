<template>
  <div class="form-footer">
    <el-button type="primary" v-if="footerData.isShow">{{footerData.content}}</el-button>
    <div v-else class="empty">提交按钮已隐藏，点击<i class="iconfont icon-edit--" @click="showHeaderEditor"></i>调整</div>
    <div class="operates" v-if="isEditable">
      <i class="iconfont icon-edit--" @click="showHeaderEditor"></i>
    </div>
    <el-dialog v-if="isEditable" title="表头" :visible.sync="isFooterEditorShow" :before-close="handleEditorClose" width="424px">
      <el-form :model="formData" :rules="footerRules">
        <el-form-item label="是否显示提交按钮:" prop="isShow" label-width="10em">
          <el-radio-group v-model="formData.isShow">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="formData.isShow" label="按钮名称:" prop="content" label-width="6em">
          <el-input v-model="formData.content"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="handleEditorClose">取消</el-button>
        <el-button type="primary" @click="saveFooter">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'FormFooter',
  props: {
    footerData: {
      type: Object,
      default: () => {
        return { content: '提交', isShow: true }
      },
    },
    isEditable: Boolean,
  },
  data() {
    return {
      formData: {},
      isFooterEditorShow: false,
      footerRules: {
        isShow: [{ required: true }],
      },
    }
  },
  computed: {
    ...mapGetters({
      editingForm: 'org/editingForm',
    }),
  },
  methods: {
    ...mapActions({
      setEditingForm: 'org/setEditingForm',
    }),
    showHeaderEditor() {
      let { isShow, content } = this.footerData
      this.formData = { isShow: isShow || true, content }
      this.isFooterEditorShow = true
    },
    handleEditorClose() {
      this.isFooterEditorShow = false
      this.formData = {}
    },
    saveFooter() {
      let { isShow, content } = this.formData
      this.setEditingForm({ ...this.editingForm, bottomButton: { isShow, content } })
      this.handleEditorClose()
    },
  },
}
</script>
<style lang="scss" scoped>
.form-footer {
  text-align: center;
  padding: 20px 0;
  border-top: 1px solid #e8e8e8;
  position: relative;
  &:hover {
    .operates {
      display: unset;
    }
  }
  .empty {
    font-size: 14px;
    color: #909399;
  }
  .el-button {
    width: 100px;
    height: 32px;
    line-height: 32px;
    padding: 0;
  }
  .operates {
    position: absolute;
    right: 10px;
    top: 8px;
    display: none;
  }
  .iconfont {
    display: inline-block;
    color: #2397f3;
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
    margin: 0 8px;
  }
  /deep/.el-form-item__content {
    text-align: left;
  }
}
</style>

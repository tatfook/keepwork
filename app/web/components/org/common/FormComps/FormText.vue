<template>
  <div class="form-text">
    <div class="content" v-html="content"></div>
    <div class="operates" v-if="isEditable">
      <i class="iconfont icon-edit--" @click="editComp"></i>
      <i class="iconfont icon-delete" @click="deleteComp"></i>
    </div>
    <el-dialog v-if="isEditable" title="文本" :visible.sync="isEditDialogShow" :before-close="handleEditorClose">
      <rich-text-content ref="richTextEditor" :content="content" :timeId="timeId" />
      <div slot="footer">
        <el-button @click="handleEditorClose">取消</el-button>
        <el-button type="primary" @click="saveNewContent">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import RichTextContent from '../../admin/common/RichTextContent'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'FormText',
  props: {
    itemData: {
      type: Object,
      default: {},
    },
    itemIndex: {
      type: Number,
      required: true,
    },
    isEditable: Boolean
  },
  data() {
    return {
      timeId: 'js' + new Date().valueOf(),
      isEditDialogShow: false,
    }
  },
  computed: {
    ...mapGetters({
      editingFormQuizzes: 'org/editingFormQuizzes',
    }),
    content() {
      return this.itemData.content
    },
  },
  methods: {
    ...mapActions({
      setEditingQuizzes: 'org/setEditingQuizzes',
    }),
    handleEditorClose() {
      this.isEditDialogShow = false
    },
    editComp() {
      this.isEditDialogShow = true
    },
    deleteComp() {
      let quizzes = _.cloneDeep(this.editingFormQuizzes)
      quizzes.splice(this.itemIndex, 1)
      this.setEditingQuizzes(quizzes)
    },
    saveNewContent() {
      const richTextEditor = this.$refs.richTextEditor
      const htmlStr = richTextEditor.getHtmlStr()
      let quizzes = _.cloneDeep(this.editingFormQuizzes)
      quizzes[this.itemIndex] = {
        ...this.itemData,
        content: htmlStr,
      }
      this.setEditingQuizzes(quizzes)
      this.handleEditorClose()
    },
  },
  components: {
    RichTextContent,
  },
}
</script>
<style lang="scss" scoped>
.form-text {
  padding-top: 24px;
  padding-bottom: 24px;
  position: relative;
  &:hover {
    .operates {
      display: unset;
    }
  }
  .operates {
    position: absolute;
    right: 10px;
    top: 8px;
    display: none;
  }
  .iconfont {
    display: inline-block;
    width: 22px;
    height: 22px;
    line-height: 22px;
    border-radius: 50%;
    text-align: center;
    margin-left: 8px;
    color: #fff;
    cursor: pointer;
  }
  .icon-edit-- {
    background-color: #2397f3;
    font-size: 12px;
  }
  .icon-delete {
    background-color: #f56c6c;
  }
}
</style>

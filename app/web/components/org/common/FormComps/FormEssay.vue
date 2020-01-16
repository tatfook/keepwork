<template>
  <div class="form-essay">
    <div class="content">
      <div class="title"><span v-if="itemData.isRequired" class="is-required">(必选)</span>{{itemData.title}}</div>
      <div class="info" v-if="itemData.remark">{{itemData.remark}}</div>
      <el-input type="textarea" v-model="itemData.answer" :disabled="isEditable"></el-input>
    </div>
    <div class="operates" v-if="isEditable">
      <i class="iconfont icon-edit--" @click="editComp"></i>
      <i class="iconfont icon-delete" @click="deleteComp"></i>
    </div>
    <quiz-editor v-if="isEditable" :originQuiz="itemData" :isVisible='isEditDialogShow' title="问答题" @close="handleEditorClose" />
  </div>
</template>
<script>
import QuizEditor from '../../admin/common/QuizEditor'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'FormEssay',
  props: {
    itemData: {
      type: Object,
      default: {},
    },
    itemIndex: {
      type: Number,
      required: true,
    },
    isEditable: Boolean,
  },
  data() {
    return {
      isEditDialogShow: false,
    }
  },
  computed: {
    ...mapGetters({
      editingFormQuizzes: 'org/editingFormQuizzes',
    }),
  },
  methods: {
    ...mapActions({ setEditingQuizzes: 'org/setEditingQuizzes' }),
    handleEditorClose(quizData) {
      if (quizData) {
        let quizzes = _.cloneDeep(this.editingFormQuizzes)
        quizzes[this.itemIndex] = quizData
        this.setEditingQuizzes(quizzes)
      }
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
  },
  components: {
    QuizEditor,
  },
}
</script>
<style lang="scss" scoped>
.form-essay {
  padding-bottom: 16px;
  position: relative;
  &:hover {
    .operates {
      display: unset;
    }
  }
  .title {
    padding: 12px 0;
  }
  .info {
    font-size: 12px;
    color: #c0c4cc;
    margin-bottom: 8px;
  }
  .is-required {
    color: #e21b45;
  }
  .operates {
    display: none;
    position: absolute;
    right: 10px;
    top: 8px;
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
  /deep/.el-textarea__inner {
    resize: none;
    height: 40px;
  }
}
</style>

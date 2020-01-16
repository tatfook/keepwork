<template>
  <div class="form-choice">
    <div class="content">
      <div class="title">
        <span v-if="itemData.isRequired" class="is-required">(必填)</span>
        {{itemData.title}}
      </div>
      <div class="remark" v-if="itemData.remark">{{itemData.remark}}</div>
      <el-radio-group v-if="itemData.type === 0" :disabled="isEditable" v-model="itemData.answer">
        <el-radio v-for="(option, index) in itemData.options" :key="index" :label="option.value"></el-radio>
      </el-radio-group>
      <el-checkbox-group v-else v-model="itemData.answer" :disabled="isEditable">
        <el-checkbox v-for="(option, index) in itemData.options" :key="index" :label="option.value"></el-checkbox>
      </el-checkbox-group>
    </div>
    <div class="operates" v-if="isEditable">
      <i class="iconfont icon-edit--" @click="editComp"></i>
      <i class="iconfont icon-delete" @click="deleteComp"></i>
    </div>
    <quiz-editor v-if="isEditable" :originQuiz="itemData" :isVisible='isEditDialogShow' title="选择题" @close="handleEditorClose" />
  </div>
</template>
<script>
import QuizEditor from '../../admin/common/QuizEditor'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'FormChoice',
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
.form-choice {
  padding-bottom: 16px;
  position: relative;
  &:hover {
    .operates {
      display: unset;
    }
  }
  .title {
    padding: 14px 0 16px;
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
}
</style>

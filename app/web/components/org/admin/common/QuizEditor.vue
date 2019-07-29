<template>
  <el-dialog custom-class="quiz-editor" title="添加内容项" :visible.sync="isDialogVisible" width="640" :before-close="handleClose">
    <div class="quiz-editor-content">
      <div class="quiz-editor-item">
        <label class="quiz-editor-item-label quiz-editor-item-label-short"><span class="quiz-editor-star">*</span>类型：</label>
        <el-radio-group v-model="quizData.type">
          <el-radio :label="0">单选</el-radio>
          <el-radio :label="1">多选</el-radio>
          <el-radio :label="2">问答</el-radio>
        </el-radio-group>
      </div>
      <div class="quiz-editor-item">
        <label class="quiz-editor-item-label quiz-editor-item-label-short"><span class="quiz-editor-star">*</span>是否必须回答：</label>
        <el-radio-group v-model="quizData.isRequired">
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </div>
      <div class="quiz-editor-item">
        <label class="quiz-editor-item-label"><span class="quiz-editor-star">*</span>题干：</label>
        <el-input placeholder="请输入..." v-model="quizData.title"></el-input>
      </div>
      <div class="quiz-editor-item">
        <label class="quiz-editor-item-label">备注：</label>
        <el-input placeholder="请输入..." v-model="quizData.remark"></el-input>
      </div>
      <div v-if="quizData.type !== 2" class="quiz-editor-item">
        <label class="quiz-editor-item-label"><span class="quiz-editor-star">*</span>选项：</label>
        <div class="quiz-editor-options">
          <div class="quiz-editor-options-item" v-for="(option, index) in quizData.options" :key="index">
            <span class="quiz-editor-options-item-index">{{index+1}}、</span>
            <el-input placeholder="请输入..." v-model="option.value"></el-input>
            <i class="iconfont icon-delete1" @click="deleteOption(index)"></i>
          </div>
          <div class="quiz-editor-options-item-add" @click="addOption">
            <i class="iconfont icon-add--"></i>添加更多选项
          </div>
        </div>
      </div>
    </div>
    <span slot="footer" class="quiz-editor-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button :disabled="!isDataValid" type="primary" @click="handleClose(true)">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: 'QuizEditor',
  props: {
    originQuiz: Object,
    isVisible: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    this.isDialogVisible = this.isVisible
    if (this.originQuiz) {
      console.log(this.originQuiz)
      this.quizData = _.cloneDeep(this.originQuiz)
    }
  },
  data() {
    return {
      isDialogVisible: false,
      quizData: {
        type: 0, // 0：单选 1：多选 2：问答
        isRequired: true,
        title: '',
        remark: '',
        options: []
      }
    }
  },
  computed: {
    isDataValid() {
      let { title, options, type } = this.quizData
      let optionLen = options && options.length
      if (!title) return false
      if (type != 2) {
        if (optionLen < 2) return false
        let index
        for (index = 0; index < optionLen; index++) {
          if (!options[index].value) break
        }
        if (index >= optionLen) return true
        else return false
      }
      return true
    }
  },
  methods: {
    handleClose(isSaved) {
      this.$emit(
        'close',
        isSaved === true && this.isDataValid ? this.quizData : undefined
      )
      this.initData()
    },
    addOption() {
      this.quizData.options.push({ value: '' })
    },
    deleteOption(index) {
      this.quizData.options.splice(index, 1)
    },
    initData() {
      let quiz = this.originQuiz
      if (quiz) {
        this.quizData = quiz
      } else {
        this.quizData = {
          type: 0,
          isRequired: true,
          title: '',
          remark: '',
          options: []
        }
      }
    }
  },
  watch: {
    originQuiz() {
      this.initData()
    },
    isVisible(val) {
      this.isDialogVisible = this.isVisible
    }
  }
}
</script>
<style lang="scss" scoped>
.quiz-editor {
  font-size: 14px;
  color: #303133;
  &-item {
    padding-left: 12px;
    margin-bottom: 12px;
    display: flex;
    &-label {
      flex-shrink: 0;
      position: relative;
      line-height: 40px;
    }
    &-label-short {
      line-height: 20px;
    }
    &:last-child {
      margin-bottom: 0;
    }
    .el-radio {
      height: 20px;
      line-height: 20px;
    }
    /deep/ .el-radio__input {
      font-size: 0;
    }
  }
  &-star {
    color: #e21b45;
    position: absolute;
    left: -12px;
  }
  &-options {
    width: 100%;
    &-item {
      display: flex;
      align-items: center;
      margin-bottom: 8px;
      &-add {
        color: #2397f3;
        cursor: pointer;
        height: 40px;
        line-height: 40px;
        .icon-add-- {
          font-size: 22px;
          vertical-align: middle;
          margin-right: 6px;
        }
      }
      .icon-delete1 {
        margin-left: 12px;
        color: #e21b45;
        cursor: pointer;
      }
    }
  }
}
</style>

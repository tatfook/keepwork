<template>
  <div class="quizzes-content">
    <div class="quizzes-content-item" v-for="(quiz, index) in quizzes" :key="index">
      <div class="quizzes-content-title">
        <span v-if="quiz.isRequired" class="quizzes-content-required">(必填)</span>
        {{quiz.title}}
        <el-dropdown trigger="click" @command="handleDropdownCommand">
          <span class="el-dropdown-link">
            <i class="iconfont icon-ellipsis"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command="{key: 'prev', quiz}">在前添加</el-dropdown-item>
            <el-dropdown-item :command="{key: 'next', quiz}">在后添加</el-dropdown-item>
            <el-dropdown-item :command="{key: 'edit', quiz}">编辑</el-dropdown-item>
            <el-dropdown-item :command="{key: 'delete', quiz}">删除</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <div class="quizzes-content-remark">{{quiz.remark}}</div>
      <el-radio-group v-if="quiz.type === 0">
        <el-radio v-for="(option, index) in quiz.options" :key="index" :label="option.value" disabled></el-radio>
      </el-radio-group>
      <el-checkbox-group v-else-if="quiz.type === 1">
        <el-checkbox v-for="(option, index) in quiz.options" :key="index" :label="option.value" disabled></el-checkbox>
      </el-checkbox-group>
      <el-input v-else type="textarea" disabled=""></el-input>
    </div>
    <div class="quizzes-content-add" @click="showQuizEditor">
      <i class="iconfont icon-add--"></i>添加信息项
    </div>
    <quiz-editor :isVisible="isDialogVisible" @close="handleQuizEditorClose"></quiz-editor>
  </div>
</template>
<script>
import QuizEditor from './QuizEditor'
export default {
  name: 'QuizzesContent',
  data() {
    return {
      isDialogVisible: false,
      quizzes: []
    }
  },
  methods: {
    showQuizEditor() {
      this.isDialogVisible = true
    },
    handleQuizEditorClose(quiz) {
      this.isDialogVisible = false
      console.log(quiz)
      if (quiz) {
        this.quizzes.push(quiz)
      }
    },
    handleDropdownCommand(command) {
      let { key, quiz } = command
      console.log(key, quiz)
    }
  },
  components: {
    QuizEditor
  }
}
</script>
<style lang="scss" scoped>
.quizzes-content {
  font-size: 14px;
  background-color: #f5f5f5;
  padding: 20px;
  &-item {
    background-color: #fff;
    margin-bottom: 12px;
    padding: 12px;
  }
  &-title {
    margin-bottom: 10px;
    position: relative;
  }
  &-required {
    color: #e21b45;
  }
  &-remark {
    font-size: 12px;
    color: #c0c4cc;
    margin-bottom: 16px;
  }
  &-add {
    color: #2397f3;
    cursor: pointer;
    .icon-add-- {
      font-size: 22px;
      vertical-align: middle;
      margin-right: 6px;
    }
  }
  .el-textarea__inner {
    resize: none;
    height: 100px;
  }
  .el-dropdown {
    position: absolute;
    right: 0;
    font-weight: bold;
    cursor: pointer;
  }
}
</style>

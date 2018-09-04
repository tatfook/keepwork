<template>
  <div class="lesson-editor-header">
    <el-breadcrumb class="lesson-editor-header-breadcrumb" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>课程</el-breadcrumb-item>
      <el-breadcrumb-item>新建课程</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="lesson-editor-header-operations">
      <el-button round @click="toLessonManagerPage" class="lesson-editor-header-cancel-button">{{$t('common.Cancel')}}</el-button>
      <el-button round @click="saveLesson" class="lesson-editor-header-save-button" :class="{'is-disabled': isLessonNameEmpty}">{{$t('common.Save')}}</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'LessonEditorHeader',
  props: {
    isLessonNameEmpty: Boolean
  },
  methods: {
    saveLesson() {
      this.$emit('savePackage', {})
    },
    toLessonManagerPage() {
      console.log('toLessonManagerPage page')
      // this.$router.push('/teacher/packageManager')
    }
  }
}
</script>
<style lang="scss">
.lesson-editor-header {
  padding: 37px 0 0;
  display: flex;
  &-breadcrumb {
    flex: 1;
    .el-breadcrumb__inner {
      color: #b3b3b3;
    }
    .el-breadcrumb__item:last-child .el-breadcrumb__inner {
      color: #333;
    }
  }
  &-operations {
    font-size: 17px;
    .el-button {
      width: 90px;
    }
    .el-button + .el-button {
      margin-left: 7px;
    }
  }
  &-cancel-button:hover {
    background-color: #d95450;
    color: #fff;
    border-color: transparent;
  }
  &-save-button:hover {
    background-color: #17da98;
    color: #fff;
    border-color: transparent;
  }
  &-submit-button:hover,
  &-release-button:hover {
    background-color: #6291c1;
    color: #fff;
    border-color: transparent;
  }
}
</style>

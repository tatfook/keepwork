<template>
  <div class="lesson-editor-header">
    <el-breadcrumb class="lesson-editor-header-breadcrumb" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>{{$t('lesson.lessonManage.lessonTitle')}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{isEditing ? lessonName : $t('lesson.newLesson')}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="lesson-editor-header-operations">
      <el-button round @click="cancel" class="lesson-editor-header-cancel-button">{{$t('common.Cancel')}}</el-button>
      <el-button round @click="saveLesson" class="lesson-editor-header-save-button" :class="{'is-disabled': isLessonNameEmpty}">{{$t('common.Save')}}</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: 'LessonEditorHeader',
  props: {
    editingLessonDetailProp: Object,
    isEditing: Boolean,
    isLessonNameEmpty: Boolean,
    isEditorMod: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    lessonName() {
      if (this.isEditing) {
        let { lessonName } = this.editingLessonDetailProp
        return lessonName
      }
      return undefined
    }
  },
  methods: {
    saveLesson() {
      this.$emit('saveLesson', {})
    },
    cancel() {
      this.isEditorMod ? this.$emit('resetCancel') : this.toLessonManagerPage()
    },
    toLessonManagerPage() {
      this.$router.push('/teacher/lessonManager')
    }
  }
}
</script>
<style lang="scss">
.lesson-editor-header {
  padding: 0 0 26px;
  display: flex;
  align-items: center;
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

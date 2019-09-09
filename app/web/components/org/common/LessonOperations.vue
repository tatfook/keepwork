<template>
  <div class="lesson-operations">
    <a v-if="url" class="lesson-operations-item" :href="url" target="_blank">教案</a>
    <a v-if="coursewareUrl" class="lesson-operations-item" :href="coursewareUrl" target="_blank">课件</a>
    <a v-if="teacherVideoUrl" class="lesson-operations-item" :href="teacherVideoUrl" target="_blank">教师视频</a>
    <a v-if="studentVideoUrl" class="lesson-operations-item" :href="studentVideoUrl" target="_blank">学生视频</a>
  </div>
</template>
<script>
export default {
  name: 'LessonOperations',
  props: {
    lesson: Object
  },
  computed: {
    url() {
      return _.get(this.lesson, 'url')
    },
    coursewareUrl() {
      return _.get(this.lesson, 'coursewareUrl')
    },
    teacherVideoUrl() {
      return _.get(this.lesson, 'extra.teacherVideoUrl')
    },
    studentVideoUrl() {
      return _.get(this.lesson, 'extra.studentVideoUrl')
    }
  }
}
</script>
<style lang="scss" scoped>
.lesson-operations {
  a {
    text-decoration: none;
    padding: 6px 12px;
    color: #606266;
    border: 1px solid #909399;
    border-radius: 4px;
    display: inline-block;
    margin-right: 8px;
    &:hover {
      color: #fff;
      border-color: #2397f3;
      background-color: #2397f3;
    }
  }
}
</style>

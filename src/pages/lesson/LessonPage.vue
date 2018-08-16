<template>
  <div class="lesson-page">
    <CommonHeader></CommonHeader>
    <LessonHeader></LessonHeader>
    <router-view class="lesson-page-main-content" id="lesson-page" />
  </div>
</template>

<script>
import CommonHeader from '@/components/common/CommonHeader'
import LessonHeader from '@/components/lesson/common/Header'
export default {
  name: 'LessonPage',
  components: {
    LessonHeader,
    CommonHeader
  }
}
</script>

<style lang="scss">
html,
body {
  height: 100%;
}
body {
  margin: 0;
  padding: 0;
}
.lesson-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  &-main-content {
    min-height: auto;
    flex: 1;
  }
}
</style>

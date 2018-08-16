<template>
  <div class="lesson-page">
    <CommonHeader></CommonHeader>
    <LessonHeader></LessonHeader>
    <router-view class="lesson-page-main-content" id="lesson-page" />
    <CommonFooter class="container"/>
  </div>
</template>

<script>
import CommonHeader from '@/components/common/CommonHeader'
import LessonHeader from '@/components/lesson/common/Header'
import CommonFooter from '../../components/common/CommonFooter'

export default {
  name: 'LessonPage',
  components: {
    LessonHeader,
    CommonHeader,
    CommonFooter
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
  .container {
  max-width: 1140px;
  margin: 0 auto;
}
}
</style>

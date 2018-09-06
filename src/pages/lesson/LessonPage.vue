<template>
  <div class="lesson-page">
    <div class="lesson-page-header">
      <common-header class="container"></common-header>
    </div>
    <lesson-header></lesson-header>
    <router-view class="lesson-page-main-content" id="lesson-page" />
    <common-footer class="container"></common-footer>
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
  font-family: 'Microsoft YaHei';
}
body {
  margin: 0;
  padding: 0;
}
.lesson-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  &-header{
    height: 60px;
    border-bottom: 1px solid #e6e6e6;
  }
  &-main-content {
    background: #f8f8f8;
    min-height: auto;
    flex: 1;
  }
  .container {
  max-width: 1200px;
  margin: 0 auto;
}
}
</style>

<template>
  <div>
    <CommonHeader></CommonHeader>
    <router-view id="lesson-page" />
  </div>
</template>

<script>
import CommonHeader from '@/components/common/CommonHeader'
export default {
  name: 'LessonPage',
  components: {
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
</style>

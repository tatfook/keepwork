<template>
  <el-main id="lesson-page">
    <router-view/>
  </el-main>
</template>

<script>
export default {
  name: "LessonPage",
  components: {
  }
}
</script>

<style lang="scss">
  body{
    margin: 0;
    .el-main{
      padding: 0;
    }
  }
</style>

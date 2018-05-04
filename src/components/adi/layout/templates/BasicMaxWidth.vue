<template>
  <el-container class="maxwidth-template">
    <el-main>
      <slot> </slot>
    </el-main>
  </el-container>
</template>

<script>
export default {}
</script>

<style lang="scss">
.maxwidth-template{
  .el-main{
    padding: 0;
    max-width: 1080px;
    margin: 0 auto;
  }
}
</style>

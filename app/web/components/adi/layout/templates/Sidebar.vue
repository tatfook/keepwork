<template>
  <el-container class="fullscreen-template">
    <el-aside width="400px">
      <slot name="sidebar"></slot>
    </el-aside>
    <el-main>
      <slot> </slot>
    </el-main>
  </el-container>
</template>

<script>
export default {}
</script>

<style lang="scss">
.fullscreen-template{
  .el-header,
  .el-main,
  .el-aside{
    padding: 0;
  }
}
</style>

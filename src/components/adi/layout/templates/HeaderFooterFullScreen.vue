<template>
  <el-container class="fullscreen-template">
    <el-header height='auto'>
      <slot name="header"></slot>
    </el-header>
    <el-main>
      <slot> </slot>
    </el-main>
    <el-footer height='auto'>
      <slot name="footer"></slot>
    </el-footer>
  </el-container>
</template>

<script>
export default {}
</script>

<style lang="scss">
.fullscreen-template {
  .el-header,
  .el-main,
  .el-footer {
    padding: 0;
  }
}
</style>

<template>
  <el-container class="fullscreen-template">
    <el-header height='auto'>
      <slot name="header"></slot>
    </el-header>
    <el-container>
      <el-aside width="400px">
        <slot name="sidebar"></slot>
      </el-aside>
      <el-container>
        <el-main>
          <slot></slot>
        </el-main>
        <el-footer height='auto'>
          <slot name="footer"></slot>
        </el-footer>
      </el-container>
    </el-container>
  </el-container>
</template>

<script>
export default {}
</script>

<style lang="scss">
.fullscreen-template{
  .el-header,
  .el-main,
  .el-aside,
  .el-footer{
    padding: 0;
  }
}
</style>

<template>
  <el-container class="maxwidth-template">
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
.maxwidth-template {
  .el-header,
  .el-main,
  .el-footer {
    padding: 0;
  }

  .el-main{
    max-width: 1080px;
    margin: 0 auto;
  }
}
</style>

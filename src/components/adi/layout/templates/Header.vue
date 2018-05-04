<template>
  <el-container class="header-template">
    <el-header height='auto'>
      <slot name="header"></slot>
    </el-header>
    <el-main>
      <slot> </slot>
    </el-main>
  </el-container>
</template>

<script>
export default {}
</script>

<style lang="scss">
.header-template {
  .el-header,
  .el-main {
    padding: 0;
  }
  .el-main {
    max-width: 1080px;
    margin: 0 auto;
  }
}
</style>

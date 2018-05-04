<template>
  <el-container class="header-sidebar-template">
    <el-header height='auto'>
      <slot name="header"></slot>
    </el-header>
    <el-container>
      <el-aside width="400px">
        <slot name="sidebar"></slot>
      </el-aside>
      <el-main>
        <slot> </slot>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {}
</script>

<style lang="scss">
.header-sidebar-template{
  .el-header, .el-main{
    padding: 0;
  }
}
</style>

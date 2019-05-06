<template>
  <el-container class="fullscreen-template">
    <el-aside width="400px" :class="{'hide-on-phone': (showSidebarOrMain !== 'sidebar')}">
      <slot name="sidebar"></slot>
    </el-aside>
    <el-container>
      <el-header height='auto'>
        <slot name="header"></slot>
      </el-header>
      <el-main :class="{'hide': showSidebarOrMain === 'sidebar'}">
        <slot> </slot>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  props: {
    showSidebarOrMain: String
  }
}
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

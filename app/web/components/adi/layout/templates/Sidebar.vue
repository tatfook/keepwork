<template>
  <el-container class="fullscreen-template">
    <el-aside width="240px" :class="{'hide-on-phone': (showSidebarOrMain !== 'sidebar')}">
      <slot name="sidebar"></slot>
    </el-aside>
    <el-main :class="{'hide': showSidebarOrMain === 'sidebar'}">
      <slot> </slot>
    </el-main>
  </el-container>
</template>

<script>
export default {
  props: {
    showSidebarOrMain: String
  }
}
</script>

<style lang="scss" scoped>
.fullscreen-template {
  .el-header,
  .el-aside {
    padding: 0;
  }
  .el-main {
    padding: 0 32px;
  }
}
</style>

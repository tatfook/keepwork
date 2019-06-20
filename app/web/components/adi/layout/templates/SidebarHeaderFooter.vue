<template>
  <el-container class="fullscreen-template">
    <el-aside width="240px" :class="{'hide-on-phone': (showSidebarOrMain !== 'sidebar')}">
      <slot name="sidebar"></slot>
    </el-aside>
    <el-container>
      <el-header height='auto'>
        <slot name="header"></slot>
      </el-header>
      <el-main :class="{'hide': showSidebarOrMain === 'sidebar'}">
        <slot> </slot>
      </el-main>
      <el-footer height='auto'>
        <slot name="footer"></slot>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'SidebarHeaderFooter',
  props: {
    showSidebarOrMain: String
  }
}
</script>

<style lang="scss" scoped>
.fullscreen-template {
  .el-header,
  .el-footer,
  .el-aside {
    padding: 0;
  }
  .el-main {
    padding: 0 32px;
  }
}
</style>

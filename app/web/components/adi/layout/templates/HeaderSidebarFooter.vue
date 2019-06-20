<template>
  <el-container class="fullscreen-template">
    <el-header height='auto'>
      <slot name="header"></slot>
    </el-header>
    <el-container>
      <el-aside width="240px" :class="{'hide-on-phone': (showSidebarOrMain !== 'sidebar')}">
        <slot name="sidebar"></slot>
      </el-aside>
      <el-container>
        <el-main :class="{'hide': showSidebarOrMain === 'sidebar'}">
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
export default {
  name: 'HeaderSidebarFooter',
  props: {
    showSidebarOrMain: String
  }
}
</script>

<style lang="scss" scoped>
.fullscreen-template {
  .el-header,
  .el-aside,
  .el-footer {
    padding: 0;
  }
  .el-main {
    padding: 0 32px;
  }
}
</style>

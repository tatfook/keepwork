<template>
  <el-container class="fullscreen-template">
    <el-header height='auto'>
      <slot name="header"></slot>
    </el-header>
    <el-container class="fullscreen-template-max-width">
      <el-aside width="240px" :class="{'hide-on-phone': (showSidebarOrMain !== 'sidebar')}">
        <slot name="sidebar"></slot>
      </el-aside>
      <el-main :class="{'hide-on-phone': showSidebarOrMain === 'sidebar'}">
        <slot> </slot>
      </el-main>
    </el-container>
    <el-footer height='auto'>
      <slot name="footer"></slot>
    </el-footer>
  </el-container>
</template>

<script>
export default {
  name: 'HeaderSidebarMaxWidth',
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
  &-max-width {
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }
  @media (max-width: 768px) {
    .el-aside {
      width: 400px !important;
    }
  }
}
</style>

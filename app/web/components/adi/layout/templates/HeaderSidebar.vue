<template>
  <el-container class="fullscreen-template">
    <el-header height='auto'>
      <slot name="header"></slot>
    </el-header>
    <el-container>
      <el-aside width="240px" :class="{'hide-on-phone': (showSidebarOrMain !== 'sidebar')}">
        <slot name="sidebar"></slot>
      </el-aside>
      <el-main :class="{'hide-on-phone': showSidebarOrMain === 'sidebar'}">
        <slot> </slot>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  name: 'HeaderSidebar',
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
  @media (max-width: 768px) {
    .el-aside {
      width: 400px !important;
    }
  }
}
</style>

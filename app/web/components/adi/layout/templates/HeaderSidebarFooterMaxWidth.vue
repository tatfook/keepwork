<template>
  <el-container class="fullscreen-template">
    <el-header height='auto'>
      <slot name="header"></slot>
    </el-header>
    <el-container class="fullscreen-template-max-width">
      <el-aside width="400px" :class="{'hide-on-phone': (showSidebarOrMain !== 'sidebar')}">
        <slot name="sidebar"></slot>
      </el-aside>
      <el-main :class="{'hide': showSidebarOrMain === 'sidebar'}">
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

<style lang="scss">
.fullscreen-template {
  .el-header,
  .el-main,
  .el-aside,
  .el-footer {
    padding: 0;
  }
  &-max-width {
    max-width: 1200px;
    margin: 0 auto;
    width: 100%;
  }
}
</style>

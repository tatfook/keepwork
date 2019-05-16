<template>
  <el-container class="content-max-width-template">
    <el-aside width="400px" :class="{'hide-on-phone': (showSidebarOrMain !== 'sidebar')}">
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

<style lang="scss">
.content-max-width-template {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  .el-main,
  .el-aside {
    padding: 0;
  }
}
</style>

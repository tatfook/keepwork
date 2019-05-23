<template>
  <el-container class="maxwidth-template">
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
.maxwidth-template{
  padding: 0;
  max-width: 1180px;
  width: 100%;
  margin: 0 auto;
}
</style>

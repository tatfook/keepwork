<template>
  <el-container>
    <el-header height='auto'>
      <slot name="header"></slot>
    </el-header>
    <el-main>
      <slot> </slot>
    </el-main>
    <el-footer height='auto'>
      <slot name="footer"></slot>
    </el-footer>
  </el-container>
</template>

<script>
export default {}
</script>


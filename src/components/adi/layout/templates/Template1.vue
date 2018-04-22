<template>
  <el-container>
    <el-header height='auto'>
      <slot name="header"></slot>
    </el-header>
    <el-main>
      <slot> </slot>
    </el-main>
  </el-container>
</template>

<script>
export default {}
</script>


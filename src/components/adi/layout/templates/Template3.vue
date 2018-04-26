<template>
  <el-container>
    <el-header height='auto'>
      <slot name="header"></slot>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <slot name="sidebar"></slot>
      </el-aside>
      <el-main>
        <slot> </slot>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {}
</script>


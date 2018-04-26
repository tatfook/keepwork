<template>
  <el-container class="basic-fullscreen-template">
    <el-main>
      <slot> </slot>
    </el-main>
  </el-container>
</template>

<script>
export default {}
</script>

<style lang="scss">
.basic-fullscreen-template{
  .el-main{
    padding: 0;
  }
}
</style>

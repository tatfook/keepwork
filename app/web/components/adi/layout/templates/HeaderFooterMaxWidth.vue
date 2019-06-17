<template>
  <el-container class="maxwidth-template">
    <el-header height='auto'>
      <slot name="header"></slot>
    </el-header>
    <el-main>
      <div class="maxwidth-main">
        <slot> </slot>
      </div>
    </el-main>
    <el-footer height='auto'>
      <slot name="footer"></slot>
    </el-footer>
  </el-container>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.maxwidth-template {
  .el-header,
  .el-main,
  .el-footer {
    padding: 0;
  }

  .el-main {
    max-width: 1130px;
    width: 100%;
    margin: 0 auto;
    overflow: hidden;
    .maxwidth-main {
      [data-mod] {
        margin: 0 auto;
        max-width: 1080px;
        overflow: hidden;
      }
      [data-mod="ModMarkdown"] {
        overflow: auto;
        max-width: 100%;
      }
    }
  }
}
</style>

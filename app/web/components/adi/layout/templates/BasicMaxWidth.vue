<template>
  <el-container class="maxwidth-template">
    <el-main>
      <div class="maxwidth-main">
        <slot></slot>
      </div>
    </el-main>
  </el-container>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.maxwidth-template{
  .el-main {
    padding: 0;
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

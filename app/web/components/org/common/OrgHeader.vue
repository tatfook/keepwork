<template>
  <div class="org-header">
    <el-menu class="org-header-menu" mode="horizontal">
      <el-menu-item index='1'>
        <img class="org-header-brand" src="@/assets/img/logo_old.svg" alt="KeepWork">
      </el-menu-item>
      <el-menu-item index='2'>
        机构名称
      </el-menu-item>
      <el-menu-item index='3' class="pull-right">
        退出
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script>
export default {
  name: 'OrgHeader'
}
</script>
<style lang="scss">
.org-header {
  border-bottom: solid 1px #e6e6e6;
  &-menu {
    padding: 12px 0;
    max-width: 1200px;
    margin: 0 auto;
    &.el-menu--horizontal {
      border-bottom: none;
    }
    & > .el-menu-item {
      height: 48px;
      line-height: 48px;
      font-size: 18px;
      color: #333;
      &.pull-right {
        float: right;
        font-size: 14px;
      }
    }
  }
  &-brand {
    height: 48px;
    width: 150px;
    object-fit: contain;
  }
}
</style>

<template>
  <div class="org-header">
    <el-menu>
      <el-menu-item index='1'>
        <img class="org-header-brand" src="@/assets/img/logo_old.svg" alt="KeepWork">
      </el-menu-item>
      <el-menu-item index='2'>
        机构名称
      </el-menu-item>
      <el-menu-itme class="org-header-right">
        退出
      </el-menu-itme>
    </el-menu>
  </div>
</template>
<script>
export default {
  name: 'OrgHeader'
}
</script>

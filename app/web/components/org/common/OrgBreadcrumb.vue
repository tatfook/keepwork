<template>
  <div class="org-breadcrumb">
    <div class="org-breadcrumb-main">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: toHome }">上课</el-breadcrumb-item>
        <el-breadcrumb-item>课程包</el-breadcrumb-item>
        <el-breadcrumb-item>课程包</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
  </div>
</template>


<script>
export default {
  name: 'OrgBreadcrumb',
  props: {},
  mounted() {
    console.log(this.$route)
  },
  computed: {
    toHome() {
      return this.$route.name.indexOf('OrgTeacher') !== -1 ? 'OrgTeacher' : 'OrgStudent'
    }
  }
}
</script>

<style lang="scss" scoped>
.org-breadcrumb {
  background: #fff;
  color: #999;
  border-bottom: solid 1px #e6e6e6;
  &-main {
    max-width: 1200px;
    margin: 0 auto;
    box-sizing: border-box;
    padding-left: 20px;
    .el-breadcrumb {
      height: 58px;
      line-height: 58px;
    }
  }
}
</style>

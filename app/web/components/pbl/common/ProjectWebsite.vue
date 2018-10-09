<template>
  <div class="project-website">
    <el-card class="project-website-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="project-website-card-label">项目网站</span>
        <el-button class="project-website-card-button" type="text"><i class="el-icon-edit-outline"></i></el-button>
      </div>
      <p class="project-website-title">这个项目的网站</p>
      <p class="project-website-info">{{projectUrl}}</p>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'ProjectWebsite',
  props: {
    originProjectName: {
      type: String,
      required: true
    },
    originProjectUsername: {
      type: String,
      required: true
    }
  },
  computed: {
    origin() {
      return window.location.origin
    },
    projectUrl(){
      let origin = this.origin
      let originProjectName = this.originProjectName
      let originProjectUsername = this.originProjectUsername
      return origin + '/' + originProjectUsername + '/' + originProjectName
    }
  }
}
</script>
<style lang="scss">
.project-website {
  &-card {
    &-label {
      font-weight: bold;
    }
    &-button {
      float: right;
      padding: 3px 0;
      color: #909399;
    }
    .el-card__body {
      padding: 24px 16px;
    }
  }
  &-title {
    margin: 0;
    font-size: 14px;
    color: #303133;
  }
  &-info {
    font-size: 12px;
    color: #909399;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 4px 0 0;
  }
}
</style>

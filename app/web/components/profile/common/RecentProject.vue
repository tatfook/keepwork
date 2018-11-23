<template>
  <div class="recent-project">
    <el-card class="recent-project-card" shadow="never">
      <div slot="header" class="clearfix">
        <span>最近项目</span>
        <router-link class="recent-project-card-header-button" :to='{name:"ProfileProjectPage"}'>查看更多<i class="el-icon-arrow-right"></i></router-link>
      </div>
      <div class="recent-project-list">
        <project-cell class="recent-project-list-item" v-for="(project, index) in recentProject" :key="index" :project='project'></project-cell>
      </div>
    </el-card>
  </div>
</template>
<script>
import ProjectCell from '@/components/common/ProjectCell'
export default {
  name: 'RecentProject',
  data() {
    return {
      recentProject: [
        {
          name: '告诉果果',
          name_title: '告诉果果',
          visit: 2687,
          star: 1746,
          comment: 500,
          extra: {
            imageUrl:
              'https://git.keepwork.com/gitlab_rls_qizai/world_base32_5gozfzuyuxsltghjuoholen44wk3r2eartul7by/raw/master/preview.jpg'
          },
          user: {
            username: 'kaitlyn'
          }
        },
        {
          name: '告诉果果',
          name_title: '告诉果果',
          visit: 2687,
          star: 1746,
          comment: 500,
          extra: {
            imageUrl:
              'https://git.keepwork.com/gitlab_rls_qizai/world_base32_5gozfzuyuxsltghjuoholen44wk3r2eartul7by/raw/master/preview.jpg'
          },
          user: {
            username: 'kaitlyn'
          }
        },
        {
          name: '告诉果果',
          name_title: '告诉果果',
          visit: 2687,
          star: 1746,
          comment: 500,
          extra: {
            imageUrl:
              'https://git.keepwork.com/gitlab_rls_qizai/world_base32_5gozfzuyuxsltghjuoholen44wk3r2eartul7by/raw/master/preview.jpg'
          },
          user: {
            username: 'kaitlyn'
          }
        }
      ]
    }
  },
  components: {
    ProjectCell
  }
}
</script>
<style lang="scss">
.recent-project {
  &-card {
    .el-card__header {
      font-weight: bold;
      padding: 18px 16px;
    }
    .el-card__body {
      padding: 0 0 12px;
    }
    &-header {
      &-button {
        float: right;
        padding: 3px 0;
        font-size: 12px;
        color: #909399;
        text-decoration: none;
        font-weight: normal;
      }
      &-button + &-button {
        margin-right: 6px;
      }
    }
  }
  &-list {
    display: flex;
    margin-bottom: -33px;
    & &-item {
      border: none;
    }
  }
}
</style>

<template>
  <div class="recent-project">
    <el-card class="recent-project-card" shadow="never">
      <div slot="header" class="clearfix">
        <span>{{$t("profile.rencentProject")}}</span>
        <router-link class="recent-project-card-header-button" :to='{name:"ProfileProjectPage"}'>{{$t("profile.more")}}<i class="el-icon-arrow-right"></i></router-link>
      </div>
      <div class="recent-project-list" v-if="!isProjectEmpty">
        <project-cell class="recent-project-list-item" v-for="(project, index) in recentProject" :key="index" :project='project'></project-cell>
      </div>
      <div class="recent-project-empty" v-if="isProjectEmpty">
        <img src="@/assets/img/default_project.png" alt="">
        <p>
          {{isLoginUserEditable ? $t("profile.noProjectToShow") : $t("profile.noContentForProject")}}
          <a v-if="isLoginUserEditable" class="recent-project-empty-anchor" href="/pbl/project/new" target="_blank">{{$t("profile.createNewProject")}}</a>
        </p>
      </div>
    </el-card>
  </div>
</template>
<script>
import moment from 'moment'
import ProjectCell from '@/components/common/ProjectCell'
import { mapActions, mapGetters } from 'vuex';
export default {
  name: 'RecentProject',
  props: {
    nowUserDetail: {
      type: Object,
      required: true
    },
    isLoginUserEditable: {
      type: Boolean,
      default: false
    }
  },
  created() {
    this.pblGetUserProjects({ userId: this.nowUserId })
  },
  computed: {
    ...mapGetters({
      userProjects: 'pbl/userProjects',
    }),
    nowUserId() {
      return _.get(this.nowUserDetail, 'id')
    },
    userProjectList() {
      let userId = this.nowUserId
      return _.get(this.userProjects({ userId }), 'rows', [])
    },
    sortedProjectList() {
      return _.sortBy(this.userProjectList, project => -moment(project.updatedAt).valueOf())
    },
    recentProject() {
      return _.slice(this.sortedProjectList, 0, 3)
    },
    isProjectEmpty() {
      return Boolean(
        this.recentProject && this.recentProject.length == 0
      )
    },
  },
  methods: {
    ...mapActions({
      pblGetUserProjects: 'pbl/getUserProjects'
    })
  },
  watch: {
    nowUserDetail() {
      this.pblGetUserProjects({ userId: this.nowUserId })
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
      margin: 0 4px 16px;
    }
  }
  &-empty {
    color: #909399;
    font-size: 14px;
    text-align: center;
    padding: 44px 0 16px;
    &-anchor {
      color: #2397f3;
      text-decoration: none;
    }
  }
}
</style>
<style lang="scss">
@media only screen and (max-width: 991px) {
  .recent-project {
    &-card {
      border-radius: 0;
      border-width: 1px 0;
      .el-card__header {
        padding: 9px 16px;
      }
    }
    &-list {
      overflow: auto;
      padding: 8px 16px;
      & &-item {
        margin-right: 8px;
      }
    }
  }
}
</style>

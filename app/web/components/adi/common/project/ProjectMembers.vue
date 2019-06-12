<template>
  <div class="project-members">
    <el-tabs class="project-members-tabs" type="card">
      <el-tab-pane :label="$t('project.applicants')">
        <project-applied-list :projectId='projectId'></project-applied-list>
      </el-tab-pane>
      <el-tab-pane :label="$t('project.projectMembers')">
        <project-joined-members-list :projectDetail='projectDetail' :projectId='projectId'></project-joined-members-list>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import ProjectAppliedList from './ProjectAppliedList'
import ProjectJoinedMembersList from './ProjectJoinedMembersList'
export default {
  name: 'ProjectMembers',
  props: {
    projectId: {
      required: true
    },
    projectDetail: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      inviteUsername: ''
    }
  },
  methods: {
    invitToProject() {
      console.log(this.inviteUsername)
    }
  },
  components: {
    ProjectAppliedList,
    ProjectJoinedMembersList
  }
}
</script>
<style lang="scss">
.project-members {
  width: 875px;
  &-invite {
    margin-bottom: 24px;
    .el-input__inner {
      color: #909399;
    }
    .el-input-group__append {
      color: #303133;
      cursor: pointer;
      background-color: transparent;
      padding: 0;
      width: 75px;
      .el-button {
        width: 100%;
        height: 100%;
        border-radius: 0;
        margin-left: 0;
        background-color: #f5f5f5;
      }
      .el-button.is-disabled {
        opacity: 0.8;
        background-color: #c8c9cc;
        color: #303133;
        border-color: #c8c9cc;
      }
    }
  }
  &-tabs {
    .el-tabs__header {
      padding-left: 0;
      margin-bottom: 0;
      border-bottom: none;
      .el-tabs__nav {
        border-radius: 8px 8px 0 0;
        border-width: 0 0 0 1px;
      }
      .el-tabs__item {
        height: 48px;
        line-height: 48px;
        padding: 0 14px;
        color: #606266;
        border-bottom-color: #e4e7ed;
        background-color: #f5f5f5;
        border-radius: 10px 10px 0px 0px;
        border: 1px solid #e4e7ed;
        margin-left: -1px;
      }
      .el-tabs__item:first-child {
        margin-left: 0;
      }
      .el-tabs__nav-wrap .el-tabs__item:last-child,
      .el-tabs__nav-wrap .el-tabs__item:nth-child(2) {
        padding: 0 14px;
      }
      .el-tabs__item.is-active {
        background-color: #fff;
        border-bottom-color: #e4e7ed;
        color: #2296f3;
      }
    }
  }
}
</style>

<template>
  <div class="project-members">
    <div class="project-members-invite">
      <el-input placeholder="输入用户名进行邀请" v-model="inviteUsername">
        <template slot="append">
          <el-button type="info" @click="invitToProject" :disabled="!inviteUsername">邀请</el-button>
        </template>
      </el-input>
    </div>
    <el-tabs class="project-members-tabs" type="card">
      <el-tab-pane label="申请列表">
        <project-applied-list></project-applied-list>
      </el-tab-pane>
      <el-tab-pane label="项目成员">
        <project-joined-members-list></project-joined-members-list>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import ProjectAppliedList from './ProjectAppliedList'
import ProjectJoinedMembersList from './ProjectJoinedMembersList'
export default {
  name: 'ProjectMembers',
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
        background-color: #f5f5f5;
      }
      .el-tabs__item {
        height: 48px;
        line-height: 48px;
        padding: 0 14px;
        color: #606266;
        border-bottom-color: #e4e7ed;
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

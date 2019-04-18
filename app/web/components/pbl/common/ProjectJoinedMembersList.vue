<template>
  <div class="project-joined-members-list">
    <el-table v-if="type === 'table'" :data="filterOwnerMemberList" border style="width: 100%" v-loading='isLoading' class="project-joined-members-list-table">
      <el-table-column prop="username" :label="$t('project.username')" width="357">
      </el-table-column>
      <el-table-column :label="$t('project.joinAt')" width="357">
        <template slot-scope="scope">{{scope.row.updatedAt | formatDate(formatType)}}</template>
      </el-table-column>
      <el-table-column :label="$t('project.operations')" class-name='project-joined-members-list-table-operate' width="160">
        <template slot-scope="scope">
          <el-button size="mini" @click="deleteFromProject(scope.row)">{{$t('project.removeMember')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-card v-if="type === 'card'" class="project-joined-members-list-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="project-joined-members-list-card-title">{{$t("project.projectMembers")}}</span>
      </div>
      <div class="project-joined-members-list-card-created">
        <img class="project-joined-members-list-card-profile" :src="projectOwnerPortrait || defaultPortrait" alt="" @click="goCreatorHome()">
        <span class="project-joined-members-list-card-username" :title="originProjectUsername">{{originProjectUsername}}</span>
        <span class="project-joined-members-list-card-label">{{$t("project.creator")}}</span>
      </div>
      <div v-if="filterOwnerMemberList && filterOwnerMemberList.length" class="project-joined-members-list-card-profiles">
        <img @click="goMemberHome(member)" v-for="(member, index) in filterOwnerMemberList" :key="index" class="project-joined-members-list-card-profile project-joined-members-list-card-profiles-item" :src='member.portrait || defaultPortrait' :title='member.username' alt="">
      </div>
      <div v-else class="project-joined-members-list-card-profiles-empty">{{$t("project.noOtherMembers")}}</div>
    </el-card>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import dayjs from 'dayjs'
export default {
  name: 'ProjectJoinedMembersList',
  props: {
    projectId: {
      required: true
    },
    type: {
      type: String,
      default: 'table',
      validator: function(value) {
        return ['table', 'card'].indexOf(value) !== -1
      }
    },
    projectOwnerPortrait: String,
    originProjectUsername: String,
    projectDetail: {
      type: Object,
      required: true
    }
  },
  async created() {
    this.isLoading = true
    await this.getProjectMember({
      objectId: this.projectId,
      objectType: 5
    })
    this.isLoading = false
  },
  data() {
    return {
      formatType: 'YYYY/MM/DD',
      isLoading: false,
      defaultPortrait: require('@/assets/img/default_portrait.png')
    }
  },
  computed: {
    ...mapGetters({
      pblProjectMemberList: 'pbl/projectMemberList'
    }),
    projectOwnerUserId() {
      return _.get(this.projectDetail, 'userId')
    },
    memberList() {
      return this.pblProjectMemberList({ projectId: this.projectId })
    },
    filterOwnerMemberList() {
      return _.filter(
        this.memberList,
        member => member.userId !== this.projectOwnerUserId
      )
    }
  },
  methods: {
    ...mapActions({
      getProjectMember: 'pbl/getProjectMember',
      deleteMember: 'pbl/deleteMember'
    }),
    goMemberHome(member){
      window.open(`${window.location.origin}/u/${member.username}`)
    },
    goCreatorHome(){
      window.open(`${window.location.origin}/u/${this.originProjectUsername}`)
    },
    async deleteFromProject(memberDetail) {
      let { id } = memberDetail
      this.isLoading = true
      await this.deleteMember({
        id,
        objectId: this.projectId,
        objectType: 5
      })
        .then(() => {
          this.isLoading = false
          this.$message({
            type: 'success',
            message: '移除成功'
          })
        })
        .catch(error => {
          this.isLoading = false
          console.log(error)
        })
    }
  },
  filters: {
    formatDate(date, formatType) {
      return dayjs(date).format(formatType)
    }
  }
}
</script>
<style lang="scss">
.project-joined-members-list {
  .el-table__row .cell {
    color: #303133;
  }
  .cell {
    padding: 0 24px;
  }
  .el-table--border th:first-child .cell,
  .el-table--border td:first-child .cell {
    padding-left: 24px;
  }
  &-table {
    td,
    th {
      padding: 4px 0;
      font-weight: normal;
    }
    &-operate {
      .cell {
        padding: 0 12px;
        text-align: center;
      }
      .el-button--mini {
        padding: 3px 19px;
      }
    }
  }
  &-card {
    &-title {
      font-weight: bold;
    }
    &-profile {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      object-fit: cover;
      cursor: pointer;
    }
    &-created {
      height: 96px;
      display: flex;
      align-items: center;
      font-size: 16px;
      color: #303133;
      border-bottom: 1px solid #e8e8e8;
      padding: 0 16px;
    }
    &-label {
      font-size: 12px;
      height: 20px;
      line-height: 20px;
      color: #909399;
      border: 1px solid #e8e8e8;
      padding: 0 8px;
      border-radius: 4px;
    }
    &-username {
      margin: 0 16px;
      flex: 1;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    &-profiles {
      padding: 16px 8px;
      &-item {
        padding: 8px;
        cursor: pointer;
      }
    }
    &-profiles-empty {
      padding: 16px 8px;
      text-align: center;
    }
    .el-card__body {
      padding: 0;
    }
  }
}

@media (max-width: 768px) {
  .project-joined-members-list {
    &-card {
      &-profile {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        object-fit: cover;
      }
      &-created {
        height: 80px;
        display: flex;
        align-items: center;
        font-size: 16px;
        color: #303133;
        border-bottom: 1px solid #e8e8e8;
        padding: 0 16px;
      }
    }
  }
}
</style>

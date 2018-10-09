<template>
  <div class="project-joined-members-list">
    <el-table v-if="type === 'table'" :data="memberList" border style="width: 100%" v-loading='isLoading' class="project-joined-members-list-table">
      <el-table-column prop="username" label="成员" width="357">
      </el-table-column>
      <el-table-column label="加入时间" width="357">
        <template slot-scope="scope">{{scope.row.updatedAt | formatDate(formatType)}}</template>
      </el-table-column>
      <el-table-column label="操作" class-name='project-joined-members-list-table-operate' width="160">
        <template slot-scope="scope">
          <el-button size="mini" @click="deleteFromProject(scope.row)">移出</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-card v-if="type === 'card'" class="project-joined-members-list-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="project-joined-members-list-card-title">项目成员</span>
      </div>
      <div class="project-joined-members-list-card-created">
        <img class="project-joined-members-list-card-profile" :src="projectOwnerPortrait || projectOwnerPortrait" alt="">
        <span class="project-joined-members-list-card-username">迟语</span>
        <span class="project-joined-members-list-card-label">创建者</span>
      </div>
      <div class="project-joined-members-list-card-profiles">
        <img v-for="(member, index) in memberList" :key="index" class="project-joined-members-list-card-profile project-joined-members-list-card-profiles-item" :src='member.portrait || defaultPortrait' :title='member.username' alt="">
      </div>
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
    projectOwnerPortrait: String
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
    memberList() {
      return this.pblProjectMemberList({ projectId: this.projectId })
    }
  },
  methods: {
    ...mapActions({
      getProjectMember: 'pbl/getProjectMember',
      deleteMember: 'pbl/deleteMember'
    }),
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
    }
    &-profiles {
      padding: 16px 8px;
      &-item {
        padding: 8px;
      }
    }
    .el-card__body {
      padding: 0;
    }
  }
}
</style>

<template>
  <div class="project-joined-members-list">
    <el-table :data="memberList" border style="width: 100%" v-loading='isLoading' class="project-joined-members-list-table">
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
      isLoading: false
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
}
</style>

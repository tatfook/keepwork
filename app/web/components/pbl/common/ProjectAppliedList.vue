<template>
  <div class="project-applied-list">
    <el-table :data="appliedList" border style="width: 100%" class="project-applied-list-table" v-loading='isLoading'>
      <el-table-column prop="object.username" :label="$t('project.username')" width="160">
      </el-table-column>
      <el-table-column :label="$t('project.applyAt')" width="160">
        <template slot-scope="scope">{{scope.row.updatedAt | formatDate(formatType)}}</template>
      </el-table-column>
      <el-table-column prop="legend" :label="$t('project.message')">
      </el-table-column>
      <el-table-column :label="$t('project.operations')" class-name='project-applied-list-table-operate' width="160">
        <template slot-scope="scope">
          <el-button size="mini" @click="approveApply(scope.row)" v-if="scope.row.state == 0">{{$t('project.approve')}}</el-button>
          <el-button size="mini" @click="rejectApply(scope.row)" v-if="scope.row.state == 0">{{$t('project.reject')}}</el-button>
          <span class="project-applied-list-table-reject" v-if="scope.row.state == 2">{{$t('project.rejected')}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import dayjs from 'dayjs'
export default {
  name: 'ProjectAppliedList',
  props: {
    projectId: {
      required: true
    }
  },
  async created() {
    this.isLoading = true
    await this.getProjectApplyList({
      objectId: this.projectId,
      objectType: 5,
      applyType: 0
    })
    this.isLoading = false
  },
  data() {
    return {
      isLoading: false,
      formatType: 'YYYY/MM/DD'
    }
  },
  computed: {
    ...mapGetters({
      pblProjectApplyList: 'pbl/projectApplyList'
    }),
    allAppliedList() {
      return this.pblProjectApplyList({ projectId: this.projectId })
    },
    appliedList() {
      return _.filter(this.allAppliedList, obj => obj.state != 1)
    }
  },
  methods: {
    ...mapActions({
      getProjectApplyList: 'pbl/getProjectApplyList',
      pblChangeApplyState: 'pbl/changeApplyState'
    }),
    async changeApplyState({ applyDetail, state, successMessage }) {
      let { id } = applyDetail
      this.isLoading = true
      await this.pblChangeApplyState({
        id,
        state: state,
        objectId: this.projectId,
        objectType: 5,
        applyType: 0
      })
        .then(() => {
          this.isLoading = false
          this.$message({
            type: 'success',
            message: successMessage || '操作成功'
          })
        })
        .catch(error => {
          this.isLoading = false
          console.log(error)
        })
    },
    async approveApply(applyDetail) {
      this.changeApplyState({
        applyDetail,
        state: 1,
        successMessage: '成功同意成员加入项目！'
      })
    },
    async rejectApply(applyDetail) {
      this.changeApplyState({
        applyDetail,
        state: 2,
        successMessage: '成功拒绝成员加入项目！'
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
.project-applied-list {
  .el-button + .el-button {
    margin-left: 8px;
  }
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
        width: 60px;
        padding: 3px;
      }
    }
    &-reject {
      color: #c0c4cc;
      font-size: 12px;
    }
  }
}
</style>

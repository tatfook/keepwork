<template>
  <div class="project-applied-list">
    <el-table :data="appliedList" border style="width: 100%" class="project-applied-list-table">
      <el-table-column prop="extra.username" label="成员" width="160">
      </el-table-column>
      <el-table-column label="申请时间" width="160">
        <template slot-scope="scope">{{scope.row.updatedAt | formatDate(formatType)}}</template>
      </el-table-column>
      <el-table-column prop="legend" label="留言">
      </el-table-column>
      <el-table-column label="操作" class-name='project-applied-list-table-operate' width="160">
        <template slot-scope="scope">
          <el-button size="mini">通过</el-button>
          <el-button size="mini">拒绝</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import dayjs from 'dayjs'
export default {
  name: 'ProjectAppliedList',
  data() {
    return {
      formatType: 'YYYY/MM/DD',
      appliedList: [
        {
          legend: '申请加入项目',
          createdAt: '2018-09-21T07:33:49.000Z',
          updatedAt: '2018-09-21T07:33:49.000Z',
          extra: {
            username: 'evanna-yl'
          }
        },
        {
          legend: '我比较擅长场景搭建，希望加入这个项目一起进步，共同成长！',
          createdAt: '2018-09-21T07:33:49.000Z',
          updatedAt: '2018-09-21T07:33:49.000Z',
          extra: {
            username: 'evanna-yl'
          }
        }
      ]
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
  }
}
</style>

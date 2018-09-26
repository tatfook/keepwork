<template>
  <div class="project-joined-members-list">
    <el-table :data="appliedList" border style="width: 100%" class="project-joined-members-list-table">
      <el-table-column prop="extra.username" label="成员" width="292">
      </el-table-column>
      <el-table-column label="加入时间" width="292">
        <template slot-scope="scope">{{scope.row.updatedAt | formatDate(formatType)}}</template>
      </el-table-column>
      <el-table-column label="操作" class-name='project-joined-members-list-table-operate'>
        <template slot-scope="scope">
          <el-button size="mini">移出</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import dayjs from 'dayjs'
export default {
  name: 'ProjectJoinedMembersList',
  data() {
    return {
      formatType: 'YYYY/MM/DD',
      appliedList: [
        {
          createdAt: '2018-09-21T07:33:49.000Z',
          updatedAt: '2018-09-21T07:33:49.000Z',
          extra: {
            username: 'evanna-yl'
          }
        },
        {
          createdAt: '2018-09-21T07:33:49.000Z',
          updatedAt: '2018-09-21T07:33:49.000Z',
          extra: {
            username: 'kaitlyn'
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

<template>
  <div class="historical-member">
    <historical-header />
    <div class="filters">
      <student-filters @change="getHistoryStudents" />
    </div>
    <div class="count-row">
      学生数：{{tableData.length}}
      <div class="operates">
        <el-button size="small" @click="toReactivate">激活用户</el-button>
      </div>
    </div>
    <div class="container">
      <el-table border @selection-change="handleSelectionChange" :data="tableData">
        <el-table-column type="selection" width="39"></el-table-column>
        <el-table-column prop="realname" :label="$t('org.nameLabel')" width="64">
        </el-table-column>
        <el-table-column prop="username" :label="$t('org.usernameLabel')" width="100">
        </el-table-column>
        <el-table-column prop="typeText" label="用户类型" width="90">
        </el-table-column>
        <el-table-column prop="parentPhoneNum" label="家长手机号" width="110">
        </el-table-column>
        <el-table-column prop="classNames" :label="$t('org.classLabel')" :show-overflow-tooltip="true">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import HistoricalHeader from './common/HistoricalHeader'
import StudentFilters from './common/StudentFilters'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'HistoricalMember',
  data() {
    return {
      multipleSelection: [],
    }
  },
  computed: {
    ...mapGetters({
      historyStudents: 'org/historyStudents',
    }),
    tableData() {
      return _.map(this.historyStudents.rows, student => {
        const { type } = student
        return {
          ...student,
          typeText: type == 2 ? '正式' : '试听',
        }
      })
    },
  },
  methods: {
    ...mapActions({
      orgGetHistoryStudents: 'org/getHistoryStudents',
      checkCurrentOrgExpire: 'org/checkCurrentOrgExpire',
      setReactivateParams: 'org/setReactivateParams',
    }),
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    async getHistoryStudents(params) {
      await this.orgGetHistoryStudents(params)
    },
    async testIsValid() {
      if (await this.checkCurrentOrgExpire({ toExpire: false })) return false
      const count = this.multipleSelection.length
      if (count === 0) {
        this.$message({
          type: 'error',
          message: '请选择学生',
        })
        return false
      }
      return true
    },
    async toReactivate() {
      const isValid = await this.testIsValid()
      if (!isValid) return
      this.setReactivateParams({
        students: _.map(this.multipleSelection, item => {
          return {
            ...item,
            id: item.memberId,
            users: {
              username: item.username,
            },
          }
        }),
      })
      this.$router.push({
        name: 'ReActivate',
      })
    },
  },
  components: {
    HistoricalHeader,
    StudentFilters,
  },
}
</script>
<style lang="scss" scoped>
.historical-member {
  background-color: #fff;
  font-size: 14px;
  .filters,
  .container {
    padding: 0 24px;
  }
  .count-row {
    padding: 20px 24px 16px;
    display: flex;
  }
  .operates {
    flex: 1;
    text-align: right;
  }
}
</style>

<template>
  <div class="student-list" v-loading="isLoading">
    <div class="student-list-header" v-if="orgStudentsCount > 0">
      <div class="student-list-header-selector">
        {{$t('org.classSelector')}}
        <el-select v-model="selectedClassId" @change="getStudentWithClassId">
          <el-option :label="$t('org.all')" :value="undefined">
          </el-option>
          <el-option v-for="(classItem, index) in orgClasses" :key="index" :label="classItem.name" :value="classItem.id">
          </el-option>
        </el-select>
      </div>
      <div class="student-list-header-selector">
        用户类型：
        <el-select v-model="selectedType" @change="getStudentWithClassId">
          <el-option :label="$t('org.all')" :value="undefined">
          </el-option>
          <el-option label="试听" :value="1"></el-option>
          <el-option label="正式" :value="2"></el-option>
        </el-select>
      </div>
      <div class="student-list-header-search">
        <el-input placeholder="按学生姓名、用户名搜索" clearable suffix-icon="el-icon-search" v-model.trim="searchedUsername" @change="getStudentWithClassId">
        </el-input>
      </div>
    </div>
    <div v-if="orgStudentsCount > 0" class="student-list-count">{{$t('org.IncludeStudents') + orgStudents.length + $t('org.studentCountUnit')}}
      <div class="student-list-count-operates">
        <formal-code-user type="beFormal" :students="multipleSelection" />
        <formal-code-user type="renew" :students="multipleSelection" />
      </div>
    </div>
    <el-table v-if="orgStudentsCount > 0" class="student-list-table" border @selection-change="handleSelectionChange" :data="orgStudentsWithClassesString" header-row-class-name="student-list-table-header">
      <el-table-column type="selection" width="39"></el-table-column>
      <el-table-column prop="realname" :label="$t('org.nameLabel')" width="64">
      </el-table-column>
      <el-table-column prop="users.username" :label="$t('org.usernameLabel')" width="100">
      </el-table-column>
      <el-table-column prop="typeText" label="用户类型" width="90">
      </el-table-column>
      <el-table-column prop="parentPhoneNum" label="家长手机号" width="110">
      </el-table-column>
      <el-table-column prop="classesString" :label="$t('org.classLabel')" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="endTimeText" label="到期时间" width="129" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="id" :label="$t('org.operationLabel')" width="244">
        <template slot-scope="scope">
          <div class="student-list-table-operations">
            <div class="student-list-table-button student-list-table-button-primary" @click="toEditPage(scope.row)">{{$t('org.Edit')}}</div>
            <div class="student-list-table-button" @click="confirmRemoveStudent(scope.row)">{{$t('org.Remove')}}</div>
            <div class="student-list-table-button" @click="showChangeDialog(scope.row)">修改密码</div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="student-list-empty" v-if="orgStudentsCount == 0">
      <p class="student-list-empty-info">{{$t('org.noStudents')}}</p>
    </div>
    <change-password-dialog :isChangeDialogVisible="isChangeDialogVisible" :changingMember="changingMember" @close="isChangeDialogVisible = false" />
  </div>
</template>
<script>
import moment from 'moment'
import { mapGetters, mapActions } from 'vuex'
import ChangePasswordDialog from '@/components/org/admin/common/ChangePasswordDialog'
import FormalCodeUser from './common/FormalCodeUser'
export default {
  name: 'StudentList',
  components: {
    ChangePasswordDialog,
    FormalCodeUser,
  },
  async mounted() {
    await Promise.all([this.getStudentWithClassId(), this.getOrgCodesStatus()])
  },
  data() {
    return {
      multipleSelection: [],
      selectedClassId: undefined,
      selectedType: undefined,
      searchedUsername: '',
      isLoading: false,
      isChangeDialogVisible: false,
      changingMember: {},
    }
  },
  computed: {
    ...mapGetters({
      currentOrg: 'org/currentOrg',
      getOrgUserCountById: 'org/getOrgUserCountById',
      getOrgClassesById: 'org/getOrgClassesById',
      getOrgStudentsByClassId: 'org/getOrgStudentsByClassId',
    }),
    orgId() {
      return _.get(this.currentOrg, 'id')
    },
    orgStudents() {
      return (
        this.getOrgStudentsByClassId({
          orgId: this.orgId,
          classId: this.selectedClassId,
        }) || []
      )
    },
    orgStudentsCount() {
      return _.get(this.getOrgUserCountById({ id: this.orgId }), 'studentCount', 0)
    },
    orgStudentsWithClassesString() {
      return _.map(this.orgStudents, student => {
        const { type, endTime, lessonOrganizationClasses } = student
        const classNameArr = _.map(lessonOrganizationClasses, classDetail => classDetail.name)
        return {
          ...student,
          classesString: _.join(classNameArr, '、'),
          endTimeText: moment(endTime).format('YYYY/MM/DD'),
          typeText: type == 2 ? '正式' : '试听',
        }
      })
    },
    orgClasses() {
      return this.getOrgClassesById({ id: this.orgId }) || []
    },
    selectedFormalStudents() {
      return _.filter(this.multipleSelection, student => student.type == 2)
    },
    selectedTryStudents() {
      return _.filter(this.multipleSelection, student => student.type != 2)
    },
  },
  methods: {
    ...mapActions({
      getOrgStudentList: 'org/getOrgStudentList',
      orgCreateNewMember: 'org/createNewMember',
      getOrgCodesStatus: 'org/getOrgCodesStatus',
    }),
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    showChangeDialog(studentDetail) {
      let {
        realname,
        users: { username: memberName },
        classId,
        memberId,
      } = studentDetail
      this.changingMember = {
        realname,
        memberName,
        classId,
        memberId,
      }
      this.isChangeDialogVisible = true
    },
    async getStudentWithClassId() {
      this.isLoading = true
      try {
        await this.getOrgStudentList({
          classId: this.selectedClassId,
          type: this.selectedType,
          username: this.searchedUsername ? this.searchedUsername : undefined,
        })
      } catch (error) {}
      this.isLoading = false
      return
    },
    async removeStudent(studentDetail) {
      this.isLoading = true
      let { users, realname } = studentDetail
      try {
        await this.orgCreateNewMember({
          organizationId: this.orgId,
          classIds: [],
          memberName: users.username,
          realname,
          roleId: 1,
        })
        await this.getStudentWithClassId()
      } catch (error) {}
      this.isLoading = false
    },
    confirmRemoveStudent(studentDetail) {
      let { realname } = studentDetail
      this.$confirm(`${this.$t('org.delConfirm')} ${realname}?`, this.$t('org.deleteWarining'), {
        confirmButtonText: this.$t('common.Sure'),
        cancelButtonText: this.$t('common.Cancel'),
        type: 'warning',
      }).then(() => {
        this.removeStudent(studentDetail)
      })
    },
    toEditPage(studentDetail) {
      this.$router.push({
        name: 'OrgEditStudent',
        query: {
          roleId: 1,
          id: studentDetail.id,
        },
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.student-list {
  padding: 16px 24px;
  &-header {
    display: flex;
    align-items: center;
    padding-bottom: 16px;
    border-bottom: 1px solid #e8e8e8;
    &-selector {
      font-size: 14px;
      margin-right: 40px;
      .el-select {
        width: 120px;
      }
    }
    &-search {
      flex: 1;
      text-align: right;
      .el-input {
        width: 250px;
      }
      /deep/.el-input__inner {
        border: none;
        border-bottom: 1px solid #aaa;
        border-radius: 0;
        padding-left: 0;
      }
    }
    &-new {
      color: #2397f3;
      cursor: pointer;
    }
  }
  &-count {
    font-size: 14px;
    padding: 28px 0 16px;
    position: relative;
    height: 34px;
    line-height: 34px;
    &-operates {
      position: absolute;
      right: 0;
      top: 28px;
    }
  }
  &-table {
    &-header {
      font-size: 14px;
      color: #909399;
    }
    &-link {
      color: #2397f3;
    }
    &-operations {
      text-align: center;
      margin: 0 -10px;
    }
    &-button {
      display: inline-block;
      width: 64px;
      height: 20px;
      line-height: 18px;
      font-size: 12px;
      cursor: pointer;
      border: 1px solid;
      border-radius: 4px;
      & + & {
        margin-left: 3px;
      }
      &-primary {
        color: #2397f3;
      }
    }
  }
  &-empty {
    padding-top: 140px;
    text-align: center;
    &-info {
      color: #999;
    }
    &-cursor {
      cursor: pointer;
      color: #409efe;
    }
  }
  .el-icon-circle-plus-outline {
    margin-right: 4px;
    vertical-align: middle;
  }
}
</style>

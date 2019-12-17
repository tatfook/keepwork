<template>
  <div class="class-members">
    <el-breadcrumb class="class-members-header" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ name: 'OrgClassList' }">{{$t('org.ClassesLabel')}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{className}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="class-members-item">
      <div class="class-members-item-header">
        <i class="iconfont icon-jiaoshi"></i>教师
        <div class="class-members-item-operate" @click="isNewDialogVisible = true">
          <i class="el-icon-circle-plus-outline"></i>配置老师
        </div>
      </div>
      <el-table border :data="teacherList">
        <el-table-column prop="realname" :label="$t('org.nameLabel')" width="240">
        </el-table-column>
        <el-table-column prop="username" :label="$t('org.usernameLabel')">
        </el-table-column>
        <el-table-column prop="id" :label="$t('org.operationLabel')" width="160">
          <template slot-scope="scope">
            <div class="class-members-table-operations">
              <remove-member class="class-members-table-button" :memberDetail="scope.row" :roleId="2" :classId="classId" @finish="initData" />
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="class-members-item">
      <div class="class-members-item-header">
        <i class="iconfont icon-xuesheng"></i>学生
      </div>
      <el-table border :data="studentList">
        <el-table-column prop="realname" :label="$t('org.nameLabel')" width="135">
        </el-table-column>
        <el-table-column :label="$t('org.usernameLabel')">
          <template slot-scope="scope">{{scope.row.users.username}}</template>
        </el-table-column>
        <el-table-column prop="typeText" label="用户类型" width="135">
        </el-table-column>
        <el-table-column prop="parentPhoneNum" label="家长手机号" width="135">
        </el-table-column>
        <el-table-column prop="endTimeText" label="到期时间" width="135">
        </el-table-column>
        <el-table-column prop="id" :label="$t('org.operationLabel')">
          <template slot-scope="scope">
            <div class="class-members-table-operations">
              <remove-member class="class-members-table-button" :memberDetail="scope.row" :classId="classId" :roleId="1" @finish="initData" />
              <div class="class-members-table-button" @click="showChangeDialog(scope.row)">修改密码</div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <new-teacher-dialog :isNewDialogVisible="isNewDialogVisible" @close="isNewDialogVisible = false"></new-teacher-dialog>
    <change-password-dialog :isChangeDialogVisible="isChangeDialogVisible" :changingMember="changingMember" @close="isChangeDialogVisible = false" />
  </div>
</template>
<script>
import NewTeacherDialog from './common/NewTeacherDialog'
import ChangePasswordDialog from './common/ChangePasswordDialog'
import RemoveMember from './common/RemoveMember'
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'
export default {
  name: 'ClassMembers',
  mounted() {
    this.initData()
  },
  data() {
    return {
      isChangeDialogVisible: false,
      editingMember: {},
      changingMember: {},
      isNewDialogVisible: false,
      isLoading: false,
    }
  },
  computed: {
    ...mapGetters({
      currentOrgId: 'org/currentOrgId',
      getOrgTeachersByClassId: 'org/getOrgTeachersByClassId',
      getOrgStudentsByClassId: 'org/getOrgStudentsByClassId',
    }),
    classId() {
      return _.toNumber(_.get(this.$route, 'query.id'))
    },
    className() {
      return this.$route.query.className || ''
    },
    teacherList() {
      return this.getOrgTeachersByClassId({
        orgId: this.currentOrgId,
        classId: this.classId,
      })
    },
    studentList() {
      return _.map(
        this.getOrgStudentsByClassId({
          orgId: this.currentOrgId,
          classId: this.classId,
        }),
        studentDetail => {
          const { type, endTime } = studentDetail
          return {
            ...studentDetail,
            typeText: type == 2 ? '正式' : '试听',
            endTimeText: moment(endTime).format('YYYY/MM/DD'),
          }
        },
      )
    },
  },
  methods: {
    ...mapActions({
      getOrgTeacherList: 'org/getOrgTeacherList',
      getOrgStudentList: 'org/getOrgStudentList',
    }),
    async initData() {
      this.isLoading = true
      let organizationId = this.currentOrgId
      let classId = this.classId
      await Promise.all([
        this.getOrgTeacherList({ organizationId, classId }),
        this.getOrgStudentList({ organizationId, classId }),
      ])
      this.isLoading = false
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
  },
  components: {
    NewTeacherDialog,
    ChangePasswordDialog,
    RemoveMember,
  },
}
</script>
<style lang="scss" scoped>
.class-members {
  &-header {
    height: 56px;
    line-height: 56px;
    border-bottom: 1px solid #e8e8e8;
    padding: 0 24px;
    font-size: 16px;
    /deep/ .el-breadcrumb__inner.is-link {
      color: #999;
    }
  }
  &-item {
    padding: 24px 24px 32px 24px;
    &-header {
      height: 40px;
      line-height: 40px;
      position: relative;
    }
    &-operate {
      position: absolute;
      right: 0;
      top: 0;
      color: #2397f3;
      cursor: pointer;
    }
    .icon-jiaoshi,
    .icon-xuesheng {
      color: #2397f3;
      margin-right: 8px;
      font-size: 19px;
    }
  }
  &-table {
    &-button {
      display: inline-block;
      width: 64px;
      text-align: center;
      border: 1px solid #c5c5c5;
      border-radius: 4px;
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      padding: 0;
      color: #333;
      cursor: pointer;
      &-primary {
        color: #2397f3;
        border-color: #2397f3;
      }
      & + & {
        margin-left: 4px;
      }
    }
  }
}
</style>

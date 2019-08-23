<template>
  <div class="class-members">
    <el-breadcrumb class="class-members-header" separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ name: 'OrgClassList' }">{{$t('org.ClassesLabel')}}</el-breadcrumb-item>
      <el-breadcrumb-item>{{classId}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="class-members-item">
      <div class="class-members-item-header">
        <i class="iconfont icon-jiaoshi"></i>教师
        <div class="class-members-item-operate" @click="isNewDialogVisible = true">
          <i class="el-icon-circle-plus-outline"></i>添加教师
        </div>
      </div>
      <el-table border :data="teacherList">
        <el-table-column prop="realname" :label="$t('org.nameLabel')" width="240">
        </el-table-column>
        <el-table-column prop="username" :label="$t('org.usernameLabel')">
        </el-table-column>
        <el-table-column prop="id" :label="$t('org.operationLabel')" width="240">
          <template slot-scope="scope">
            <div class="class-members-table-operations">
              <div class="class-members-table-button class-members-table-button-primary" @click="showEditDailog(scope.row, 'teacher')">{{$t('org.Edit')}}</div>
              <remove-member class="class-members-table-button" :memberDetail="scope.row" @finish="initData" />
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
        <el-table-column prop="realname" :label="$t('org.nameLabel')" width="240">
        </el-table-column>
        <el-table-column :label="$t('org.usernameLabel')">
          <template slot-scope="scope">{{scope.row.users.username}}</template>
        </el-table-column>
        <el-table-column prop="id" :label="$t('org.operationLabel')" width="240">
          <template slot-scope="scope">
            <div class="class-members-table-operations">
              <div class="class-members-table-button class-members-table-button-primary" @click="showEditDailog(scope.row, 'student')">{{$t('org.Edit')}}</div>
              <remove-member class="class-members-table-button" :memberDetail="scope.row" @finish="initData" />
              <div class="class-members-table-button" @click="showChangeDialog(scope.row)">修改密码</div>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <new-teacher-dialog :isNewDialogVisible="isNewDialogVisible" @close="isNewDialogVisible = false"></new-teacher-dialog>
    <el-dialog :visible="isEditVisible" :before-close="closeEditMemberDialog">
      <template slot="title">编辑{{editingMember.roleId==1?'学生':'教师'}}</template>
      <edit-member v-if="isEditVisible" :editingMember="editingMember" :isDialog="true" @close="closeEditMemberDialog"></edit-member>
    </el-dialog>
    <change-password-dialog :isChangeDialogVisible="isChangeDialogVisible" :changingMember="changingMember" @close="isChangeDialogVisible = false" />
  </div>
</template>
<script>
import NewTeacherDialog from './common/NewTeacherDialog'
import ChangePasswordDialog from './common/ChangePasswordDialog'
import EditMember from './EditMember'
import RemoveMember from './common/RemoveMember'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'ClassMembers',
  mounted() {
    this.initData()
  },
  data() {
    return {
      isChangeDialogVisible: false,
      isEditVisible: false,
      editingMember: {},
      changingMember: {},
      isNewDialogVisible: false,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters({
      currentOrgId: 'org/currentOrgId',
      getOrgTeachersByClassId: 'org/getOrgTeachersByClassId',
      getOrgStudentsByClassId: 'org/getOrgStudentsByClassId'
    }),
    classId() {
      return _.get(this.$route, 'query.id')
    },
    teacherList() {
      return this.getOrgTeachersByClassId({
        orgId: this.currentOrgId,
        classId: this.classId
      })
    },
    studentList() {
      return this.getOrgStudentsByClassId({
        orgId: this.currentOrgId,
        classId: this.classId
      })
    }
  },
  methods: {
    ...mapActions({
      getOrgTeacherList: 'org/getOrgTeacherList',
      getOrgStudentList: 'org/getOrgStudentList'
    }),
    async initData() {
      this.isLoading = true
      let organizationId = this.currentOrgId
      let classId = this.classId
      await Promise.all([
        this.getOrgTeacherList({ organizationId, classId }),
        this.getOrgStudentList({ organizationId, classId })
      ])
      this.isLoading = false
    },
    showEditDailog(memberDetail, type) {
      let { realname, username, users, classes } = memberDetail
      this.editingMember = {
        roleId: type == 'teacher' ? 2 : 1,
        realname,
        memberName: username || users.username,
        classIds: _.map(classes, classObj => classObj.id)
      }
      this.isEditVisible = true
    },
    closeEditMemberDialog() {
      this.isEditVisible = false
      this.initData()
    },
    showChangeDialog(studentDetail) {
      let {
        realname,
        users: { username: memberName },
        classId,
        memberId
      } = studentDetail
      this.changingMember = {
        realname,
        memberName,
        classId,
        memberId
      }
      this.isChangeDialogVisible = true
    }
  },
  components: {
    NewTeacherDialog,
    ChangePasswordDialog,
    EditMember,
    RemoveMember
  }
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

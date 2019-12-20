<template>
  <div class="org-teacher-classes" v-if="!isLoading">
    <org-classes-tabbar :classes="orgClasses" @tab-click="handleSwitchClass" v-model="selectedClassId"></org-classes-tabbar>
    <div v-if="isShowAddStudentForm" class="org-teacher-classes-add">
      <div class="students-add-header">
        {{selectedClassName}} > {{$t("org.editStudents")}} <span class="pull-right">
          <el-button class="students-add-header-button" @click="handleCancel">{{$t("common.Cancel")}}</el-button>
          <el-button class="students-add-header-button" @click="handleSave" type="primary">{{$t("common.Save")}}</el-button>
        </span>
      </div>
      <div class="students-add-main">
        <el-form ref="form" label-width="100px" :model="studentFormData">
          <el-form-item prop="name" :label="$t('org.nameLabel')" :rules="rules.name">
            <el-input v-model="studentFormData.name"></el-input>
          </el-form-item>
          <el-form-item prop="account" :label="$t('org.usernameLabel')">
            <el-input :disabled="isEditType" v-model="studentFormData.account"></el-input>
          </el-form-item>
          <el-form-item prop="parentPhoneNum" label="家长手机号" :rules="rules.parentPhoneNum">
            <el-input placeholder="家长手机号" v-model="studentFormData.parentPhoneNum"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <template v-else>
      <div class="org-teacher-classes-member">
        <div class="member-divide">
          班级成员
        </div>
        <div class="member-banner">
          <div> <i class="iconfont icon-jiaoshi member-banner-icon"></i> 教师</div>
          <div class="member-banner-count">教师数: {{selectedClassTeachersCount}}</div>
        </div>
        <el-table :data="orgClasssTeacheresTable" border style="width: 324px;">
          <el-table-column prop="realname" :label="$t('org.nameLabel')">
          </el-table-column>
          <el-table-column prop="username" :label="$t('org.usernameLabel')">
          </el-table-column>
        </el-table>

        <div class="member-banner">
          <div> <i class="iconfont icon-xuesheng member-banner-icon"></i>学生</div>
          <div class="member-banner-count">学生数: {{selectedClassStudentsCount}}</div>
        </div>
        <el-table :data="orgClassStudentsTable" border style="width: 100%">
          <el-table-column prop="realname" :label="$t('org.nameLabel')" width="110">
          </el-table-column>
          <el-table-column prop="username" :label="$t('org.usernameLabel')" width="110">
          </el-table-column>
          <el-table-column prop="type" label="用户类型" width="110">
          </el-table-column>
          <el-table-column prop="parentPhoneNum" label="家长手机号" width="110">
          </el-table-column>
          <el-table-column prop="endTime" label="结束时间" width="110">
          </el-table-column>
          <el-table-column align="center" :label="$t('org.operationLabel')" v-if="isCanEdit">
            <template slot-scope="scope">
              <el-button @click="handleEditStudent(scope)" size="mini">{{$t("org.Edit")}}</el-button>
              <el-button @click="handleRemoveStudent(scope)" size="mini">{{$t("org.Remove")}}</el-button>
              <el-button @click="showChangeDialog(scope.row)" size="mini">修改密码</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="org-teacher-classes-last-update">
        <div class="org-teacher-classes-last-update-header">
          <span class="org-teacher-classes-last-update-header-title">
            最新更新
          </span>
          <router-link class="org-teacher-classes-last-update-header-more" :to="{ name: 'OrgTeacherLastUpdate', query: { classId: selectedClassId } }">
            全部更新 >
          </router-link>
        </div>
        <el-row>
          <el-col :sm="12" :md="8" :xs="24" v-for="(project,index) in lastUpdateProjects" :key="index">
            <project-cell :project="project" :showProjectRate="false"></project-cell>
          </el-col>
        </el-row>
      </div>
    </template>

    <change-password-dialog :isChangeDialogVisible="isChangeDialogVisible" :changingMember="changingMember" @close="isChangeDialogVisible = false" />
  </div>
</template>

<script>
import ChangePasswordDialog from '@/components/org/admin/common/ChangePasswordDialog'
import OrgClassesTabbar from '../common/OrgClassesTabbar'
import { keepwork } from '@/api'
const { lessonOrganizations: orgApi } = keepwork
import { mapActions, mapGetters } from 'vuex'
import ProjectCell from '@/components/common/ProjectCell'
import moment from 'moment'
const PhoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/

export default {
  name: 'OrgTeacherClass',
  components: {
    OrgClassesTabbar,
    ChangePasswordDialog,
    ProjectCell,
  },
  data() {
    let phoneValidater = (rule, value, callback) => {
      if (value && !PhoneReg.test(value)) {
        callback(new Error('电话号码格式不正确'))
      } else {
        callback()
      }
    }
    return {
      selectedClassId: '',
      isShowAddStudentForm: false,
      isChangeDialogVisible: false,
      changingMember: {},
      isLoading: true,
      rules: {
        name: [
          {
            required: true,
            message: '请输入学生姓名',
          },
        ],
        parentPhoneNum: [
          {
            validator: phoneValidater,
            trigger: 'blur',
          },
        ],
      },
      studentFormData: {},
    }
  },
  async created() {
    this.initClassData()
  },
  watch: {
    async $route(rotue) {
      this.initClassData()
    },
  },
  methods: {
    ...mapActions({
      getCurrentOrgUserCounts: 'org/getCurrentOrgUserCounts',
      getOrgClasses: 'org/teacher/getOrgClasses',
      getOrgClassStudentsById: 'org/teacher/getOrgClassStudentsById',
      getOrgClassTeachersById: 'org/teacher/getOrgClassTeachersById',
      addStudentToClass: 'org/teacher/addStudentToClass',
      removeStudentFromClass: 'org/teacher/removeStudentFromClass',
      getOrgStudents: 'org/teacher/getOrgStudents',
      getLastUpdateProjects: 'org/teacher/getLastUpdateProjects',
    }),
    async initClassData() {
      await Promise.all([this.getOrgClasses({ cache: true }), this.getOrgStudents()])
      const classId = _.defaultTo(_.toNumber(this.$route.query.classId), this.firstOrgClassId)
      await this.getClassMembers(classId)
      await this.getLastUpdateProjects({ classId })
      this.selectedClassId = classId
      this.isLoading = false
    },
    async getClassMembers(classId) {
      await Promise.all([this.getOrgClassStudentsById({ classId }), this.getOrgClassTeachersById({ classId })])
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
    async handleSwitchClass(classId) {
      if (this.isShowAddStudentForm && classId !== this.selectedClassId) {
        return this.$message.error('请先保存学生信息')
      }
      this.$router.push({ query: { classId } })
      await this.getClassMembers(classId)
      this.selectedClassId = classId
    },
    handleEditStudent({ row }) {
      this.isShowAddStudentForm = true
      this.isEditType = true
      this.studentFormData = {
        name: row.realname,
        account: row.username,
        parentPhoneNum: row.parentPhoneNum,
      }
    },
    async handleRemoveStudent({ row }) {
      let { realname, username } = row
      this.$confirm(`${this.$t('org.delConfirm')} ${realname}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }).then(() => {
        this.toRemoveStudent({ row })
      })
    },
    async toRemoveStudent({ row }) {
      try {
        await this.removeStudentFromClass({
          classId: this.selectedClassId,
          studentId: row.id,
        })
        this.$message({
          type: 'success',
          message: this.$t('org.removeSuccessfully'),
        })
      } catch (error) {
        this.$message.error(error)
      }
    },
    handleCancel() {
      this.isShowAddStudentForm = false
      this.studentFormData = {}
    },
    async handleSave() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          try {
            await this.addStudentToClass({
              currentClassId: this.selectedClassId,
              classIds: [..._.get(this.orgStudents, [this.studentFormData.account], []), this.selectedClassId],
              memberName: this.studentFormData.account,
              realname: this.studentFormData.name,
              parentPhoneNum: this.studentFormData.parentPhoneNum,
            })
            this.isShowAddStudentForm = false
          } catch (error) {
            this.$message.error('编辑失败')
            console.error(error)
          }
        }
      })
    },
  },
  computed: {
    ...mapGetters({
      orgClasses: 'org/teacher/orgClasses',
      orgClassStudents: 'org/teacher/orgClassStudents',
      orgClassTeachers: 'org/teacher/orgClassTeachers',
      currentOrg: 'org/currentOrg',
      orgStudents: 'org/teacher/orgStudents',
      lastUpdateProjects: 'org/teacher/lastUpdateProjects',
    }),
    firstOrgClassId() {
      return _.get(this.orgClasses, '[0].id', '')
    },
    orgClassesCount() {
      return _.get(this.orgClasses, 'length', 0)
    },
    selectedClassStudents() {
      return _.get(this.orgClassStudents, [this.selectedClassId, 'rows'], [])
    },
    selectedClassStudentsCount() {
      return this.selectedClassStudents.length
    },
    orgClasssTeacheresTable() {
      return _.get(this.orgClassTeachers, [this.selectedClassId], [])
    },
    selectedClassTeachersCount() {
      return this.orgClasssTeacheresTable.length
    },
    orgClassStudentsTable() {
      return _.map(this.selectedClassStudents, item => ({
        ...item,
        endTime: moment(item.createdAt).format('YYYY-MM-DD'),
        username: item.users.username,
        type: this.typeDict[item.type]
      }))
    },
    selectedClassName() {
      return _.get(_.find(this.orgClasses, item => item.id === this.selectedClassId), 'name', '')
    },
    currentOrgPrivilege() {
      return _.get(this.currentOrg, 'privilege', 0)
    },
    isCanEdit() {
      return this.currentOrgPrivilege === 3
    },
    orgId() {
      return _.get(this.currentOrg, 'id')
    },
    typeDict() {
      return {
        1: '试听一个月',
        2: '试听两个月',
        5: '试听三个月',
        6: '正式六个月',
        7: '正式一年',
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.org-teacher-classes {
  border-radius: 8px;
  overflow: hidden;
  .pull-right {
    float: right;
    right: 0;
  }
  &-member {
    border-top: solid 1px #e8e8e8;
    background: #fff;
    padding: 18px 25px;
    box-sizing: border-box;
    border-radius: 0 0 8px 8px;
    .member-header {
      height: 71px;
      line-height: 71px;
      color: #333;
      background-color: #f5f5f5;
      border-radius: 4px;
      text-align: center;
      .icon-shijian {
        color: #818181;
        font-size: 20px;
      }
      .add-student-button {
        color: #2397f3;
        cursor: pointer;
      }
      &-date {
        display: inline-block;
        margin-right: 40px;
      }
    }
    .member-divide {
      border-bottom: solid 2px #e8e8e8;
      height: 60px;
      line-height: 60px;
      color: #333;
      font-weight: bold;
    }
    .member-banner {
      font-size: 16px;
      color: #333;
      margin: 24px 0 10px;
      &-icon {
        color: #2397f3;
        font-size: 20px;
        margin-right: 4px;
      }
      &-count {
        font-size: 14px;
        color: #909399;
        margin-top: 8px;
      }
    }
  }

  &-add {
    min-height: 330px;
    padding-bottom: 32px;
    background: #fff;
    position: relative;
    .students-add {
      &-header {
        padding: 0 24px;
        font-size: 16px;
        height: 50px;
        line-height: 50px;
        border-top: solid 1px #e8e8e8;
        border-bottom: solid 1px #e8e8e8;
        /deep/ &-button {
          padding: 8px 26px;
        }
      }
      &-main {
        width: 500px;
        margin: 40px auto 0;
        .add-form-header {
          &-label {
            display: inline-block;
            width: 215px;
            padding-left: 10px;
            font-size: 14px;
            height: 36px;
            line-height: 36px;
            box-sizing: border-box;
            color: #909399;
          }
        }
        .add-form-item {
          /deep/ .el-icon-error {
            font-size: 28px;
            color: #666666;
            height: 40px;
            line-height: 40px;
            cursor: pointer;
          }
        }
      }

      &-bottom {
        border-top: solid 1px #e8e8e8;
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
        height: 32px;
        line-height: 32px;
        text-align: center;
        color: #2397f3;
        cursor: pointer;
      }
    }
  }

  &-last-update {
    background: #fff;
    padding-bottom: 30px;
    margin-bottom: 20px;
    &-header {
      height: 57px;
      margin: 0 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e8e8e8;
      color: #333;
      &-more {
        font-size: 14px;
        color: #999;
        text-decoration: none;
      }
    }
  }
}
</style>


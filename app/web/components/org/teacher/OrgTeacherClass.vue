<template>
  <div class="org-teacher-classes" v-if="!isLoading">
    <org-classes-tabbar :classes="orgClasses" @tab-click="handleSwitchClass" v-model="selectedClassId"></org-classes-tabbar>
    <div v-if="isShowAddStudentForm" class="org-teacher-classes-add">
      <div class="students-add-header">
        {{selectedClassName}}>添加学生 <span class="pull-right">
          <el-button class="students-add-header-button" @click="handleCancel">取消</el-button>
          <el-button class="students-add-header-button" @click="handleSave" type="primary">保存</el-button>
        </span>
      </div>
      <div class="students-add-main">
        <div class="add-form-header">
          <span class="add-form-header-label">学生姓名</span>
          <span class="add-form-header-label">用户名</span>
        </div>
        <el-form :ref="`form-${index}`" :inline="true" v-for="(item, index) in studentsFormData" :key="index" :model="item">
          <el-form-item prop="name" :rules="rules.name">
            <el-input v-model="item.name"></el-input>
          </el-form-item>
          <el-form-item prop="account" :rules="rules.account">
            <el-input v-model="item.account"></el-input>
          </el-form-item>
          <el-form-item class="add-form-item" v-if="!isEditType">
            <i class="el-icon-error" @click="handleRemoveFormItem(index)"></i>
          </el-form-item>
        </el-form>
      </div>
      <div class="students-add-bottom" v-if="!isEditType">
        <span @click="handleAddFormItem"><i class="el-icon-circle-plus-outline"></i>继续添加</span>
      </div>
    </div>
    <div v-else class="org-teacher-classes-students">
      <div class="students-table-header">
        学生数:{{selectedClassStudentsCount}}
        <span v-if="isCanEdit" class="add-student-button pull-right" @click="handleAddStudent"><i class="el-icon-circle-plus-outline"></i> 添加学生</span>
      </div>
      <el-table :data="orgClassStudentsTable" border style="width: 100%">
        <el-table-column prop="realname" label="姓名">
        </el-table-column>
        <el-table-column prop="username" label="用户名">
        </el-table-column>
        <el-table-column prop="createdAt" label="添加时间">
        </el-table-column>
        <el-table-column align="center" label="操作" v-if="isCanEdit">
          <template slot-scope="scope">
            <el-button @click="handleEditStudent(scope)" size="mini">编辑</el-button>
            <el-button @click="handleRemoveStudent(scope)" size="mini">移出</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

  </div>
</template>

<script>
import OrgClassesTabbar from '../common/OrgClassesTabbar'
import { keepwork } from '@/api'
const { lessonOrganizations: orgApi } = keepwork
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'

export default {
  name: 'OrgTeacherClass',
  components: {
    OrgClassesTabbar
  },
  data() {
    return {
      selectedClassId: '',
      isShowAddStudentForm: false,
      isLoading: true,
      rules: {
        name: [
          {
            required: true,
            message: '请输入学生姓名'
          }
        ],
        account: [
          {
            required: true,
            message: '请输入账号'
          }
        ]
      },
      studentsFormData: [
        {
          name: '',
          account: ''
        }
      ]
    }
  },
  async created() {
    await this.getOrgClasses()
    await this.getOrgClassStudentsById({ classId: this.firstOrgClassId })
    this.selectedClassId = this.firstOrgClassId
    this.isLoading = false
  },
  methods: {
    ...mapActions({
      getCurrentOrgUserCounts: 'org/getCurrentOrgUserCounts',
      getOrgClasses: 'org/teacher/getOrgClasses',
      getOrgClassStudentsById: 'org/teacher/getOrgClassStudentsById',
      addStudentToClass: 'org/teacher/addStudentToClass',
      removeStudentFromClass: 'org/teacher/removeStudentFromClass'
    }),
    async handleSwitchClass(classId) {
      if (this.isShowAddStudentForm && classId !== this.selectedClassId) {
        return this.$message.error('请先保存学生信息')
      }
      await this.getOrgClassStudentsById({ classId, cache: true })
      this.selectedClassId = classId
    },
    handleEditStudent({ row }) {
      this.isShowAddStudentForm = true
      this.isEditType = true
      this.studentsFormData = [{ name: row.realname, account: row.username }]
    },
    async handleRemoveStudent({ row }) {
      try {
        await this.removeStudentFromClass({
          classId: this.selectedClassId,
          studentId: row.id
        })
        this.$message({
          type: 'success',
          message: '移出成功'
        })
      } catch (error) {
        this.$message.error(error)
      }
    },
    handleAddStudent() {
      this.isShowAddStudentForm = true
      this.isEditType = false
      this.studentsFormData = [{ name: '', account: '' }]
    },
    handleCancel() {
      this.isShowAddStudentForm = false
      this.studentsFormData = [{ name: '', account: '' }]
    },
    async handleSave() {
      const sucessfullItems = []
      for (let index = 0; index < this.studentsFormData.length; index++) {
        await new Promise(async (resolve, reject) => {
          const forms = this.$refs[`form-${index}`][0]
          const form = Array.isArray(forms) ? forms[0] : forms
          const student = this.studentsFormData[index]
          form.validate(async valid => {
            if (valid) {
              try {
                const res = await this.addStudentToClass({
                  classId: this.selectedClassId,
                  memberName: student.account,
                  realname: student.name
                })
                sucessfullItems.push(index)
              } catch (error) {
                if (error.data.indexOf('无权限') !== -1) {
                  this.$message.error('无权限')
                  reject()
                }
                if (error.data.indexOf('成员不存在') !== -1) {
                  this.$message.error(`用户名:[${student.account}]不存在`)
                  sucessfullItems
                    .reverse()
                    .forEach(index => this.handleRemoveFormItem(index))
                  reject()
                }
              }
            }
            resolve()
          })
        })
      }
      sucessfullItems
        .reverse()
        .forEach(index => this.handleRemoveFormItem(index))
      if (this.studentsFormData.length === 0) {
        this.$message({
          type: 'success',
          message: '添加成功'
        })
        this.isShowAddStudentForm = false
      }
    },
    handleAddFormItem() {
      this.studentsFormData.push({
        name: '',
        account: ''
      })
    },
    handleRemoveFormItem(index) {
      this.studentsFormData.splice(index, 1)
    }
  },
  computed: {
    ...mapGetters({
      orgClasses: 'org/teacher/orgClasses',
      orgClassStudents: 'org/teacher/orgClassStudents',
      currentOrg: 'org/currentOrg',
      userCounts: 'org/userCounts'
    }),
    firstOrgClassId() {
      return _.get(this.orgClasses, '[0].id', '')
    },
    orgClassesCount() {
      return _.get(this.orgClasses, 'length', 0)
    },
    orgId() {
      return _.get(this.currentOrg, 'id', '')
    },
    orgUserCount() {
      return _.get(this.userCounts, [this.orgId], {})
    },
    orgCurrentStudentCount() {
      return _.get(this.orgUserCount, 'studentCount', 0)
    },
    orgStudentUpperLimit() {
      const count = _.get(this.orgUserCount, 'count', 0)
      const teacherCount = _.get(this.orgUserCount, 'teacherCount', 0)
      return count - teacherCount
    },
    isCanAddStudent() {
      return (
        this.orgStudentUpperLimit > 0 &&
        this.orgStudentUpperLimit > this.orgCurrentStudentCount
      )
    },
    selectedClassStudents() {
      return _.get(this.orgClassStudents, [this.selectedClassId, 'rows'], [])
    },
    selectedClassStudentsCount() {
      return this.selectedClassStudents.length
    },
    orgClassStudentsTable() {
      return _.map(this.selectedClassStudents, item => ({
        ...item,
        createdAt: moment(item.createdAt).format('YYYY-MM-DD'),
        username: item.users.username
      }))
    },
    selectedClassName() {
      return _.get(
        _.find(this.orgClasses, item => item.id === this.selectedClassId),
        'name',
        ''
      )
    },
    currentOrgPrivilege() {
      return _.get(this.currentOrg, 'privilege', 0)
    },
    isCanEdit() {
      return this.currentOrgPrivilege === 3
    }
  }
}
</script>

<style lang="scss" scoped>
.org-teacher-classes {
  .pull-right {
    float: right;
    right: 0;
  }
  &-students {
    border-top: solid 1px #e8e8e8;
    background: #fff;
    padding: 0 24px 24px;
    box-sizing: border-box;
    .students-table-header {
      height: 50px;
      line-height: 50px;
      font-size: 14px;
      color: #333;
      .add-student-button {
        color: #2397f3;
        cursor: pointer;
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
}
</style>


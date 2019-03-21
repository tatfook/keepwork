<template>
  <div class="new-teacher">
    <div class="new-teacher-header">
      <el-breadcrumb class="new-teacher-header-breadcrumb" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'OrgTeacherList' }">教师</el-breadcrumb-item>
        <el-breadcrumb-item>添加教师</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="new-teacher-header-operate">
        <el-button size="medium" @click="toTeacherListPage">取消</el-button>
        <el-button v-loading="isLoading" size="medium" @click="saveNewTeachers" type="primary">保存</el-button>
      </div>
    </div>
    <div class="new-teacher-list">
      <el-form :ref="`form-${index}`" class="new-teacher-item" :inline="true" v-for="(newTeacherItem, index) in newTeachers" :key="index" :model="newTeacherItem">
        <el-form-item class="new-teacher-item-form-item" label="学生姓名" :rules="newTeacherRules.realname">
          <el-input v-model="newTeacherItem.realname" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item class="new-teacher-item-form-item" label="用户名" :rules="newTeacherRules.memberName">
          <el-input v-model="newTeacherItem.memberName" placeholder="keepwork用户名"></el-input>
        </el-form-item>
        <el-form-item class="new-teacher-item-form-item" label="班级">
          <el-select v-model="newTeacherItem.classId" placeholder="请选择">
            <el-option v-for="(classItem, index) in orgClasses" :key="index" :label="classItem.name" :value="classItem.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="new-teacher-item-form-item new-teacher-item-remove">
          <i @click="removeNewTeacher(index)" class="el-icon-error"></i>
        </el-form-item>
      </el-form>
    </div>
    <div class="new-teacher-add">
      <span @click="pushNewTeacherData" class="new-teacher-add-button">
        <i class="el-icon-circle-plus-outline"></i>继续添加
      </span>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'NewTeacher',
  async mounted() {
    this.isTreeLoading = true
    await this.getOrgClassList({
      organizationId: this.orgId
    })
    this.pushNewTeacherData()
    this.isTreeLoading = false
  },
  data() {
    return {
      isLoading: false,
      newTeachers: [],
      newTeacherRules: {
        realname: [
          {
            required: true,
            message: '请输入教师姓名'
          }
        ],
        memberName: [
          {
            required: true,
            message: '请输入用户名'
          }
        ]
      }
    }
  },
  computed: {
    ...mapGetters({
      currentOrg: 'org/currentOrg',
      getOrgClassesById: 'org/getOrgClassesById'
    }),
    orgId() {
      return _.get(this.currentOrg, 'id')
    },
    orgClasses() {
      return this.getOrgClassesById({ id: this.orgId }) || []
    }
  },
  methods: {
    ...mapActions({
      getOrgClassList: 'org/getOrgClassList',
      orgCreateNewTeacher: 'org/createNewTeacher'
    }),
    pushNewTeacherData() {
      this.newTeachers.push({
        realname: '',
        memberName: '',
        classId: this.orgClasses[0].id
      })
    },
    removeNewTeacher(index) {
      this.newTeachers.splice(index, 1)
    },
    toTeacherListPage() {
      this.$router.push({
        name: 'OrgTeacherList'
      })
    },
    async saveNewTeacher(index) {
      await new Promise(async (resolve, reject) => {
        const form = this.$refs[`form-${index}`][0]
        const newTeacherData = this.newTeachers[index]
        const { realname, memberName, classId } = newTeacherData
        form.validate(async valid => {
          if (valid) {
            await this.orgCreateNewTeacher({
              organizationId: this.orgId,
              classId,
              memberName,
              realname
            })
              .then(() => {
                this.newTeachers.splice(index, 1)
                resolve()
              })
              .catch(error => {
                switch (error.status) {
                  case 409:
                    this.$message.error(`用户名:[${memberName}]已在教师列表中`)
                    break
                  case 400:
                    this.$message.error(`用户名:[${memberName}]不存在`)
                    break
                  default:
                    this.$message.error(`用户名:[${student.account}]添加失败`)
                    break
                }
                reject()
              })
          }
        })
      })
    },
    async saveNewTeachers() {
      let newTeacherLen = this.newTeachers.length
      this.isLoading = true
      for (let i = newTeacherLen - 1; i >= 0; i--) {
        await this.saveNewTeacher(i).catch(() => {})
      }
      this.isLoading = false
      if (this.newTeachers.length == 0) {
        this.$message({
          type: 'success',
          message: '添加成功'
        })
        this.toTeacherListPage()
      }
    }
  }
}
</script>

<style lang="scss">
$borderColor: #e8e8e8;
.new-teacher {
  height: 100%;
  margin-top: -57px;
  padding-top: 57px;
  box-sizing: border-box;
  position: relative;
  &-header {
    display: flex;
    height: 56px;
    border-bottom: 1px solid $borderColor;
    padding: 0 24px;
    align-items: center;
    &-breadcrumb {
      flex: 1;
      font-size: 16px;
      .el-breadcrumb__inner.is-link {
        color: #999;
      }
    }
  }
  &-list {
    padding: 40px 0;
  }
  &-item {
    text-align: center;
    margin-bottom: 24px;
    &-form-item {
      margin: 0 16px 0 0;
      .el-form-item__content {
        width: 215px;
      }
    }
    & &-remove {
      margin-right: 0;
      margin-left: 16px;
      vertical-align: bottom;
      .el-form-item__content {
        width: auto;
      }
    }
    .el-form-item__label {
      display: block;
      font-size: 14px;
      color: #909399;
      margin-bottom: 12px;
      text-align: left;
      padding: 0 16px;
      line-height: unset;
    }
    .el-icon-error {
      font-size: 22px;
    }
  }
  &-add {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    text-align: center;
    color: #2397f3;
    border-top: 1px solid #e8e8e8;
    font-size: 14px;
    height: 32px;
    line-height: 32px;
    &-button {
      cursor: pointer;
      .el-icon-circle-plus-outline {
        margin-right: 8px;
        vertical-align: middle;
      }
    }
  }
}
</style>

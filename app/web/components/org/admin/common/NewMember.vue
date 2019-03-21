<template>
  <div class="new-member">
    <div class="new-member-header">
      <el-breadcrumb class="new-member-header-breadcrumb" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: memberTypeListPageName }">{{memberTypeText}}</el-breadcrumb-item>
        <el-breadcrumb-item>添加{{memberTypeText}}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="new-member-header-operate">
        <el-button size="medium" @click="toMemberListPage">取消</el-button>
        <el-button v-loading="isLoading" size="medium" @click="saveNewMembers" type="primary">保存</el-button>
      </div>
    </div>
    <div class="new-member-list">
      <el-form :ref="`form-${index}`" class="new-member-item" :inline="true" v-for="(newMemberItem, index) in newMembers" :key="index" :model="newMemberItem">
        <el-form-item class="new-member-item-form-item" :label="`${memberTypeText}姓名`" :rules="newMemberRules.realname">
          <el-input v-model="newMemberItem.realname" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item class="new-member-item-form-item" label="用户名" :rules="newMemberRules.memberName">
          <el-input v-model="newMemberItem.memberName" placeholder="keepwork用户名"></el-input>
        </el-form-item>
        <el-form-item class="new-member-item-form-item" label="班级">
          <el-select v-model="newMemberItem.classId" placeholder="请选择">
            <el-option v-for="(classItem, index) in orgClasses" :key="index" :label="classItem.name" :value="classItem.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="new-member-item-form-item new-member-item-remove">
          <i @click="removeNewMember(index)" class="el-icon-error"></i>
        </el-form-item>
      </el-form>
    </div>
    <div class="new-member-add">
      <span @click="pushNewMemberData" class="new-member-add-button">
        <i class="el-icon-circle-plus-outline"></i>继续添加
      </span>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'NewMember',
  props: {
    memberType: {
      validator: function(value) {
        return ['teacher', 'student'].indexOf(value) !== -1
      }
    }
  },
  async mounted() {
    await this.getOrgClassList({
      organizationId: this.orgId
    })
    this.pushNewMemberData()
  },
  data() {
    return {
      isLoading: false,
      newMembers: [],
      newMemberRules: {
        realname: [
          {
            required: true,
            message: `请输入${this.memberType}姓名`
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
    },
    memberTypeListPageName() {
      return this.memberType === 'student' ? 'OrgStudentList' : 'OrgTeacherList'
    },
    memberTypeText() {
      return this.memberType === 'student' ? '学生' : '教师'
    },
    memberTypeRoleId() {
      return this.memberType === 'student' ? 1 : 2
    }
  },
  methods: {
    ...mapActions({
      getOrgClassList: 'org/getOrgClassList',
      orgCreateNewMember: 'org/createNewMember'
    }),
    pushNewMemberData() {
      this.newMembers.push({
        realname: '',
        memberName: '',
        classId: this.orgClasses[0].id
      })
    },
    removeNewMember(index) {
      this.newMembers.splice(index, 1)
    },
    toMemberListPage() {
      this.$router.push({
        name: this.memberTypeListPageName
      })
    },
    async saveNewMember(index) {
      await new Promise(async (resolve, reject) => {
        const form = this.$refs[`form-${index}`][0]
        const newMemberData = this.newMembers[index]
        const { realname, memberName, classId } = newMemberData
        form.validate(async valid => {
          if (valid) {
            await this.orgCreateNewMember({
              organizationId: this.orgId,
              classId,
              memberName,
              realname,
              roleId: this.memberTypeRoleId
            })
              .then(() => {
                this.newMembers.splice(index, 1)
                resolve()
              })
              .catch(error => {
                switch (error.status) {
                  case 409:
                    this.$message.error(`用户名:[${memberName}]已在${this.memberTypeText}列表中`)
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
    async saveNewMembers() {
      let newMembersLen = this.newMembers.length
      this.isLoading = true
      for (let i = newMembersLen - 1; i >= 0; i--) {
        await this.saveNewMember(i).catch(() => {})
      }
      this.isLoading = false
      if (this.newMembers.length == 0) {
        this.$message({
          type: 'success',
          message: '添加成功'
        })
        this.toMemberListPage()
      }
    }
  }
}
</script>

<style lang="scss">
$borderColor: #e8e8e8;
.new-member {
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

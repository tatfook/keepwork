<template>
  <div class="edit-member">
    <div v-if="!isDialog" class="edit-member-header">
      <el-breadcrumb class="edit-member-header-breadcrumb" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: memberTypeListPageName }">{{memberTypeText}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{editMemberTypeText}}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="edit-member-header-operate">
        <el-button size="medium" @click="toMemberListPage">{{$t('common.Cancel')}}</el-button>
        <el-button v-loading="isLoading" size="medium" @click="updateMember" type="primary">{{$t('common.Save')}}</el-button>
      </div>
    </div>
    <el-form ref="memberForm" class="edit-member-form" label-position="left" label-width="84px" :model="memberData" :hide-required-asterisk="true">
      <el-form-item :label="memberTypeNameLabel" :rules="memberRules.realname" prop="realname">
        <el-input :placeholder="$t('org.pleaseInput')" v-model="memberData.realname"></el-input>
      </el-form-item>
      <el-form-item :label="$t('org.usernameLabel')" :rules="memberRules.memberName" prop="memberName">
        <el-input disabled :placeholder="$t('org.KeepworkUsername')" v-model="memberData.memberName"></el-input>
      </el-form-item>
      <el-form-item v-if="memberRoleId == 1" label="家长手机号" :rules="memberRules.parentPhoneNum" prop="parentPhoneNum">
        <el-input placeholder="家长手机号" v-model="memberData.parentPhoneNum"></el-input>
      </el-form-item>
      <el-form-item :label="$t('org.classLabel')" :rules="memberRules.classIds" prop="classIds">
        <el-select clearable v-model="memberData.classIds" :placeholder="$t('org.pleaseSelect')" multiple>
          <span :title="memberData.classIds | idToTextFilter(orgClasses)" class="edit-member-form-selected" :class="{'edit-member-form-selected-empty': memberData.classIds.length == 0}" slot="prefix">{{memberData.classIds | idToTextFilter(orgClasses, $t('org.pleaseSelect'))}}</span>
          <el-option v-for="(classItem, index) in orgClasses" :key="index" :label="classItem.name" :value="classItem.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div class="edit-member-footer" v-if="isDialog">
      <el-button size="medium" @click="closeDialog">{{$t('common.Cancel')}}</el-button>
      <el-button v-loading="isLoading" size="medium" @click="updateMember" type="primary">{{$t('common.Save')}}</el-button>
    </div>
  </div>
</template>

<script>
import { locale } from '@/lib/utils/i18n'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'EditMember',
  props: {
    isDialog: {
      type: Boolean,
      default: false
    },
    editingMember: Object
  },
  async mounted() {
    this.initMemberData()
  },
  data() {
    let memberRoleId = _.get(this.$route, 'query.roleId')
    let phoneValidate = (rule, value, callback) => {
      if (value && !/^1\d{10}$/.test(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    return {
      isLoading: false,
      memberData: {
        realname: '',
        memberName: '',
        parentPhoneNum: '',
        classIds: []
      },
      memberRules: {
        realname: [
          {
            required: true,
            message: this.$t('org.pleaseInputMemberName', {
              zhRroleType: memberRoleId == 1 ? '学生' : '教师',
              enRroleType: memberRoleId == 1 ? 'student' : 'teacher'
            })
          }
        ],
        memberName: [
          {
            required: true,
            message: this.$t('org.usernameIsRequired')
          }
        ],
        parentPhoneNum: [{ validator: phoneValidate, trigger: 'change' }],
      }
    }
  },
  computed: {
    ...mapGetters({
      currentOrg: 'org/currentOrg',
      currentOrgId: 'org/currentOrgId',
      getOrgClassesById: 'org/getOrgClassesById',
      getOrgTeachersByClassId: 'org/getOrgTeachersByClassId',
      getOrgStudentsByClassId: 'org/getOrgStudentsByClassId'
    }),
    isEn() {
      return locale === 'en-US'
    },
    orgId() {
      return _.get(this.currentOrg, 'id')
    },
    orgClasses() {
      return this.getOrgClassesById({ id: this.orgId }) || []
    },
    memberId() {
      return _.get(this.$route, 'query.id')
    },
    memberRoleId() {
      return _.toNumber(
        this.isDialog
          ? this.editingMember.roleId
          : _.get(this.$route, 'query.roleId')
      )
    },
    memberTypeText() {
      return this.memberRoleId === 1
        ? this.$t('org.StudentsLabel')
        : this.$t('org.TeachersLabel')
    },
    memberTypeListPageName() {
      return this.memberRoleId === 1 ? 'OrgStudentList' : 'OrgTeacherList'
    },
    editMemberTypeText() {
      return this.isEn
        ? this.$t('org.Edit') + ' ' + this.memberTypeText
        : this.$t('org.Edit') + this.memberTypeText
    },
    memberTypeNameLabel() {
      return this.isEn
        ? this.$t('org.nameLabel')
        : this.memberTypeText + this.$t('org.nameLabel')
    }
  },
  methods: {
    ...mapActions({
      orgCreateNewMember: 'org/createNewMember',
      getOrgTeacherList: 'org/getOrgTeacherList',
      getOrgStudentList: 'org/getOrgStudentList'
    }),
    closeDialog() {
      this.$emit('close')
    },
    toMemberListPage() {
      this.$router.push({
        name: this.memberTypeListPageName
      })
    },
    async getStudentDetail() {
      await this.getOrgStudentList({
        organizationId: this.currentOrgId,
        classId: undefined
      })
      let memberList = this.getOrgStudentsByClassId({
        orgId: this.currentOrgId
      })
      let {
        classes = [],
        users: { username: memberName },
        realname,
        parentPhoneNum
      } = _.find(memberList, member => member.id == this.memberId)
      let classIds = _.map(classes, classDetail => classDetail.id)
      return { realname, memberName, classIds, parentPhoneNum }
    },
    async getTeacherDetail() {
      await this.getOrgTeacherList({
        organizationId: this.currentOrgId,
        classId: undefined
      })
      let memberList = this.getOrgTeachersByClassId({
        orgId: this.currentOrgId
      })
      let { classes = [], username: memberName, realname } = _.find(
        memberList,
        member => member.id == this.memberId
      )
      let classIds = _.map(classes, classDetail => classDetail.id)
      return { realname, memberName, classIds }
    },
    async initMemberData() {
      if (this.isDialog) {
        return (this.memberData = this.editingMember)
      }
      let detail
      if (this.memberRoleId == 1) {
        detail = await this.getStudentDetail()
      } else {
        detail = await this.getTeacherDetail()
      }
      let { realname, memberName, classIds, parentPhoneNum } = detail
      this.memberData = { realname, memberName, classIds, parentPhoneNum }
    },
    updateMember() {
      let form = this.$refs['memberForm']
      let { realname, memberName, classIds, parentPhoneNum } = this.memberData
      form.validate(async valid => {
        if (valid) {
          this.isLoading = true
          await this.orgCreateNewMember({
            organizationId: this.orgId,
            classIds,
            memberName,
            parentPhoneNum,
            realname,
            roleId: this.memberRoleId
          })
            .then(() => {
              this.isLoading = false
              this.$message({
                type: 'success',
                message: this.$t('org.successfullyUpdated')
              })
              if (this.isDialog) return this.closeDialog()
              return this.toMemberListPage()
            })
            .catch(error => {
              this.isLoading = false
              switch (error.status) {
                case 400:
                  this.$message.error(`用户名:[${memberName}]不存在`)
                  break
                default:
                  this.$message.error(this.$t('org.failureUpdated'))
                  break
              }
            })
        }
      })
    }
  },
  watch: {
    $route(value) {
      this.initMemberData()
    },
    editingMember() {
      this.initMemberData()
    },
    isDialog() {
      this.initMemberData()
    }
  },
  filters: {
    idToTextFilter(ids, classes, emptyText) {
      return (
        _.map(ids, id => {
          return _.get(_.find(classes, { id }), 'name')
        }).join('、') || emptyText
      )
    }
  }
}
</script>
<style lang="scss">
$borderColor: #e8e8e8;
.edit-member {
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
  &-form {
    width: 318px;
    padding: 24px;
    &-selected {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
      display: inline-block;
      color: #606266;
      &-empty {
        color: #c0c4cc;
      }
    }
  }
  &-footer {
    text-align: right;
  }
  .el-select {
    width: 100%;
    .el-input__prefix {
      right: 32px;
      z-index: 2;
      background-color: #fff;
      top: 3px;
      height: 34px;
      line-height: 34px;
      text-align: left;
      padding-left: 11px;
      cursor: pointer;
    }
    .el-select__tags {
      overflow: hidden;
      & > span {
        display: inline-block;
        white-space: nowrap;
      }
    }
    .el-tag__close.el-icon-close {
      display: none;
    }
  }
}
</style>

<template>
  <div class="new-member">
    <div class="new-member-header">
      <el-breadcrumb class="new-member-header-breadcrumb" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: memberTypeListPageName }">{{memberTypeText}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{$t('org.Add')}}{{memberTypeText}}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="new-member-header-operate">
        <el-button size="medium" @click="toMemberListPage">{{$t('common.Cancel')}}</el-button>
        <el-button v-loading="isLoading" size="medium" @click="saveNewMembers" type="primary">{{$t('common.Save')}}</el-button>
      </div>
    </div>
    <div class="new-member-list">
      <el-form :ref="`form-${index}`" class="new-member-item" :inline="true" v-for="(newMemberItem, index) in newMembers" :key="index" :model="newMemberItem">
        <el-form-item class="new-member-item-form-item" :label="memberTypeNameLabel" prop="realname" :rules="newMemberRules.realname">
          <el-input v-model="newMemberItem.realname" :placeholder="$t('org.pleaseInput')"></el-input>
        </el-form-item>
        <el-form-item class="new-member-item-form-item" :label="$t('org.usernameLabel')" prop="memberName" :rules="newMemberRules.memberName" :error="newMemberItem.error">
          <el-input v-model="newMemberItem.memberName" @focus="onLastInput(index)" :placeholder="$t('org.KeepworkUsername')"></el-input>
        </el-form-item>
        <el-form-item class="new-member-item-form-item" :label="$t('org.classLabel')" :rules="newMemberRules.classIds" prop="classIds">
          <el-select v-model="newMemberItem.classIds" :placeholder="$t('org.pleaseSelect')" multiple>
            <span :title="newMemberItem.classIds | idToTextFilter(orgClasses)" class="new-member-item-form-item-selected" :class="{'new-member-item-form-item-selected-empty': newMemberItem.classIds.length == 0}" slot="prefix">{{newMemberItem.classIds | idToTextFilter(orgClasses, $t('org.pleaseSelect'))}}</span>
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
        <i class="el-icon-circle-plus-outline"></i>{{$t('org.continueAdd')}}
      </span>
    </div>
  </div>
</template>
<script>
import { locale } from '@/lib/utils/i18n'
import _ from 'lodash'
import { mapActions, mapGetters } from 'vuex'
const RE_CELLPHONE = /^1\d{10}$/
const RE_EMAIL = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
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
    this.pushNewMemberData()
  },
  data() {
    const checkMemberName = async (rule, username, callback) => {
      await this.testUsername({ username, callback })
    }
    let classIdsValidate = (rule, value, callback) => {
      if (this.memberType == 'student' && value.length == 0) {
        callback(new Error(this.$t('org.pleaseSelectClasses')))
      } else {
        callback()
      }
    }
    return {
      isLoading: false,
      lastFormIndex: -1,
      newMembers: [],
      newMemberRules: {
        realname: [
          {
            required: true,
            message: `${this.$t('org.pleaseInputMemberName', {
              zhRroleType: this.memberType == 'student' ? '学生' : '教师',
              enRroleType: this.memberType == 'student' ? 'student' : 'teacher'
            })}`
          }
        ],
        memberName: [
          { required: true, message: this.$t('org.usernameIsRequired') },
          {
            validator: checkMemberName,
            trigger: 'blur'
          }
        ],
        classIds: [{ validator: classIdsValidate, trigger: 'change' }]
      }
    }
  },
  computed: {
    ...mapGetters({
      currentOrg: 'org/currentOrg',
      getOrgRestCount: 'org/getOrgRestCount',
      getOrgClassesById: 'org/getOrgClassesById'
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
    orgRestUserCount() {
      return this.getOrgRestCount({ id: this.orgId })
    },
    memberTypeListPageName() {
      return this.memberType === 'student' ? 'OrgStudentList' : 'OrgTeacherList'
    },
    memberTypeText() {
      return this.memberType === 'student'
        ? this.$t('org.StudentsLabel')
        : this.$t('org.TeachersLabel')
    },
    memberTypeRoleId() {
      return this.memberType === 'student' ? 1 : 2
    },
    memberTypeNameLabel() {
      return this.isEn
        ? this.$t('org.nameLabel')
        : this.memberTypeText + this.$t('org.nameLabel')
    }
  },
  methods: {
    ...mapActions({
      orgCheckIsTeacherValid: 'org/checkIsTeacherValid',
      orgCreateNewMember: 'org/createNewMember'
    }),
    onLastInput(index) {
      this.lastFormIndex = index
    },
    pushNewMemberData() {
      let waitingAddedLen = this.newMembers.length
      if (
        waitingAddedLen >= this.orgRestUserCount &&
        this.memberType == 'student'
      ) {
        this.$alert(
          this.$t('org.cannotAddMoreMember'),
          this.$t('org.warningTitle'),
          {
            type: 'warning'
          }
        )
        return
      }
      this.newMembers.push({
        realname: '',
        memberName: '',
        classIds:
          this.memberType == 'student' ? [this.orgClasses[0].id] : []
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
    async testUsername({ username, callback }) {
      try {
        await this.orgCheckIsTeacherValid({
          organizationId: this.orgId,
          username
        })
        callback()
      } catch (error) {
        let status = _.get(error, 'response.status')
        let errorInfo = ''
        switch (status) {
          case 400:
            errorInfo =
              this.$t('org.theUsername') +
              `[${username}]` +
              this.$t('org.wasNotFound')
            break
          case 409:
            errorInfo =
              this.$t('org.theUsername') +
              `[${username}]` +
              this.$t('org.alreadyInList', {
                zhRole: this.memberType == 'student' ? '学生' : '教师',
                enRole: this.memberType == 'student' ? 'student' : 'teacher'
              })
            break
          default:
            break
        }
        callback(new Error(errorInfo))
      }
    },
    converToAccount(user) {
      this.newMembers.forEach(item => {
        if (
          RE_CELLPHONE.test(item.memberName) &&
          item.memberName == user.cellphone
        ) {
          item.memberName = user.username
        }
        if (RE_EMAIL.test(item.memberName) && item.memberName == user.email) {
          item.memberName = user.username
        }
      })
    },
    async saveNewMember(index) {
      await new Promise(async (resolve, reject) => {
        const form = this.$refs[`form-${index}`][0]
        const newMemberData = this.newMembers[index]
        let { realname, memberName, classIds } = newMemberData
        form.validate(async valid => {
          if (valid) {
            this.newMembers[index].error = ''
            if (this.memberTypeRoleId == 2 && classIds.length == 0) {
              classIds = [0]
            }
            await this.orgCreateNewMember({
              organizationId: this.orgId,
              classIds,
              memberName,
              realname,
              roleId: this.memberTypeRoleId
            })
              .then(() => {
                this.newMembers.splice(index, 1)
                resolve()
              })
              .catch(error => {
                let errorMessage = ''
                switch (error.status) {
                  case 409:
                    errorMessage =
                      $t('org.theUsername') +
                      `[${memberName}]` +
                      $t('org.alreadyInList', {
                        zhRole: this.memberTypeText,
                        enRole: this.memberTypeText
                      })
                    break
                  case 400:
                    errorMessage = `${this.$t(
                      'org.theUsername'
                    )}[${memberName}]${this.$t('org.wasNotFound')}`
                    break
                  default:
                    errorMessage =
                      `${this.$t('org.theUsername')}[${student.account}]` +
                      this.$t('org.failedToAdd')
                    break
                }
                this.newMembers[index].error = errorMessage
                reject()
              })
          } else {
            reject()
          }
        })
      })
    },
    async saveNewMembers() {
      if (this.lastFormIndex !== -1) {
        const _form = this.$refs[`form-${this.lastFormIndex}`][0]
        if (_form) {
          await _form.validate()
        }
      }
      let newMembersLen = this.newMembers.length
      this.isLoading = true
      for (let i = newMembersLen - 1; i >= 0; i--) {
        await this.saveNewMember(i).catch(() => {})
      }
      this.isLoading = false
      if (this.newMembers.length == 0) {
        this.$message({
          type: 'success',
          message: this.$t('org.successfullyAdd')
        })
        this.toMemberListPage()
      }
    }
  },
  filters: {
    idToTextFilter(ids, classes, emptyText) {
      return (
        _.map(ids, id => {
          return _.find(classes, { id }).name
        }).join('、') || emptyText
      )
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
    .el-select {
      .el-input__prefix {
        right: 32px;
        z-index: 2;
        background-color: #fff;
        top: 2px;
        height: 36px;
        line-height: 36px;
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

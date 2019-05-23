<template>
  <div class="edit-member">
    <div class="edit-member-header">
      <el-breadcrumb class="edit-member-header-breadcrumb" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: memberTypeListPageName }">{{memberTypeText}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{editMemberTypeText}}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="edit-member-header-operate">
        <el-button size="medium" @click="toMemberListPage">{{$t('common.Cancel')}}</el-button>
        <el-button v-loading="isLoading" size="medium" @click="updateMember" type="primary">{{$t('common.Save')}}</el-button>
      </div>
    </div>
    <el-form ref="memberForm" class="edit-member-form" label-position="left" label-width="78px" :model="memberData" :hide-required-asterisk="true">
      <el-form-item :label="memberTypeNameLabel" :rules="memberRules.realname" prop="realname">
        <el-input :placeholder="$t('org.pleaseInput')" v-model="memberData.realname"></el-input>
      </el-form-item>
      <el-form-item :label="$t('org.usernameLabel')" :rules="memberRules.memberName" prop="memberName">
        <el-input disabled :placeholder="$t('org.KeepworkUsername')" v-model="memberData.memberName"></el-input>
      </el-form-item>
      <el-form-item :label="$t('org.classLabel')" :rules="memberRules.classIds" prop="classIds">
        <el-select v-model="memberData.classIds" :placeholder="$t('org.pleaseSelect')" multiple>
          <span :title="memberData.classIds | idToTextFilter(orgClasses)" class="edit-member-form-selected" :class="{'edit-member-form-selected-empty': memberData.classIds.length == 0}" slot="prefix">{{memberData.classIds | idToTextFilter(orgClasses, $t('org.pleaseSelect'))}}</span>
          <el-option v-for="(classItem, index) in filterOverDueClasses" :key="index" :label="classItem.name" :value="classItem.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { locale } from '@/lib/utils/i18n'
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'EditMember',
  async mounted() {
    this.initMemberData()
  },
  data() {
    let memberRoleId = _.get(this.$route, 'query.roleId')
    let classIdsValidate = (rule, value, callback) => {
      if (this.memberRoleId === 1 && value.length == 0) {
        callback(new Error(this.$t('org.pleaseSelectClasses')))
      } else {
        callback()
      }
    }
    return {
      isLoading: false,
      memberData: {
        realname: '',
        memberName: '',
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
        classIds: [{ validator: classIdsValidate, trigger: 'change' }]
      }
    }
  },
  computed: {
    ...mapGetters({
      currentOrg: 'org/currentOrg',
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
    filterOverDueClasses() {
      let nowDate = new Date().valueOf()
      return _.filter(this.orgClasses, classDetail => {
        let classBegin = new Date(classDetail.begin).valueOf()
        let classEnd = new Date(classDetail.end).valueOf()
        return classEnd >= nowDate
      })
    },
    queryData() {
      return _.get(this.$route, 'query')
    },
    memberRoleId() {
      return _.get(this.queryData, 'roleId')
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
      orgCreateNewMember: 'org/createNewMember'
    }),
    toMemberListPage() {
      this.$router.push({
        name: this.memberTypeListPageName
      })
    },
    initMemberData() {
      let { realname, memberName, classIds } = this.queryData
      this.memberData = { realname, memberName, classIds: JSON.parse(classIds) }
    },
    updateMember() {
      let form = this.$refs['memberForm']
      let { realname, memberName, classIds } = this.memberData
      form.validate(async valid => {
        if (valid) {
          this.isLoading = true
          await this.orgCreateNewMember({
            organizationId: this.orgId,
            classIds,
            memberName,
            realname,
            roleId: this.memberRoleId
          })
            .then(() => {
              this.isLoading = false
              this.$message({
                type: 'success',
                message: this.$t('org.successfullyUpdated')
              })
              this.toMemberListPage()
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

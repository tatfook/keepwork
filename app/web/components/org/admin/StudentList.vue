<template>
  <div class="student-list" v-loading="isLoading">
    <el-select v-model="selectedClassId" v-if="orgStudentsCount > 0">
      <el-option :label="$t('org.all')" :value="undefined">
      </el-option>
      <el-option v-for="(classItem, index) in orgClasses" :key="index" :label="classItem.name" :value="classItem.id">
      </el-option>
    </el-select>
    <div class="student-list-header" v-if="orgStudentsCount > 0">
      <div class="student-list-header-count">{{$t('org.IncludeStudents') + orgStudents.length + $t('org.studentCountUnit')}}</div>
      <div class="student-list-header-new" @click="toNewStudentPage"><i class="el-icon-circle-plus-outline"></i>{{$t('org.addStudents')}}</div>
    </div>
    <el-table v-if="orgStudentsCount > 0" class="student-list-table" border :data="orgStudentsWithClassesString" header-row-class-name="student-list-table-header">
      <el-table-column prop="realname" :label="$t('org.nameLabel')" width="172">
      </el-table-column>
      <el-table-column prop="users.username" :label="$t('org.usernameLabel')" width="172">
      </el-table-column>
      <el-table-column prop="classesString" :label="$t('org.classLabel')" width="172" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="createdAt" :label="$t('org.AddedAtLabel')" width="172" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="id" :label="$t('org.operationLabel')">
        <template slot-scope="scope">
          <div class="student-list-table-operations">
            <div class="student-list-table-button student-list-table-button-primary" @click="toEditPage(scope.row)">{{$t('org.Edit')}}</div>
            <div class="student-list-table-button" @click="confirmRemoveStudent(scope.row)">{{$t('org.Remove')}}</div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="student-list-empty" v-if="orgStudentsCount == 0">
      <p class="student-list-empty-info">{{$t('org.noStudents')}} <span @click="toNewStudentPage" class="student-list-empty-cursor">{{$t('org.addStudentsImmediately')}}</span>
      </p>
    </div>
  </div>
</template>
<script>
import moment from 'moment'
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'StudentList',
  async mounted() {
    this.isLoading = true
    await this.getOrgStudentList({
      organizationId: this.orgId
    }).catch(() => {})
    this.isLoading = false
  },
  data() {
    return {
      selectedClassId: undefined,
      isLoading: false
    }
  },
  computed: {
    ...mapGetters({
      currentOrg: 'org/currentOrg',
      getOrgRestCount: 'org/getOrgRestCount',
      getOrgUserCountById: 'org/getOrgUserCountById',
      getOrgClassesById: 'org/getOrgClassesById',
      getOrgStudentsByClassId: 'org/getOrgStudentsByClassId'
    }),
    orgId() {
      return _.get(this.currentOrg, 'id')
    },
    orgStudents() {
      return (
        this.getOrgStudentsByClassId({
          orgId: this.orgId,
          classId: this.selectedClassId
        }) || []
      )
    },
    orgRestUserCount() {
      return this.getOrgRestCount({ id: this.orgId })
    },
    orgStudentsCount() {
      return _.get(
        this.getOrgUserCountById({ id: this.orgId }),
        'studentCount',
        0
      )
    },
    orgStudentsWithClassesString() {
      return _.map(this.orgStudents, student => {
        let classes = student.lessonOrganizationClasses
        let classNameArr = _.map(classes, classDetail => classDetail.name)
        student.classesString = _.join(classNameArr, '、')
        student.createdAt = moment(student.createdAt).format('YYYY-MM-DD HH:mm')
        return student
      })
    },
    orgClasses() {
      return (
        this.getOrgClassesById({
          id: this.orgId
        }) || []
      )
    },
    selectedClassName() {
      return this.selectedClassId
        ? _.find(this.orgClasses, { id: this.selectedClassId }).name
        : this.$t('org.all')
    }
  },
  methods: {
    ...mapActions({
      getOrgStudentList: 'org/getOrgStudentList',
      orgCreateNewMember: 'org/createNewMember'
    }),
    toNewStudentPage() {
      if (this.orgRestUserCount == 0) {
        this.$alert(
          this.$t('org.cannotAddMoreMember'),
          this.$t('org.warningTitle'),
          {
            type: 'warning'
          }
        )
        return
      }
      this.$router.push({ name: 'OrgNewStudent' })
    },
    async handleChangeSelectClass() {
      this.isLoading = true
      await this.getOrgStudentList({
        organizationId: this.orgId,
        classId: this.selectedClassId
      }).catch(() => {})
      this.isLoading = false
    },
    async removeStudent(studentDetail) {
      this.isLoading = true
      let { users, realname } = studentDetail
      await this.orgCreateNewMember({
        organizationId: this.orgId,
        classIds: [],
        memberName: users.username,
        realname,
        roleId: 1
      }).catch(() => {})
      await this.getOrgStudentList({
        organizationId: this.orgId
      }).catch(() => {})
      this.isLoading = false
    },
    confirmRemoveStudent(studentDetail) {
      let { realname } = studentDetail
      this.$confirm(
        `${this.$t('org.delConfirm')} ${realname}?`,
        this.$t('org.deleteWarining'),
        {
          confirmButtonText: this.$t('common.Sure'),
          cancelButtonText: this.$t('common.Cancel'),
          type: 'warning'
        }
      ).then(() => {
        this.removeStudent(studentDetail)
      })
    },
    toEditPage(studentDetail) {
      let { realname, users, lessonOrganizationClasses, roleId } = studentDetail
      this.$router.push({
        name: 'OrgEditStudent',
        query: {
          roleId,
          realname,
          memberName: users.username,
          classIds: JSON.stringify(
            _.map(lessonOrganizationClasses, classObj => classObj.id)
          )
        }
      })
    }
  },
  watch: {
    selectedClassId() {
      this.handleChangeSelectClass()
    }
  }
}
</script>
<style lang="scss" scoped>
.student-list {
  padding: 16px 24px;
  .el-select {
    width: 120px;
    margin-bottom: 18px;
  }
  &-header {
    display: flex;
    margin-bottom: 16px;
    &-count {
      flex: 1;
    }
    &-new {
      color: #2397f3;
      cursor: pointer;
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
      padding: 0 20px;
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

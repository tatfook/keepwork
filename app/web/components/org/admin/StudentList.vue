<template>
  <div class="student-list" v-loading="isLoading">
    <div class="student-list-header">
      <div class="student-list-header-count">{{$t('org.IncludeStudents') + orgStudents.length + $t('org.studentCountUnit')}}</div>
      <router-link class="student-list-header-new" :to="{name: 'OrgNewStudent'}">
        <i class="el-icon-circle-plus-outline"></i>{{$t('org.addStudents')}}
      </router-link>
    </div>
    <el-table class="student-list-table" border :data="orgStudentsWithClassesString" header-row-class-name="student-list-table-header">
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
  </div>
</template>
<script>
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
      isLoading: false
    }
  },
  computed: {
    ...mapGetters({
      currentOrg: 'org/currentOrg',
      getOrgStudentsById: 'org/getOrgStudentsById'
    }),
    orgId() {
      return _.get(this.currentOrg, 'id')
    },
    orgStudents() {
      return this.getOrgStudentsById({ id: this.orgId }) || []
    },
    orgStudentsWithClassesString() {
      return _.map(this.orgStudents, student => {
        let classes = student.lessonOrganizationClasses
        let classNameArr = _.map(classes, classDetail => classDetail.name)
        student.classesString = _.join(classNameArr, '、')
        return student
      })
    }
  },
  methods: {
    ...mapActions({
      getOrgStudentList: 'org/getOrgStudentList',
      removeMemberFromClass: 'org/removeMemberFromClass'
    }),
    async removeStudent(id) {
      this.isLoading = true
      await this.removeMemberFromClass({ id }).catch(() => {})
      await this.getOrgStudentList({
        organizationId: this.orgId
      }).catch(() => {})
      this.isLoading = false
    },
    confirmRemoveStudent(studentDetail) {
      let { id, realname } = studentDetail
      this.$confirm(`是否确定删除学生${realname}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.removeStudent(id)
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
  }
}
</script>
<style lang="scss" scoped>
.student-list {
  padding: 24px;
  &-header {
    display: flex;
    margin-bottom: 16px;
    &-count {
      flex: 1;
    }
    &-new {
      color: #2397f3;
      cursor: pointer;
      text-decoration: none;
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
  .el-icon-circle-plus-outline {
    margin-right: 4px;
    vertical-align: middle;
  }
}
</style>

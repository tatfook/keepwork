<template>
  <div class="teacher-list" v-loading="isLoading">
    <div class="teacher-list-header">
      <div class="teacher-list-header-count">教师数：{{orgTeachers.length}}</div>
      <router-link class="teacher-list-header-new" :to="{name: 'OrgNewTeacher'}">
        <i class="el-icon-circle-plus-outline"></i>添加老师
      </router-link>
    </div>
    <el-table class="teacher-list-table" border :data="orgTeachersWithClassesString" header-row-class-name="teacher-list-table-header">
      <el-table-column prop="realname" label="姓名" width="214">
      </el-table-column>
      <el-table-column prop="username" label="用户名" width="214">
      </el-table-column>
      <el-table-column prop="classesString" label="班级" width="214" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="id" label="操作">
        <template slot-scope="scope">
          <div class="teacher-list-table-operations">
            <div class="teacher-list-table-button teacher-list-table-button-primary">编辑</div>
            <div class="teacher-list-table-button" @click="confirmRemoveTeacher(scope.row)">移出</div>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'TeacherList',
  async mounted() {
    this.isLoading = true
    await this.getOrgTeacherList({
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
      getOrgTeachersById: 'org/getOrgTeachersById'
    }),
    orgId() {
      return _.get(this.currentOrg, 'id')
    },
    orgTeachers() {
      return this.getOrgTeachersById({ id: this.orgId }) || []
    },
    orgTeachersWithClassesString() {
      return _.map(this.orgTeachers, teacher => {
        let classes = teacher.classes
        let classNameArr = _.map(classes, classDetail => classDetail.name)
        teacher.classesString = _.join(classNameArr, '、')
        return teacher
      })
    }
  },
  methods: {
    ...mapActions({
      getOrgTeacherList: 'org/getOrgTeacherList',
      removeMemberFromClass: 'org/removeMemberFromClass'
    }),
    async removeTeacher(id) {
      this.isLoading = true
      await this.removeMemberFromClass({ id }).catch(() => {})
      await this.getOrgTeacherList({
        organizationId: this.orgId
      }).catch(() => {})
      this.isLoading = false
    },
    confirmRemoveTeacher(teacherDetail) {
      let { id, realname } = teacherDetail
      this.$confirm(`是否确定删除教师${realname}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.removeTeacher(id)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.teacher-list {
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

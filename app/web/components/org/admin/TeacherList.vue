<template>
  <div class="teacher-list">
    <div class="teacher-list-header">
      <div class="teacher-list-header-count">教师数：{{orgTeachers.length}}</div>
      <router-link class="teacher-list-header-new" :to="{name: 'OrgNewTeacher'}">
        <i class="el-icon-circle-plus-outline"></i>添加老师
      </router-link>
    </div>
    <el-table class="teacher-list-table" border :data="orgTeachers" header-row-class-name="teacher-list-table-header">
      <el-table-column prop="realname" label="姓名" width="214">
      </el-table-column>
      <el-table-column prop="memberName" label="用户名" width="214">
      </el-table-column>
      <el-table-column prop="classes" label="班级" width="214">
      </el-table-column>
      <el-table-column prop="id" label="操作">
        <template slot-scope="scope">
          <div class="teacher-list-table-button teacher-list-table-button-primary">编辑</div>
          <div class="teacher-list-table-button">移出</div>
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
    await this.getOrgTeacherList({
      organizationId: this.orgId
    })
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
    }
  },
  methods: {
    ...mapActions({
      getOrgTeacherList: 'org/getOrgTeacherList'
    })
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
    &-button {
      padding: 0 20px;
      height: 20px;
      line-height: 20px;
      font-size: 12px;
      cursor: pointer;
      border: 1px solid;
      border-radius: 4px;
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

<template>
  <div class="student-list">
    <div class="student-list-header">
      <div class="student-list-header-count">班级数：5</div>
      <div class="student-list-new"><i class="el-icon-circle-plus-outline"></i>新建班级</div>
    </div>
    <el-table class="student-list-table" :data="orgStudents" style="width: 100%">
      <el-table-column prop="name" label="班级名称" width="240">
      </el-table-column>
      <el-table-column prop="id" label="可使用的课程包" width="320">
        <template slot-scope="scope">
          <router-link :to='{path: `${scope.id}/detail`}'>详情</router-link>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'StudentList',
  computed: {
    ...mapGetters({
      currentOrg: 'org/currentOrg',
      getOrgStudentsById: 'org/getOrgStudentsById'
    }),
    orgId() {
      return _.get(this.currentOrg, 'id')
    },
    orgStudents() {
      return this.getOrgStudentsById({ id: this.orgId })
    }
  },
  methods: {
    ...mapActions({
      getOrgStudentList: 'org/getOrgStudentList'
    })
  }
}
</script>

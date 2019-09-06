<template>
  <el-dialog custom-class="new-teacher-dialog" title="配置老师" :visible.sync="isNewDialogVisible" width="906px" :before-close="handleClose" v-loading="isLoading">
    <el-table border :data="teacherList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="268">
      </el-table-column>
      <el-table-column prop="realname" :label="$t('org.nameLabel')" width="276">
      </el-table-column>
      <el-table-column prop="username" :label="$t('org.usernameLabel')">
      </el-table-column>
      <template slot="empty">
        <router-link class="new-teacher-dialog-empty" :to="{ name: 'OrgNewTeacher' }">请去 教师管理界面为组织添加任课教师，点击跳转...</router-link>
      </template>
    </el-table>
    <span slot="footer" class="new-teacher-dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="confirmAddTeacher">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  name: 'NewTeacherDialog',
  props: {
    isNewDialogVisible: Boolean
  },
  async mounted() {
    this.isLoading = true
    let organizationId = this.currentOrgId
    let classId = this.classId
    await Promise.all([
      this.getOrgTeacherList({ organizationId, classId }),
      this.getOrgTeacherList({ organizationId })
    ])
    this.isLoading = false
  },
  data() {
    return {
      isLoading: false,
      selectedTeachers: []
    }
  },
  computed: {
    ...mapGetters({
      currentOrgId: 'org/currentOrgId',
      getOrgTeachersByClassId: 'org/getOrgTeachersByClassId'
    }),
    classTeacherList() {
      return this.getOrgTeachersByClassId({
        orgId: this.currentOrgId,
        classId: this.classId
      })
    },
    orgTeacherList() {
      return this.getOrgTeachersByClassId({ orgId: this.currentOrgId })
    },
    teacherList() {
      return _.filter(this.orgTeacherList, teacher => {
        return (
          _.findIndex(
            this.classTeacherList,
            classTeacher => teacher.username === classTeacher.username
          ) === -1
        )
      })
    },
    classId() {
      return _.get(this.$route, 'query.id')
    }
  },
  methods: {
    ...mapActions({
      orgCreateNewMember: 'org/createNewMember',
      getOrgTeacherList: 'org/getOrgTeacherList'
    }),
    handleClose() {
      this.$emit('close')
    },
    async confirmAddTeacher() {
      this.isLoading = true
      let self = this
      await Promise.all(
        this.selectedTeachers.map(teacher => {
          let classIds = _.map(teacher.classes, 'id') || []
          classIds.push(self.classId)
          let { username: memberName, realname } = teacher
          return this.orgCreateNewMember({
            organizationId: this.orgId,
            classIds,
            memberName,
            realname,
            roleId: 2
          })
        })
      )
      await this.getOrgTeacherList({
        organizationId: this.currentOrgId,
        classId: this.classId
      })
      this.isLoading = false
      this.handleClose()
      this.$message({
        type: 'success',
        message: '添加教师成功！'
      })
    },
    handleSelectionChange(val) {
      this.selectedTeachers = val
    }
  }
}
</script>
<style lang="scss" scoped>
.new-teacher-dialog {
  &-empty {
    text-decoration: none;
    color: #909399;
    &:hover {
      color: #2397f3;
    }
  }
}
</style>

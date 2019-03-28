<template>
  <div class="teacher-list" v-loading="isLoading">
    <div class="teacher-list-header" v-if="orgTeachersLength > 0">
      <div class="teacher-list-header-count">{{$t('org.IncludeTeachers') + orgTeachers.length + $t('org.teacherCountUnit')}}</div>
      <div class="teacher-list-header-new" @click="toNewTeacherPage"><i class="el-icon-circle-plus-outline"></i>{{$t('org.addTeachers')}}</div>
    </div>
    <el-table v-if="orgTeachersLength > 0" class="teacher-list-table" border :data="orgTeachersWithClassesString" header-row-class-name="teacher-list-table-header">
      <el-table-column prop="realname" :label="$t('org.nameLabel')" width="214">
      </el-table-column>
      <el-table-column prop="username" :label="$t('org.usernameLabel')" width="214">
      </el-table-column>
      <el-table-column prop="classesString" :label="$t('org.classLabel')" width="214" :show-overflow-tooltip="true">
      </el-table-column>
      <el-table-column prop="id" :label="$t('org.operationLabel')">
        <template slot-scope="scope">
          <div class="teacher-list-table-operations">
            <div class="teacher-list-table-button teacher-list-table-button-primary" @click="toEditPage(scope.row)">{{$t('org.Edit')}}</div>
            <div class="teacher-list-table-button" @click="confirmRemoveTeacher(scope.row)">{{$t('org.Remove')}}</div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div class="teacher-list-empty" v-if="orgTeachersLength == 0">
      <img class="teacher-list-empty-img" src="@/assets/org/list_empty.png" alt="">
      <p class="teacher-list-empty-info">{{$t('org.noTeaches')}} <router-link :to="{name: 'OrgNewTeacher'}" class="teacher-list-empty-cursor">{{$t('org.addTeachersImmediately')}}</router-link>
      </p>
    </div>
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
      getOrgRestCount: 'org/getOrgRestCount',
      getOrgTeachersById: 'org/getOrgTeachersById'
    }),
    orgId() {
      return _.get(this.currentOrg, 'id')
    },
    orgRestUserCount() {
      return this.getOrgRestCount({ id: this.orgId })
    },
    orgTeachers() {
      return this.getOrgTeachersById({ id: this.orgId }) || []
    },
    orgTeachersLength() {
      return this.orgTeachers.length
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
    toNewTeacherPage() {
      if (this.orgRestUserCount == 0) {
        this.$alert(
          '已到达添加上限，如需添加更多用户信息，请联系Keepwork客服购买。程老师 13267059950（电话/微信）、846704851（QQ）',
          '提示',
          {
            type: 'warning'
          }
        )
        return
      }
      this.$router.push({ name: 'OrgNewTeacher' })
    },
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
    },
    toEditPage(teacherDetail) {
      let { realname, username, classes, roleId } = teacherDetail
      this.$router.push({
        name: 'OrgEditTeacher',
        query: {
          roleId,
          realname,
          memberName: username,
          classIds: JSON.stringify(_.map(classes, classObj => classObj.id))
        }
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
  &-empty {
    padding-top: 58px;
    text-align: center;
    &-img {
      width: auto;
      max-width: 100%;
    }
    &-info {
      color: #999;
      margin: 52px 0 32px;
    }
    &-cursor {
      color: #409efe;
      text-decoration: none;
    }
  }
  .el-icon-circle-plus-outline {
    margin-right: 4px;
    vertical-align: middle;
  }
}
</style>

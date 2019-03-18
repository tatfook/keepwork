<template>
  <div class="new-teacher">
    <div class="new-teacher-header">
      <el-breadcrumb class="new-teacher-header-breadcrumb" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'OrgTeacherList' }">教师</el-breadcrumb-item>
        <el-breadcrumb-item>添加教师</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="new-teacher-header-operate">
        <el-button size="medium" @click="toTeacherListPage">取消</el-button>
        <el-button size="medium" type="primary" @click="save">保存</el-button>
      </div>
    </div>
    <div class="new-teacher-list">
      <el-form class="new-teacher-item" :inline="true" v-for="(newTeacherItem, index) in newTeachers" :key="index" :model="newTeacherItem">
        <el-form-item label="学生姓名">
          <el-input v-model="newTeacherItem.realname" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="newTeacherItem.memberName" placeholder="keepwork用户名"></el-input>
        </el-form-item>
        <el-form-item label="班级">
          <el-select v-model="newTeacherItem.classes" placeholder="请选择">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'NewTeacher',
  async mounted() {
    this.isTreeLoading = true
    await this.getOrgPackagesByGraphql({ organizationId: this.orgId })
    this.isTreeLoading = false
  },
  data() {
    return {
      newTeachers: []
    }
  },
  computed: {
    ...mapGetters({
      currentOrg: 'org/currentOrg',
      getOrgClassesById: 'org/getOrgClassesById',
      getOrgPackagesGraphqlById: 'org/getOrgPackagesGraphqlById'
    }),
    orgId() {
      return _.get(this.currentOrg, 'id')
    },
    orgClasses() {
      return this.getOrgClassesById({ id: this.orgId }) || []
    }
  },
  methods: {
    ...mapActions({
      getOrgClassList: 'org/getOrgClassList',
      getOrgPackagesByGraphql: 'org/getOrgPackagesByGraphql',
      orgCreateNewTeacher: 'org/createNewTeacher'
    }),
    toTeacherListPage() {
      this.$router.push({
        name: 'OrgTeacherList'
      })
    },
    async save() {
      console.log('save')
    },
    loadPakcageLessons(node, resolve) {
      let formatedLessonData = []
      _.forEach(node.data.children, lessonData => {
        formatedLessonData.push({
          label: `课程Id为${lessonData.lessonId}`,
          children: []
        })
      })
      resolve(formatedLessonData)
    }
  }
}
</script>

<style lang="scss">
$borderColor: #e8e8e8;
.new-teacher {
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
    width: 384px;
    padding: 24px;
    &-label {
      font-size: 14px;
      color: #333;
      margin-bottom: 12px;
    }
    &-danger {
      color: #e31d3e;
      font-size: 12px;
      margin-top: 12px;
    }
    &-item {
      margin-bottom: 40px;
    }
  }
  &-tree {
    border: 1px solid $borderColor;
  }
}
</style>

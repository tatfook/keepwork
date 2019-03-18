<template>
  <div class="new-class">
    <div class="new-class-header">
      <el-breadcrumb class="new-class-header-breadcrumb" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'OrgClassList' }">班级</el-breadcrumb-item>
        <el-breadcrumb-item>创建班级</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="new-class-header-operate">
        <el-button size="medium" @click="toClassListPage">取消</el-button>
        <el-button size="medium" type="primary" @click="save" :disabled="!isNewClassDataValid">保存</el-button>
      </div>
    </div>
    <div class="new-class-form">
      <div class="new-class-form-item">
        <div class="new-class-form-label">班级名称</div>
        <el-input placeholder="请输入班级名称" v-model="newClassData.name"></el-input>
        <div class="new-class-form-danger">（注意：班级名称，一经设置，不得修改。）</div>
      </div>
      <div class="new-class-form-item">
        <div class="new-class-form-label">可使用的课程包</div>
        <el-tree v-loading='isTreeLoading' class="new-class-form-tree" :data='formatedTreeData' default-expand-all show-checkbox check-on-click-node :expand-on-click-node='false'>
        </el-tree>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'NewClass',
  async mounted() {
    this.isTreeLoading = true
    await this.getOrgPackagesByGraphql({ organizationId: this.orgId })
    this.isTreeLoading = false
  },
  data() {
    return {
      isTreeLoading: false,
      newClassData: {
        name: '',
        packages: []
      },
      treeProps: {
        label: 'label',
        children: 'children'
      }
    }
  },
  computed: {
    ...mapGetters({
      currentOrg: 'org/currentOrg',
      getOrgPackagesGraphqlById: 'org/getOrgPackagesGraphqlById'
    }),
    orgId() {
      return _.get(this.currentOrg, 'id')
    },
    orgAvailablePackages() {
      return this.getOrgPackagesGraphqlById({ id: this.orgId }) || []
    },
    formatedTreeData() {
      return _.map(this.orgAvailablePackages, packageData => {
        return {
          packageId: _.get(packageData, 'package.id'),
          label: _.get(packageData, 'package.packageName'),
          children: _.map(packageData.lessons, lesson => {
            return {
              label: lesson.lessonName,
              lessonId: lesson.id
            }
          })
        }
      })
    },
    isNewClassDataValid() {
      let newClassData = this.newClassData
      return newClassData.name && newClassData.name !== ''
    }
  },
  methods: {
    ...mapActions({
      getOrgPackagesByGraphql: 'org/getOrgPackagesByGraphql',
      orgCreateNewClass: 'org/createNewClass'
    }),
    toClassListPage() {
      this.$router.push({
        name: 'OrgClassList'
      })
    },
    async save() {
      await this.orgCreateNewClass({
        ...this.newClassData,
        organizationId: this.orgId
      })
        .then(result => {
          this.$message({
            message: '班级创建成功',
            type: 'success'
          })
          this.toClassListPage()
        })
        .catch(error => {
          let message = ''
          switch (error.status) {
            case 409:
              message = '该班级已存在'
              break
            default:
              message = '班级创建失败'
              break
          }
          this.$message({
            message: message,
            type: 'error'
          })
        })
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
.new-class {
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

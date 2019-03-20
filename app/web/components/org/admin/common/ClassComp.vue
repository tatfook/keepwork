<template>
  <div class="class-comp">
    <div class="class-comp-header">
      <el-breadcrumb class="class-comp-header-breadcrumb" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'OrgClassList' }">班级</el-breadcrumb-item>
        <el-breadcrumb-item>{{nowPageText}}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="class-comp-header-operate">
        <el-button v-if="!isDetailPage" size="medium" @click="toClassListPage">取消</el-button>
        <el-button v-if="!isDetailPage" size="medium" type="primary" @click="save" :disabled="!isClassDataValid">保存</el-button>
        <router-link class="class-comp-header-edit" v-if="isDetailPage" :to="{name: 'OrgEditClass', query: classDetail}">
          <i class="el-icon-edit-outline"></i>
        </router-link>
      </div>
    </div>
    <div class="class-comp-form">
      <div class="class-comp-form-item">
        <div class="class-comp-form-label">班级名称</div>
        <el-input :disabled='!isNewPage' placeholder="请输入班级名称" v-model="classData.name"></el-input>
        <div class="class-comp-form-danger">（注意：班级名称，一经设置，不得修改。）</div>
      </div>
      <div class="class-comp-form-item">
        <div class="class-comp-form-label">可使用的课程包</div>
        <el-tree ref="lessonTree" v-loading='isTreeLoading' class="class-comp-form-tree" :data='formatedTreeData' default-expand-all show-checkbox check-on-click-node :expand-on-click-node='false' node-key="id">
        </el-tree>
      </div>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'ClassComp',
  props: {
    classDetail: Object
  },
  mounted() {
    this.initClassData()
  },
  data() {
    return {
      isTreeLoading: false,
      classData: {
        name: '',
        packages: []
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
    isDetailPage() {
      return _.get(this.$route, 'name') === 'OrgClassDetail'
    },
    isNewPage() {
      return _.get(this.$route, 'name') === 'OrgNewClass'
    },
    isEditPage() {
      return _.get(this.$route, 'name') === 'OrgEditClass'
    },
    nowClassName() {
      return _.get(this.classDetail, 'name')
    },
    nowPageText() {
      let pageText = ''
      switch (this.$route.name) {
        case 'OrgNewClass':
          pageText = '创建班级'
          break
        case 'OrgEditClass':
        case 'OrgClassDetail':
          pageText = this.nowClassName
          break
        default:
          break
      }
      return pageText
    },
    orgAvailablePackages() {
      return this.getOrgPackagesGraphqlById({ id: this.orgId }) || []
    },
    formatedTreeData() {
      return _.map(this.orgAvailablePackages, packageData => {
        let packageId = _.toNumber(_.get(packageData, 'package.id'))
        return {
          id: packageId,
          packageId: packageId,
          label: _.get(packageData, 'package.packageName'),
          disabled: this.isDetailPage,
          children: _.map(packageData.lessons, lesson => {
            let lessonId = _.toNumber(lesson.id)
            return {
              id: `${packageId}-${lessonId}`,
              packageId: packageId,
              disabled: this.isDetailPage,
              label: lesson.lessonName,
              lessonId: lessonId
            }
          })
        }
      })
    },
    isClassDataValid() {
      let classData = this.classData
      return classData.name && classData.name !== ''
    }
  },
  methods: {
    ...mapActions({
      getOrgClassPackages: 'org/getOrgClassPackages',
      getOrgPackagesByGraphql: 'org/getOrgPackagesByGraphql'
    }),
    initClassData() {
      this.initTreeData()
      if (this.isDetailPage || this.isEditPage) {
        this.initSelectedLessons()
        this.classData = this.classDetail
      } else {
        this.classData = {
          name: '',
          packages: []
        }
      }
    },
    async initTreeData() {
      this.isTreeLoading = true
      await this.getOrgPackagesByGraphql({ organizationId: this.orgId })
      this.isTreeLoading = false
    },
    async initSelectedLessons() {
      let classPackages = await this.getOrgClassPackages({
        organizationId: this.orgId,
        classId: this.classDetail.id
      })
      let classLessons = []
      for (let i = 0; i < classPackages.length; i++) {
        const packageItem = classPackages[i]
        let lessons = classPackages[i].lessons
        if (_.isNull(lessons)) {
          break
        }
        for (let j = 0; j < lessons.length; j++) {
          const lesson = lessons[j]
          classLessons.push(`${packageItem.packageId}-${lesson.lessonId}`)
        }
      }
      this.$refs.lessonTree.setCheckedKeys(classLessons)
    },
    toClassListPage() {
      this.$router.push({
        name: 'OrgClassList'
      })
    },
    setSelectedPackages() {
      let selectedLessons = this.$refs.lessonTree.getCheckedNodes(true)
      let groupedPackages = _.groupBy(selectedLessons, 'packageId')
      let packages = []
      _.forIn(groupedPackages, (lessons, packageId) => {
        packages.push({
          packageId: _.toNumber(packageId),
          lessons: _.map(lessons, lesson => {
            return {
              lessonId: lesson.lessonId
            }
          })
        })
      })
      this.classData.packages = packages
    },
    save() {
      this.setSelectedPackages()
      this.$emit('save', this.classData)
    }
  },
  watch: {
    $route() {
      this.initClassData()
    }
  }
}
</script>
<style lang="scss">
$borderColor: #e8e8e8;
.class-comp {
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

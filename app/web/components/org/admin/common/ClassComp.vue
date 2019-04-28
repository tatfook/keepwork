<template>
  <div class="class-comp">
    <div class="class-comp-header">
      <el-breadcrumb class="class-comp-header-breadcrumb" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'OrgClassList' }">{{$t('org.ClassesLabel')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{nowPageText}}</el-breadcrumb-item>
      </el-breadcrumb>
      <div class="class-comp-header-operate">
        <el-button v-if="!isDetailPage" size="medium" @click="toClassListPage">{{$t('common.Cancel')}}</el-button>
        <el-button v-if="!isDetailPage" size="medium" type="primary" @click="save" :disabled="!isClassDataValid">{{$t('common.Save')}}</el-button>
      </div>
    </div>
    <div class="class-comp-form">
      <div class="class-comp-form-item">
        <div class="class-comp-form-label">{{$t('org.ClassNameLabel')}}</div>
        <el-input :disabled='isDetailPage' placeholder="例如：2019级1班" v-model="classData.name"></el-input>
      </div>
      <div class="class-comp-form-item">
        <div class="class-comp-form-label">{{$t('org.beginClassTime')}}</div>
        <el-date-picker :disabled="isDetailPage" v-model="classTime" type="daterange" range-separator="至" start-placeholder="开班时间" end-placeholder="结束时间" unlink-panels>
        </el-date-picker>
      </div>
      <div class="class-comp-form-item">
        <div class="class-comp-form-label">{{$t('org.LessonPackagesAvailable')}}:</div>
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
      classTime: null,
      isTreeLoading: false,
      classData: {
        name: '',
        begin: null,
        end: null,
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
          pageText = this.$t('org.NewClass')
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
        let classDetail = this.classDetail
        this.classData = classDetail
        this.classTime = _.isNull(classDetail.begin)
          ? null
          : [classDetail.begin, classDetail.end]
      } else {
        this.classData = {
          name: '',
          begin: null,
          end: null,
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
    setSelectedTime() {
      if (_.isNull(this.classTime)) {
        this.classData.begin = null
        this.classData.end = null
        return
      }
      this.classData.begin = this.classTime[0]
      this.classData.end = this.classTime[1]
    },
    save() {
      this.setSelectedPackages()
      this.setSelectedTime()
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

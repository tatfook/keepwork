<template>
  <div class="historical-class-comp">
    <div class="historical-class-comp-header">
      <el-breadcrumb class="historical-class-comp-header-breadcrumb" separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'HistoricalData' }">{{$t('org.historicalData')}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{nowPageText}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="historical-class-comp-form">
      <div class="historical-class-comp-form-item">
        <div class="historical-class-comp-form-label">{{$t('org.ClassNameLabel')}}</div>
        <el-input disabled placeholder="例如：2019级1班" v-model="classData.name"></el-input>
      </div>
      <div class="historical-class-comp-form-item">
        <div class="historical-class-comp-form-label">{{$t('org.LessonPackagesAvailable')}}:</div>
        <el-tree ref="lessonTree" v-loading='isTreeLoading' class="historical-class-comp-form-tree" :data='formatedTreeData' show-checkbox check-on-click-node :expand-on-click-node='false' node-key="id">
        </el-tree>
      </div>
      <div class="historical-class-comp-form-item">
        <p>{{$t('org.teachersName')}}：{{classData.teachersName}}</p>
      </div>
    </div>
    <div class="historical-class-comp-student">
      <p>{{$t('org.studentCunt')}}：{{currentClassStudentsCount}}</p>
      <el-table :data="currentClassStudents" border style="width: 100%">
        <el-table-column prop="realname" :label="$t('org.nameLabel')" width="280">
        </el-table-column>
        <el-table-column prop="users.username" :label="$t('org.usernameLabel')" width="280">
        </el-table-column>
        <el-table-column :label="$t('org.AddedAtLabel')">
          <template slot-scope="scope">{{scope.row.createdAt | formatTime}}</template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'
import moment from 'moment'
export default {
  name: 'ClassComp',
  props: {
    classDetail: Object,
  },
  async created() {
    await Promise.all([this.initClassData(), this.getHistoryClasses({ cache: true })])
  },
  data() {
    return {
      isTreeLoading: false,
      classData: {
        name: '',
        begin: null,
        end: null,
        packages: [],
      },
    }
  },
  computed: {
    ...mapGetters({
      currentOrg: 'org/currentOrg',
      getOrgPackagesWithLessonById: 'org/getOrgPackagesWithLessonById',
      orgClassStudents: 'org/teacher/orgClassStudents',
      orgHistoricalClasses: 'org/orgHistoricalClasses',
    }),
    orgId() {
      return _.get(this.currentOrg, 'id')
    },
    startDate() {
      return new Date(this.currentOrg.startDate)
    },
    endDate() {
      return new Date(this.currentOrg.endDate)
    },
    isNewPage() {
      return _.get(this.$route, 'name') === 'OrgNewClass'
    },
    nowClassName() {
      return _.get(this.classDetail, 'name')
    },
    nowPageText() {
      let pageText = ''
      switch (this.$route.name) {
        case 'OrgHistoryClassDetail':
          pageText = this.nowClassName
          break
        default:
          break
      }
      return pageText
    },
    orgAvailablePackages() {
      let packages = this.getOrgPackagesWithLessonById({ id: this.orgId }) || []
      return _.uniqBy(packages, 'id')
    },
    formatedTreeData() {
      return _.map(this.orgAvailablePackages, packageData => {
        let packageId = _.toNumber(packageData.id)
        return {
          id: packageId,
          packageId: packageId,
          label: packageData.packageName,
          disabled: true,
          children: _.map(packageData.lessons, lesson => {
            let lessonId = _.toNumber(lesson.id)
            let lessonNo = _.toNumber(lesson.lessonNo)
            return {
              id: `${packageId}-${lessonId}`,
              packageId: packageId,
              disabled: true,
              label: lesson.lessonName,
              lessonId: lessonId,
              lessonNo: lessonNo,
            }
          }),
        }
      })
    },
    isClassDataValid() {
      let classData = this.classData
      return classData.name && classData.name !== ''
    },
    currentClassStudents() {
      let orgClassMembers = _.get(this.orgHistoricalClasses, 'rows', [])
      let orgClassMembersByClassId = _.find(orgClassMembers, i => i.id === +this.classDetail.id)
      let studentList = _.get(orgClassMembersByClassId, 'lessonOrganizationClassMembers', [])
      return _.filter(studentList, student => (student.roleId & 1) > 0)
    },
    currentClassStudentsCount() {
      return this.currentClassStudents.length
    },
  },
  methods: {
    ...mapActions({
      getOrgClassPackages: 'org/getOrgClassPackages',
      getOrgPackagesWithLessons: 'org/getOrgPackagesWithLessons',
      getHistoryClasses: 'org/getHistoryClasses',
    }),
    async initClassData() {
      await this.initTreeData()
      await this.initSelectedLessons()
      let classDetail = this.classDetail
      this.classData = classDetail
    },
    async initTreeData() {
      this.isTreeLoading = true
      await this.getOrgPackagesWithLessons({ organizationId: this.orgId })
      this.isTreeLoading = false
    },
    async initSelectedLessons() {
      let classPackages = await this.getOrgClassPackages({
        organizationId: this.orgId,
        classId: this.classDetail.id,
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
  },
  watch: {
    $route() {
      this.initClassData()
    },
  },
  filters: {
    formatTime(time) {
      return time ? moment(time).format('YYYY/MM/DD HH:mm:ss') : ''
    },
  },
}
</script>
<style lang="scss">
$borderColor: #e8e8e8;
.historical-class-comp {
  background: #fff;
  &-header {
    display: flex;
    height: 56px;
    border-bottom: 1px solid $borderColor;
    padding: 0 24px;
    align-items: center;
    font-size: 16px;
    .el-breadcrumb__inner.is-link {
      color: #999;
    }
  }
  &-form {
    width: 384px;
    padding: 24px 24px 0;
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
  &-student {
    padding: 0 24px 24px;
  }
}
</style>

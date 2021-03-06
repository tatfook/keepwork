<template>
  <div class="org-teacher-statistics" v-if="!isLoading">
    <org-classes-tabbar :classes="orgClasses" @tab-click="handleSwitchClass" v-model="selectedClassId"></org-classes-tabbar>
    <div class="org-teacher-statistics-summary">
      <p class="org-teacher-statistics-summary-count"><span class="org-teacher-statistics-summary-count-key" v-show="lessonCount">{{$t('lesson.attended')}}：</span><span class="org-teacher-statistics-summary-count-value" v-show="lessonCount">{{lessonCount}} {{$t('lesson.classes')}}</span><span class="org-teacher-statistics-summary-count-key" v-show="hours || mins">{{$t('lesson.totalTeachingTime')}}：</span><span v-show="hours">{{hours}} {{$t('lesson.hours')}}</span><span v-show="mins">{{mins}} {{$t('lesson.mins')}}</span></p>
      <p class="org-teacher-statistics-summary-sort" v-show="lessonCount">
        <!-- <img class="org-teacher-statistics-summary-sort-img" src="@/assets/lessonImg/summary/sort.png" alt=""> -->
        <i :class="['iconfont','icon-down', {'icon-active': positiveSequence }]" @click="positiveSequence = true"></i><i :class="['iconfont','icon-up',{'icon-active': !positiveSequence }]" @click="positiveSequence = false"></i>
        <span class="org-teacher-statistics-summary-sort-text" @click="sequence">{{$t('lesson.sortByTeachingTime')}}</span>
      </p>
    </div>
    <div class="org-teacher-statistics-packages">
      <div class="org-teacher-statistics-packages-taught" v-for="(course,index) in selectedClassPackges" :key="index">
        <div class="org-teacher-statistics-packages-taught-cover" @click="enterLesson(course)">
          <img class="org-teacher-statistics-packages-taught-cover-img" :src="course.extra.coverUrl" alt="">
        </div>
        <div class="org-teacher-statistics-packages-taught-desc">
          <h4 class="org-teacher-statistics-packages-taught-desc-title" @click="enterPackage(course)">{{$t('modList.package')}}：{{course.extra.packageName}}</h4>
          <p class="org-teacher-statistics-packages-taught-desc-text"><span class="org-teacher-statistics-packages-taught-desc-text-name">{{$t('modList.lesson')}}{{course.lessonNo}}：</span>{{course.extra.lessonName}}</p>
          <p class="org-teacher-statistics-packages-taught-desc-text"><span class="org-teacher-statistics-packages-taught-desc-text-name">{{$t('lesson.intro')}}：</span>{{course.extra.lessonGoals}}</p>
          <p class="org-teacher-statistics-packages-taught-desc-text"><span class="org-teacher-statistics-packages-taught-desc-text-name">{{$t('lesson.duration')}}：</span>45{{$t('lesson.mins')}}</p>
          <p class="org-teacher-statistics-packages-taught-desc-time">{{course.createdAt | formatTime}}</p>
        </div>
        <div class="org-teacher-statistics-packages-taught-view">
          <span class="org-teacher-statistics-packages-taught-view-button" @click="viewSummary(course)">{{$t('lesson.viewSummary')}}</span>
        </div>
      </div>
    </div>
    <div class="org-teacher-statistics-nothing" v-if="!selectedClassPackges.length">
      <img class="org-teacher-statistics-nothing-img" src="@/assets/lessonImg/class.png" alt="">
      <p class="org-teacher-statistics-nothing-text">{{$t("org.noTeachingRecord")}}</p>
    </div>
  </div>
</template>

<script>
import OrgClassesTabbar from '@/components/org/common/OrgClassesTabbar'
import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'
import moment from 'moment'

export default {
  name: 'OrgTeacherStatistics',
  data() {
    return {
      isLoading: true,
      selectedClassId: '',
      positiveSequence: true,
      currentClassPackages: []
    }
  },
  async created() {
    await this.getOrgClasses({ cache: true })
    await this.getOrgClassPackagesById({ classId: this.firstOrgClassId })
    this.selectedClassId = this.$route.params.classId || this.firstOrgClassId
    if (this.selectedClassId) {
      await this.getTaughtClassroomCourses({ classId: this.selectedClassId })
    }
    this.isLoading = false
  },
  computed: {
    ...mapGetters({
      currentOrg: 'org/currentOrg',
      orgClasses: 'org/teacher/orgClasses',
      classroomCoursesData: 'org/teacher/classroomCoursesData',
      orgClassPackages: 'org/teacher/orgClassPackages'
    }),
    orgId() {
      return _.get(this.currentOrg, 'id')
    },
    firstOrgClassId() {
      return _.get(this.orgClasses, '[0].id', '')
    },
    selectedClassPackges() {
      const packages = _.get(
        this.classroomCoursesData,
        [this.selectedClassId],
        []
      )
      let packagesData = _.get(packages, 'rows', [])
      return packagesData.sort(this.sortByCreatedAt)
    },
    lessonCount() {
      return this.selectedClassPackges.length
    },
    hours() {
      let longTime = this.selectedClassPackges.length * 45
      return parseInt(longTime / 60)
    },
    mins() {
      let longTime = this.selectedClassPackges.length * 45
      return (longTime / 60 - parseInt(longTime / 60)) * 60
    },
    selectedClassName() {
      return _.get(
        _.find(this.orgClasses, item => item.id === this.selectedClassId),
        'name',
        ''
      )
    }
  },
  methods: {
    ...mapActions({
      getOrgClasses: 'org/teacher/getOrgClasses',
      getTaughtClassroomCourses: 'org/teacher/getTaughtClassroomCourses',
      getOrgClassPackagesById: 'org/teacher/getOrgClassPackagesById'
    }),
    sortByCreatedAt(obj1, obj2) {
      return this.positiveSequence
        ? obj1.createdAt >= obj2.createdAt
          ? -1
          : 1
        : obj1.createdAt <= obj2.createdAt
        ? -1
        : 1
    },
    sequence() {
      this.positiveSequence = !this.positiveSequence
    },
    viewSummary(course) {
      this.$router.push({
        path: `package/${course.packageId}/lesson/${
          course.lessonId
        }/classroom/${course.id}/summary`,
        query: {
          classId: course.classId,
          className: this.selectedClassName
        }
      })
    },
    async handleSwitchClass(classId) {
      await this.getTaughtClassroomCourses({ classId })
      this.selectedClassId = classId
    },
    enterPackage(course) {
      this.currentClassPackages = _.get(
        this.orgClassPackages,
        this.selectedClassId,
        []
      )
      let result = this.currentClassPackages.some(item => {
        return item.packageId === course.packageId
      })
      if (!result) {
        this.$message.warning(this.$t('org.noViewPermissions'))
        return
      }
      this.$router.push({
        path: `teach/class/${course.classId}/package/${course.packageId}`
      })
    },
    enterLesson(course) {
      this.currentClassPackages = _.get(
        this.orgClassPackages,
        this.selectedClassId,
        []
      )
      let result = this.currentClassPackages.some(item => {
        return item.packageId === course.packageId
      })
      if (!result) {
        this.$message.warning(this.$t('org.noViewPermissions'))
        return
      }
      this.$router.push({
        path: `teach/class/${course.classId}/package/${
          course.packageId
        }/lesson/${course.lessonId}/lessonPlan`
      })
    }
  },
  filters: {
    formatTime(time) {
      return moment(time).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  components: {
    OrgClassesTabbar
  }
}
</script>
<style lang='scss' scoped>
.org-teacher-statistics {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  &-summary {
    border-top: 1px solid #e8e8e8;
    padding-left: 13px;
    &-count {
      font-size: 14px;
      &-key {
        color: #909399;
      }
      &-value {
        margin-right: 30px;
      }
    }
    &-sort {
      font-size: 12px;
      .icon-down,
      .icon-up {
        font-size: 12px;
        cursor: pointer;
        color: #515253;
      }
      .icon-active {
        color: #0090ff;
      }
      &-text {
        cursor: pointer;
      }
      &-img {
        width: 12px;
      }
    }
  }
  &-packages {
    &-taught {
      padding: 16px;
      border-top: 1px solid #e8e8e8;
      border-bottom: 1px solid #e8e8e8;
      display: flex;
      flex-wrap: wrap;
      margin-top: -1px;
      &-cover {
        width: 266px;
        cursor: pointer;
        &-img {
          width: 100%;
          height: 160px;
          object-fit: cover;
          border-radius: 6px;
        }
      }
      &-desc {
        width: 350px;
        padding-left: 12px;
        &-title {
          margin: 0 0 15px;
          font-size: 20px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          cursor: pointer;
        }
        &-text {
          font-size: 14px;
          color: #909399;
          margin: 0px;
          line-height: 18px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          &-name {
            color: #303133;
          }
        }
        &-time {
          font-size: 14px;
          color: #303133;
          margin: 33px 0 0;
        }
      }
      &-view {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        &-button {
          border-radius: 4px;
          border: solid 1px #409efe;
          color: #409efe;
          font-size: 14px;
          line-height: 30px;
          padding: 0 12px;
          cursor: pointer;
        }
      }
    }
  }
  &-nothing {
    color: #0090ff;
    text-align: center;
    padding-top: 62px;
    &-img {
      max-width: 163px;
    }
    &-text {
      color: #909399;
      font-size: 18px;
      line-height: 44px;
    }
  }
}
</style>


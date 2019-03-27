<template>
  <div class="org-teacher-statistics" v-if="!isLoading">
    <org-classes-tabbar :classes="orgClasses" @tab-click="handleSwitchClass" v-model="selectedClassId"></org-classes-tabbar>
    <div class="org-teacher-statistics-summary">
      <p class="org-teacher-statistics-summary-count"><span class="org-teacher-statistics-summary-count-key">已教：</span><span class="org-teacher-statistics-summary-count-value">{{lessonCount}}堂课</span><span class="org-teacher-statistics-summary-count-key">总授课时长：</span>{{hours}}小时{{mins}}分钟</p>
      <p class="org-teacher-statistics-summary-sort"><img class="org-teacher-statistics-summary-sort-img" src="@/assets/lessonImg/summary/sort.png" alt=""><span class="org-teacher-statistics-summary-sort-text">点击按授课时间排序</span></p>
    </div>
    <div class="org-teacher-statistics-packages">
      <div class="org-teacher-statistics-packages-taught" v-for="(course,index) in selectedClassPackges" :key="index">
        <div class="org-teacher-statistics-packages-taught-cover">
          <img class="org-teacher-statistics-packages-taught-cover-img" :src="course.extra.coverUrl" alt="">
        </div>
        <div class="org-teacher-statistics-packages-taught-desc">
          <h4 class="org-teacher-statistics-packages-taught-desc-title">课程包：{{course.extra.packageName}}</h4>
          <p class="org-teacher-statistics-packages-taught-desc-text"><span class="org-teacher-statistics-packages-taught-desc-text-name">课程{{course.extra.lessonNo}}：</span>{{course.extra.lessonName}}</p>
          <p class="org-teacher-statistics-packages-taught-desc-text"><span class="org-teacher-statistics-packages-taught-desc-text-name">简介：</span>{{course.extra.lessonGoals}}</p>
          <p class="org-teacher-statistics-packages-taught-desc-text"><span class="org-teacher-statistics-packages-taught-desc-text-name">时长：</span>45分钟</p>
          <p class="org-teacher-statistics-packages-taught-desc-time">{{course.updatedAt | formatTime}}</p>
        </div>
        <div class="org-teacher-statistics-packages-taught-view">
          <span class="org-teacher-statistics-packages-taught-view-button" @click="viewSummary(course)">查看课堂总结</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import OrgClassesTabbar from '@/components/org/common/OrgClassesTabbar'
import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'
import dayjs from 'dayjs'

export default {
  name: 'OrgTeacherStatistics',
  data() {
    return {
      isLoading: true,
      selectedClassId: '',
      currentClassPackages: []
    }
  },
  async created() {
    await this.getOrgClasses()
    this.selectedClassId = this.firstOrgClassId
    await this.getTaughtClassroomCourses({ classId: this.selectedClassId })
    this.isLoading = false
  },
  computed: {
    ...mapGetters({
      currentOrg: 'org/currentOrg',
      orgClasses: 'org/teacher/orgClasses',
      classroomCoursesData: 'org/teacher/classroomCoursesData'
    }),
    orgId() {
      return _.get(this.currentOrg, 'id')
    },
    firstOrgClassId() {
      return _.get(this.orgClasses, '[0].id', '')
    },
    selectedClassPackges() {
      const packags = _.get(
        this.classroomCoursesData,
        [this.selectedClassId],
        []
      )
      let packagesData = _.get(packags, 'rows', [])
      return packagesData
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
    }
  },
  methods: {
    ...mapActions({
      getOrgClasses: 'org/teacher/getOrgClasses',
      getTaughtClassroomCourses: 'org/teacher/getTaughtClassroomCourses'
    }),
    viewSummary(course) {
      this.$router.push({
        path: `package/${course.packageId}/lesson/${
          course.lessonId
        }/classroom/${course.id}/summary`
      })
    },
    async handleSwitchClass(classId) {
      this.selectedClassId = classId
      await this.getTaughtClassroomCourses({ classId })
    }
  },
  filters: {
    formatTime(time) {
      return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
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
  border: 1px solid #e8e8e8;
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
        &-img {
          width: 100%;
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
}
</style>


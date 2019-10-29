<template>
  <div class="org-study-package" v-if="!isLoading">
    <div class="org-study-breadcrumb">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ name: 'Lesson'}">课程</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ name: 'PackageDetail', params: { packageId  } }">课程包</el-breadcrumb-item>
        <el-breadcrumb-item>{{lessonName}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <Lesson-header :lesson="lessonHeaderData" :isCurrentClassroom="false"></Lesson-header>
    <lesson-wrap-by-glass :lessonMain="lessonMain" :organizations="organizations"></lesson-wrap-by-glass>
  </div>
</template>


<script>
import LessonHeader from '@/components/org/common/OrgLessonHeader'
import LessonWrapByGlass from './common/LessonWrapByGlass'
import { lesson, keepwork } from '@/api'
import Parser from '@/lib/mod/parser'
import _ from 'lodash'
export default {
  name: 'PackageDetail',
  components: {
    LessonHeader,
    LessonWrapByGlass
  },
  data() {
    return {
      isLoading: true,
      packageId: '',
      organizations: [],
      lessonDetail: {}
    }
  },
  async created() {
    try {
      const { packageId, lessonId } = this.$route.params
      this.packageId = packageId
      await this.getLessonDetail({
        packageId: _.toNumber(packageId),
        lessonId: _.toNumber(lessonId)
      })
      window.document.title = this.lessonName
    } catch (error) {
      console.error(error)
    }
    this.isLoading = false
  },
  destroyed() {
    window.document.title = 'Keepwork'
  },
  methods: {
    async getLessonDetail({ lessonId, packageId }) {
      const [res, detail] = await Promise.all([
        lesson.lessons.lessonContent({ lessonId }),
        lesson.lessons.lessonDetail({ lessonId })
      ])
      const modList = Parser.buildBlockList(res.content)
      const quiz = modList
        .filter(item => {
          return item.cmd === 'Quiz' && !_.isEmpty(item.data)
        })
        .map(({ data: { quiz: { data } } }) => ({
          key: data[0].id,
          data: data[0],
          result: null,
          answer: null
        }))
      this.lessonDetail = {
        lessonId,
        lesson: detail,
        quiz,
        modList
      }
    }
  },
  computed: {
    currentPackageName() {
      return _.get(this.packageDetail, 'packageName', '')
    },
    lesson() {
      return this.lessonDetail.modList || []
    },
    userId() {
      return _.get(this.userinfo, 'id', '')
    },
    lessonHeaderData() {
      return this.lessonDetail.lesson || {}
    },
    lessonName() {
      return this.lessonHeaderData.lessonName || 'KeepWork'
    },
    lessonMain() {
      return this.lesson.filter(({ cmd }) => cmd !== 'Lesson')
    }
  }
}
</script>


<style lang="scss" scoped>
.org-study-package {
  .org-study-breadcrumb {
    max-width: 1200px;
    margin: 0 auto;
    box-sizing: border-box;
  }
}
</style>

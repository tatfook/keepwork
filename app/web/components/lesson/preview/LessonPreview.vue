<template>
  <div class="lesson-preview" v-if="!isLoading">
    <lesson-header :data="lessonHeaderData" :isPreview="true" />
    <lesson-wrap v-for="mod in lessonQuiz" :key="mod.key" :mod="mod"/>
  </div>
</template>

<script>
import LessonHeader from '@/components/lesson/common/LessonHeader'
import LessonWrap from '@/components/lesson/common/LessonWrap'
import axios from 'axios'

export default {
  name: 'LessonPreview',
  components: {
    LessonWrap,
    LessonHeader
  },
  data() {
    return {
      lessonHeaderData: {},
      lessonQuiz: [],
      isLoading: true
    }
  },
  async created() {
    const { packageId = '', lessonId = '' } = this.$route.params
    // if (!packageId || lessonId) {
    //   return this.$router.push('/')
    // }
    const instance = axios.create({
      baseURL: process.env.LESSON_API_PREFIX,
      timeout: 20000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/json; charset=UTF-8'
      }
    })
    try {
      const [detail, content] = await Promise.all([
        instance.get(`lessons/${lessonId}/detail`),
        instance.get(`lessons/${lessonId}/contents`)
      ])
      this.lessonHeaderData = detail.data
      // this.lessonQuiz = content.data
      this.isLoading = false
    } catch (error) {
      this.isLoading = false
      console.error(error)
    }
  }
}
</script>




<template>
  <div class="lesson-preview" v-loading.fullscreen.lock="isLoading" element-loading-text="拼命加载中" element-loading-background="#fff">
    <lesson-header :lesson="lessonHeaderData" :isPreview="true" />
    <lesson-wrap v-for="mod in modList" :key="mod.key" :mod="mod" :isPreview="true" />
  </div>
</template>

<script>
import LessonHeader from '@/components/org/common/OrgLessonHeader'
import LessonWrap from '@/components/org/common/LessonWrap'
import axios from 'axios'
import { requestWithoutToken, users } from '@/api/lesson'
import Parser from '@/lib/mod/parser'
import _ from 'lodash'

export default {
  name: 'LessonPreview',
  components: {
    LessonWrap,
    LessonHeader
  },
  data() {
    return {
      lessonHeaderData: {},
      modList: [],
      isLoading: true
    }
  },
  async created() {
    const { lessonId = '' } = this.$route.params
    const { token } = this.$route.query
    const routeName = this.$route.name
    let type = 'content'
    if (/LessonPreviewCourseware/g.test(routeName)) {
      type = 'courseware'
    }
    if (!token) {
      return this.$router.push('/')
    }
    const res = await users.verifyToken({ token }).catch(e => {
      this.$router.push('/')
    })
    try {
      const { href } = this.$router.resolve({ path: this.$route.path })
      history.replaceState('', '', href)
      const [detail, contents] = await Promise.all([
        requestWithoutToken.get(`lessons/${lessonId}/detail`),
        requestWithoutToken.get(`lessons/${lessonId}/contents`)
      ])
      this.lessonHeaderData = detail.data.data
      const _modList = Parser.buildBlockList(contents.data.data[type])
      this.modList = _modList.filter(item => item.cmd !== 'Lesson')
    } catch (error) {
      console.error(error)
    } finally {
      this.isLoading = false
    }
  }
}
</script>

<style lang="scss">
.lesson-preview {
  padding-bottom: 100px;
  counter-reset: no;
  .quiz-no::after {
    counter-increment: no;
    content: counter(no);
  }
}
</style>





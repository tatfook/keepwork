<template>
  <div class="lesson-preview" v-if="!isLoading">
    <lesson-header :data="lessonHeaderData" :isPreview="true" />
    <lesson-wrap v-for="mod in modList" :key="mod.key" :mod="mod" />
  </div>
</template>

<script>
import LessonHeader from '@/components/lesson/common/LessonHeader'
import LessonWrap from '@/components/lesson/common/LessonWrap'
import axios from 'axios'
import { requestWithoutToken, users } from '@/api/lesson'
import Parser from '@/lib/mod/parser'

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
      this.lessonHeaderData = detail.data
      const _modList = Parser.buildBlockList(contents.data.content)
      this.modList = _modList.filter(item => item.cmd !== 'Lesson')
      this.isLoading = false
    } catch (error) {
      this.isLoading = false
      console.error(error)
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





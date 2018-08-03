<template>
  <div class="lesson-wrap">
    <lesson-wrap v-for="(item,index) in lesson" :key="index" :data="item" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import LessonWrap from './LessonWrap'
export default {
  name: 'Learn',
  components: {
    'lesson-wrap': LessonWrap
  },
  data() {
    return {
      lessonId: ''
    }
  },
  async mounted() {
    this.lessonId = this.$route.params.id || 1
    await this.getLessonContent({ lessonId: this.lessonId })
    console.log(this.lesson)
    console.log(this.alphabet)
    console.log(this.lessonCompData)
  },
  methods: {
    ...mapActions({
      getLessonContent: 'lesson/student/getLessonContent'
    }),
    genAlphabet() {
      let start = 65
      let alphabet = Array.from({ length: 26 }, () =>
        String.fromCharCode(start++)
      )
      return alphabet
    }
  },
  computed: {
    ...mapGetters({
      lessonContent: 'lesson/student/lessonContent',
      lessonContentFormat: 'lesson/student/lessonContentFormat'
    }),
    alphabet() {
      console.warn('genAlphabet--->')
      return this.genAlphabet()
    },
    lesson() {
      return this.lessonContentFormat(this.lessonId)
    }
  }
}
</script>


<style lang="scss">

</style>


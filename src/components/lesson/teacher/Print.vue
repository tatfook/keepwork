<template>
  <div class="print" ref="print">
    <div class="print-header">
      <div class="profile">
        <img :src='userProfile.portrait' alt="portrait">
      </div>
      <div class="nickname">{{username}}</div>
    </div>
    <div class="print-content">
      <lesson-teacher-summary></lesson-teacher-summary>
    </div>
    <div class="print-lesson-plan">
      <lesson-wrap v-for="(item,index) in modList" :key="index" :data="item" :isPreview="true" :isPrint="true"></lesson-wrap>
    </div>
  </div>
</template>

<script>
import LessonTeacherSummary from './LessonTeacherSummary'
import { mapActions,mapGetters } from 'vuex'
import LessonWrap from '@/components/lesson/common/LessonWrap'
import { lesson } from '@/api'
import Parser from '@/lib/mod/parser'
export default {
  name: 'Print',
  data(){
    return {
      modList: []
    }
  },
  components: {
    LessonTeacherSummary,
    LessonWrap
  },
  async mounted(){
    await this.getProfile()
    let res = await lesson.lessons.lessonContent({
      lessonId: 1
    })
    this.modList = Parser.buildBlockList(res.content)
    setTimeout(()=>{
      let originHtml = document.body.innerHTML
      let printHtml = this.$refs.print.innerHTML
      document.body.innerHTML = printHtml
      window.print()
      document.body.innerHTML = originHtml
      },2000)
  },
  computed: {
    ...mapGetters({
    userProfile: 'user/profile',
    username: 'user/username',
    })
  },
  methods: {
    ...mapActions ({
      getProfile: 'user/getProfile'
    })
  }
}
</script>

<style lang="scss">
.print{
  &-header{
    width: 1149px;
    margin: 0 auto;
    padding: 40px;
    background: #fff;
    text-align: center;
    .profile{
      margin: 0 auto;
      height: 100px;
      width: 100px;
      border-radius: 50%;
      overflow: hidden;
      img{
        width: 100%;
        object-fit: cover;
      }
    }
    .nickname{
      font-size: 24px;
      line-height: 34px;
      letter-spacing: 1px;
	    color: #333333;
    }
  }
}
</style>


<template>
    <div class="lesson-hint-toggle">
        <el-tooltip v-show="!isShowHint" placement="top">
            <div slot="content">{{$t('lesson.showAllTips')}}</div>
            <div class="toggle-button" @click.stop="toggleHint">
                <span class="icon show-icon"></span>{{$t('lesson.showAll')}}</div>
        </el-tooltip>
        <el-tooltip v-show="isShowHint" placement="top">
            <div slot="content">{{$t('lesson.hideAllTips')}}</div>
            <div class="toggle-button" @click.stop="toggleHint">
                <span class="icon hide-icon"></span>{{$t('lesson.hideAll')}}</div>
        </el-tooltip>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  name: 'LessonHintToggle',
  data() {
    return {}
  },
  methods: {
    ...mapActions({
      toggleHint: 'lesson/teacher/toggleHint'
    })
  },
  computed: {
    ...mapGetters({
      isShowHint: 'lesson/teacher/isShowHint'
    })
  }
}
</script>

<style lang="scss">
.lesson-hint-toggle {
  max-width: 1080px;
  margin: 0 auto;
  display: flex;
  height: 50px;
  flex-direction: row-reverse;
  background: white;
  .toggle-button {
    cursor: pointer;
    padding: 0px 20px 10px;
    display: flex;
    align-items: center;
    color: #9a9a9a;
    .tips {
      background: black;
      color: white;
      padding: 20px 10px;
    }
    .icon {
      display: inline-block;
      position: relative;
      height: 30px;
      width: 30px;
      margin: 0 10px;
      &.show-icon {
        background: url('../../../assets/lessonImg/show.png') center center
          no-repeat;
      }
      &.hide-icon {
        background: url('../../../assets/lessonImg/hide.png') center center
          no-repeat;
      }
    }
  }
}
</style>



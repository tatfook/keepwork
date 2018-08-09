<template>
  <el-row class="lesson-container">
    <el-dialog :visible.sync="dialogVisible" width="50%">
      <video controls="" width="100%" autoplay="" name="media">
        <source :src="animation" type="video/mp4">
      </video>
    </el-dialog>
    <el-row>
      <el-col :span="14" class="lesson-cover" @click.native="openAnimations">
      </el-col>
      <el-col :span="10" class="lesson-desc">
        <div class="lesson-desc-title">
          {{$t('card.lesson')}} {{lessonNo}}: {{title}}
        </div>
        <div class="lesson-desc-goals">
          {{$t('card.lessonGoals')}}
          <el-scrollbar class="lesson-desc-goals-list" :native="false">
            {{lessonGoals}}
          </el-scrollbar>
        </div>
      </el-col>
    </el-row>
    <div class="division"></div>
    <keep-wrok-sticky>
      <el-row :gutter="20" class="lesson-progress-wrap">
        <el-col :span="2" class="lesson-award">
          <lesson-jewel-box />
        </el-col>
        <el-col :span="18">
          <lesson-progress/>
        </el-col>
        <el-col :span="4" class="lesson-references">
          <lesson-referencse/>
        </el-col>
      </el-row>
    </keep-wrok-sticky>

  </el-row>
</template>

<script>
import _ from 'lodash'
import LessonJewelBox from './LessonJewelBox'
import LessonProgress from './LessonProgress'
import LessonReferences from './LessonReferences'
import KeepWorkSticky from './KeepWorkSticky'
export default {
  name: 'Lesson',
  components: {
    'lesson-jewel-box': LessonJewelBox,
    'lesson-progress': LessonProgress,
    'keep-wrok-sticky': KeepWorkSticky,
    'lesson-referencse': LessonReferences
  },
  data() {
    return {
      dialogVisible: false
    }
  },
  props: {
    data: Object,
    originData: Array
  },
  mounted() {
    console.log(this.quizs)
  },
  methods: {
    openAnimations() {
      this.dialogVisible = true
    }
  },
  computed: {
    quizs() {
      return this.originData.filter(item => item.cmd === 'Quiz')
    },
    lesson() {
      return _.get(this.data, 'data.lesson', {})
    },
    codeReadLine() {
      return _.get(this.lesson, 'CodeReadLine', 0)
    },
    commands() {
      return _.get(this.lesson, 'Commands', 0)
    },
    codeWriteLine() {
      return _.get(this.lesson, 'CodeWriteLine', 0)
    },
    lessonNo() {
      return _.get(this.lesson, 'LessonNo', 1)
    },
    lessonGoals() {
      return _.get(this.lesson, 'LessonGoals', '')
    },
    title() {
      return _.get(this.lesson, 'Title', '')
    },
    animation() {
      return _.get(this.lesson, 'AnimationOfTheLesson', '')
    }
  }
}
</script>


<style lang="scss">
body {
  background: rgb(250, 250, 250);
}

.division {
  height: 30px;
  background: white;
  border-bottom: 1px solid #d2d2d2;
}

.lesson-container {
  max-width: 1080px;
  margin: 30px auto;
  $green: #66cd2e;
  $grey: #d2d2d2;

  .lesson-cover {
    height: 340px;
    min-width: 400px;
    max-width: 600px;
    cursor: pointer;
    background: #eee;
    opacity: 0.8;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    &::after {
      content: '';
      width: 100px;
      height: 100px;
      background: url('/static/adi/lesson/play_btn_action.png') center center
        no-repeat;
      background-size: contain;
    }
  }

  .lesson-desc {
    padding: 0 20px;

    &-title {
      font-size: 20px;
      color: black;
    }

    &-goals {
      margin-top: 20px;
      font-size: 18px;
      color: #4c4c4c;
      &-list {
        font-family: inherit;
        font-size: 16px;
        white-space: pre-line;
        line-height: 1.5;
        height: 210px;
        .el-scrollbar__wrap {
          overflow-x: hidden;
        }
      }
    }
  }
  .lesson-progress-wrap {
    box-sizing: border-box;
    background: white;
    padding: 40px 20px;
    display: flex;
    align-items: center;
    &.el-row {
      // fix inline elrow style margin-left and right -10px;
      margin: 0 !important;
    }
    .lesson-award {
    }

    .lesson-references {
      display: flex;
      justify-content: flex-end;
    }
  }
}
</style>




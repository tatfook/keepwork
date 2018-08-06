<template>
  <el-row class="lesson-container">
    <el-dialog :visible.sync="dialogVisible" width="50%">
      <video  controls="" width="100%" autoplay="" name="media">
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

  </el-row>
</template>

<script>
export default {
  name: 'Lesson',
  data() {
    return {
      dialogVisible: false
    }
  },
  props: {
    data: Object
  },
  mounted() {
    console.log(this.data)
  },
  methods: {
    openAnimations() {
      this.dialogVisible = true
    }
  },
  computed: {
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
.lesson-container {
  max-width: 1080px;
  margin: 30px auto;

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
}
</style>




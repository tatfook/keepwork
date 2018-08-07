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

    <el-row :gutter="20" class="lesson-progress-wrap">
      <el-col :span="4" class="lesson-award">
        <jewel-box />
      </el-col>
      <el-col :span="16" class="lesson-progress">
        <div class="my-progress">
          <span class="progress-point start"></span>
          <el-progress class="progress-line" :text-inside="true" :show-text="false" :stroke-width="18" :percentage="50" status="success"></el-progress>
          <span class="progress-point end grey"></span>
        </div>
      </el-col>
      <el-col :span="4" class="lesson-references">
        <referencse/>
      </el-col>
    </el-row>

  </el-row>
</template>

<script>
import JewelBox from './JewelBox'
import Referencse from './References'
export default {
  name: 'Lesson',
  components: {
    'jewel-box': JewelBox,
    referencse: Referencse
  },
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
body {
  background: rgb(250, 250, 250);
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
    border-top: 1px solid $grey;
    margin: 40px 5px;
    padding: 40px 0;
    .lesson-award {
    }

    .lesson-progress {
      .my-progress {
        display: flex;
        flex-direction: row;
        align-items: center;
        .progress-point {
          $size: 30px;
          display: inline-block;
          height: $size;
          width: $size;
          border-radius: 50%;
          background: $green;
          border: 6px solid white;
          box-shadow: 1px 3px 6px rgb(185, 185, 185);
          &.grey {
            $size: 33px;
            background: $grey;
            height: $size;
            width: $size;
            border: 3px solid white;
          }
          &.start {
            position: relative;
            z-index: 9;
            margin-right: -25px;
          }
          &.end {
            position: relative;
            margin-left: -25px;
            z-index: 9;
          }
        }
        .progress-line {
          flex: 1;
        }
        .el-progress-bar__outer {
          background-color: $grey;
        }
      }
    }

    .lesson-references {
    }
  }
}
</style>




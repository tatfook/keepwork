<template>
  <el-row class="lesson-header">
    <!-- vidioDialog -->
    <el-dialog :visible.sync="dialogVisible" width="50%">
      <video controls="" width="100%" autoplay="" name="media">
        <source :src="animation" type="video/mp4">
      </video>
    </el-dialog>
    <!-- classIdDialog -->
    <el-dialog :visible.sync="classIdDialogVisible" center custom-class="class-id-dialog" width="50%">
      <div>The class ID is
        <span class="class-id">123 456 789</span>
      </div>
      <div>Please let your students login with this identifier to play paracraft. And you could view students' real-time information below the menu
        <span class="performance">Stuents'Performance</span>
      </div>
      <div class="tips">
        <span class="attention">Attention:</span> Class ID is the unique identifier for this class. Students in this class need to login with this identifier to start learning the lesson. This ensures the student learning data is sent to the system correctly.</div>
      <span slot="footer">
        <el-button @click="classIdDialogVisible = false" class="lesson-confirm-button" type="primary">OK</el-button>
      </span>
    </el-dialog>
    <!-- classId full screen -->
    <el-dialog :visible.sync="classIdFullScreen" :fullscreen="true" custom-class="class-id-full-page" top="0">
      <div class="full-font">123 456 789</div>
    </el-dialog>
    <!-- lesson info -->
    <el-row>
      <el-col :span="14" class="lesson-cover" @click.native="openAnimations">
      </el-col>
      <el-col :span="10" class="lesson-desc">
        <div v-if="isTeacher" class="class-id-sign-wrap">
          <el-tooltip placement="bottom">
            <div slot="content">Click to full page</div>
            <div class="class-id-sign" @click="classIdToFullScreen"> Class ID: 123 456 789</div>
          </el-tooltip>
          <el-tooltip placement="bottom">
            <div slot="content" style="max-width: 400px; font-size: 14px; line-height: 18px; padding:10px 20px;">
              Class ID is the unique identifier for this class. Students in this class need to enter the class with this identifier to start learning the lesson. This ensures the student learning data is sent to the system correctly.
            </div>
            <span class="question-mark-icon"></span>
          </el-tooltip>
        </div>
        <div class="lesson-desc-title">
          {{$t('card.lesson')}} {{lessonNo}}: {{title}}
        </div>
        <div class="lesson-desc-goals">
          {{$t('card.lessonGoals')}}
          <el-scrollbar class="lesson-desc-goals-list" :native="false">
            {{lessonGoals}}
          </el-scrollbar>
          <div v-if="isTeacher" class="lesson-button-wrap">
            <el-button @click="beginTheClass" type="primary" class="lesson-button" size="medium">Begin the class</el-button>
            <!-- <el-button @click="dimissTheClass" type="primary" class="lesson-button" size="medium">下课</el-button> -->
            <span class="lesson-button-tips">(Click here to begin the class)</span>
          </div>
        </div>
      </el-col>
    </el-row>
    <div class="division"></div>
    <keep-wrok-sticky>
      <el-row v-if="isTeacher" :gutter="20" class="lesson-progress-wrap">
        <el-col :span="20">
          <lesson-teacher-progress/>
        </el-col>
        <el-col :span="4" class="lesson-references">
          <lesson-referencse/>
        </el-col>
      </el-row>
      <el-row v-else :gutter="20" class="lesson-progress-wrap">
        <el-col :span="2" class="lesson-award">
          <lesson-jewel-box />
        </el-col>
        <el-col :span="18">
          <lesson-student-progress/>
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
import LessonJewelBox from '../student/LessonJewelBox'
import LessonStudentProgress from '../student/LessonStudentProgress'
import LessonTeacherProgress from '../teacher/LessonTeacherProgress'
import LessonReferences from './LessonReferences'
import KeepWorkSticky from './KeepWorkSticky'
export default {
  name: 'LessonHeader',
  components: {
    'lesson-jewel-box': LessonJewelBox,
    'lesson-student-progress': LessonStudentProgress,
    'lesson-teacher-progress': LessonTeacherProgress,
    'keep-wrok-sticky': KeepWorkSticky,
    'lesson-referencse': LessonReferences
  },
  props: {
    data: Object,
    isTeacher: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialogVisible: false,
      classIdDialogVisible: false,
      classIdFullScreen: false
    }
  },
  mounted() {
    // teacher identity
    if (this.isTeacher) {
    }
  },
  methods: {
    openAnimations() {
      this.dialogVisible = true
    },
    classIdToFullScreen() {
      this.classIdFullScreen = true
    },
    beginTheClass() {
      // TODO: 请求classroom接口, 成功后弹出classId
      // if (false) {
      //   return this.$message.error('上课失败，请干嘛干嘛')
      // }
      this.classIdDialogVisible = true
    },
    dimissTheClass() {}
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

.division {
  height: 30px;
  background: white;
  border-bottom: 1px solid #d2d2d2;
}

.lesson-header {
  max-width: 1080px;
  margin: 50px auto 0;
  $green: #66cd2e;
  $grey: #d2d2d2;
  .class-id-dialog {
    .class-id {
      color: #f75858;
      font-weight: bold;
      font-size: 22px;
    }
    .performance {
      color: #1982ff;
      font-weight: 500;
    }
    .tips {
      margin-top: 20px;
      color: #a9a9a9;
      .attention {
        color: #f75858;
      }
    }
  }

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
    position: relative;
    .class-id-sign-wrap {
      display: flex;
      align-items: center;
      position: absolute;
      top: -36px;
      .class-id-sign {
        font-size: 20px;
        background: #ed9f21;
        display: inline-block;
        padding: 1px 10px;
        border-radius: 3px;
        color: white;
        cursor: pointer;
      }
      .question-mark-icon {
        display: inline-block;
        cursor: pointer;
        width: 32px;
        height: 32px;
        margin-left: 5px;
        background: url('../../../assets/lessonImg/question_mark.png') no-repeat
          center center;
      }
    }
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
  .lesson-button-wrap {
    .lesson-button {
      height: 36px;
      width: 190px;
      &:last-child {
        display: none;
      }
    }
    .lesson-button-tips {
      color: #a9a9a9;
      font-size: 14px;
      margin-left: 10px;
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
    .lesson-references {
      display: flex;
      justify-content: flex-end;
    }
  }

  .class-id-dialog {
    .lesson-confirm-button {
      height: 42px;
      width: 158px;
      font-size: 18px;
    }
  }
  .class-id-full-page {
    display: flex;
    align-items: center;
    justify-content: center;
    .full-font {
      font-size: 15vw;
      font-weight: bold;
    }
  }
}
</style>




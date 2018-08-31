<template>
  <el-row class="lesson-header-container">
    <el-dialog :visible.sync="dialogVisible" width="50%">
      <video controls="" width="100%" autoplay="" name="media">
        <source :src="animation" type="video/mp4">
      </video>
    </el-dialog>
    <el-dialog :visible.sync="classIdDialogVisible" center custom-class="class-id-dialog" width="600">
      <div>{{$t('lesson.curentClassId')}}
        <span class="class-id">{{classroomId}}</span>
      </div>
      <div v-html="$t('lesson.studentEnterClassId',{StuentsPerformance:`<span class='performance'>${$t('lesson.StuentsPerformance')}</span>`})">
      </div>
      <div class="tips" v-html="$t('lesson.studentAttention',{Attention:`<span class='attention'>${$t('lesson.attention')}</span>`})">
      </div>
      <span slot="footer">
        <el-button @click="classIdDialogVisible = false" class="lesson-confirm-button" type="primary">{{$t('common.Sure')}}</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="classIdFullScreen" :fullscreen="true" custom-class="class-id-full-page" top="0">
      <div class="full-font">{{classroomId | idPretty}}</div>
    </el-dialog>
    <el-row>
      <el-col :span="14" class="lesson-cover" @click.native="openAnimations">
      </el-col>
      <el-col :span="10" class="lesson-desc">
        <div v-if="isTeacher && isBeInClass && isInCurrentClass && !isClassIsOver" class="class-id-sign-wrap">
          <el-tooltip placement="bottom">
            <div slot="content">{{$t('lesson.fullPage')}}</div>
            <div class="class-id-sign" @click="classIdToFullScreen"> {{$t('lesson.class')}} ID: {{classroomId}}</div>
          </el-tooltip>
          <el-tooltip placement="bottom">
            <div slot="content" style="max-width: 400px; font-size: 14px; line-height: 18px; padding:10px 20px;">
              <div v-html="$t('lesson.classIdExplain',{ classId: `<span style='color:red'> ${$t('lesson.class')} ID</span>` })"></div>
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
            <el-button v-if="isBeInClass && isInCurrentClass" @click="handleDismissTheClass" :disabled="isClassIsOver" type="primary" :class="['lesson-button',{'class-is-over': isClassIsOver}]" size="medium">{{$t('lesson.dismiss')}}</el-button>
            <el-button v-else @click="handleBeginTheClass" :disabled="isBeInClass && !isInCurrentClass" type="primary" class="lesson-button" size="medium">{{$t('lesson.begin')}}</el-button>
            <span v-if="isBeInClass && isInCurrentClass" class="lesson-button-tips">{{$t('lesson.dismissTips')}}</span>
            <span v-else class="lesson-button-tips">{{$t('lesson.beginTips')}}</span>
          </div>

        </div>
      </el-col>
    </el-row>
    <keep-work-sticky>
      <el-row v-if="isTeacher" :gutter="20" class="lesson-progress-wrap">
        <el-col :span="20">
          <lesson-teacher-progress :reset="!isInCurrentClass" />
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
    </keep-work-sticky>

  </el-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import axios from 'axios'
import qs from 'qs'
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
    'keep-work-sticky': KeepWorkSticky,
    'lesson-referencse': LessonReferences
  },
  filters: {
    idPretty(value) {
      return _.map(_.chunk(value.toString().split(''), 3), i =>
        i.join('')
      ).join(' ')
    }
  },
  props: {
    data: Object,
    isTeacher: {
      type: Boolean,
      default: false
    },
    isInCurrentClass: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dialogVisible: false,
      classIdDialogVisible: false,
      classIdFullScreen: false,
      _interval: null
    }
  },
  methods: {
    ...mapActions({
      beginTheClass: 'lesson/teacher/beginTheClass',
      dismissTheClass: 'lesson/teacher/dismissTheClass',
      updateLearnRecords: 'lesson/teacher/updateLearnRecords'
    }),
    openAnimations() {
      this.dialogVisible = true
    },
    classIdToFullScreen() {
      this.classIdFullScreen = true
    },
    leaveConfirm(event) {
      event.returnValue = 'are you ok?'
    },
    async handleBeginTheClass() {
      if (this.userInfo.identify !== 2) {
        const h = this.$createElement
        // this.$t('lesson.teacherFunction')
        return this.$confirm(
          h(
            'span',
            { style: 'color: #F56C6C' },
            this.$t('lesson.teacherFunction')
          ),
          '',
          {
            confirmButtonText: this.$t('lesson.activate'),
            cancelButtonText: this.$t('lesson.no'),
            type: 'warning'
          }
        )
          .then(() => {
            this.$router.push(`/teacher`)
          })
          .catch(e => {
            console.error(e)
          })
      }
      if (!this.isInCurrentClass) return
      const { packageId, lessonId } = this.$route.params
      await this.beginTheClass({
        packageId: Number(packageId),
        lessonId: Number(lessonId)
      })
        .then(res => {
          this.classIdDialogVisible = true
          this.$emit('intervalUpdateLearnRecords')
          window.addEventListener('beforeunload', this.leaveConfirm, true)
        })
        .catch(e => {
          this.$message.error(this.$t('lesson.beginTheClassFail'))
          this.$emit('clearUpdateLearnRecords')
          console.error(e)
        })
    },
    async handleDismissTheClass() {
      await this.$confirm(
        this.$t('lesson.dismissConfirm'),
        this.$t('lesson.dismiss'),
        {
          type: 'warning',
          distinguishCancelAndClose: true,
          confirmButtonText: this.$t('common.Sure'),
          cancelButtonText: this.$t('common.Cancel')
        }
      )
        .then(async () => {
          await this.dismissTheClass()
            .then(res => {
              this.$emit('clearUpdateLearnRecords')
              window.removeEventListener(
                'beforeunload',
                this.leaveConfirm,
                true
              )
            })
            .catch(e => {
              this.$message.error(this.$t('lesson.failure'))
              console.error(e)
            })
        })
        .catch(e => console.error(e))
    }
  },
  computed: {
    ...mapGetters({
      isBeInClass: 'lesson/teacher/isBeInClass',
      classroomId: 'lesson/teacher/classroomId',
      isClassIsOver: 'lesson/teacher/isClassIsOver',
      classroom: 'lesson/teacher/classroom',
      isBeInClassroom: 'lesson/student/isBeInClassroom',
      userInfo: 'lesson/userinfo'
    }),
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
.lesson-header-container {
  max-width: 1229px;
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
      &.class-is-over {
        background: #d2d2d2;
        border-color: #d2d2d2;
      }
    }
    .lesson-button-tips {
      color: #a9a9a9;
      font-size: 14px;
      margin-left: 5px;
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




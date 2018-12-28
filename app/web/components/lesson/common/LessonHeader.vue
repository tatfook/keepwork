<template>
  <el-row class="lesson-header-container">
    <el-dialog class="lesson-header-container-video" :visible.sync="dialogVisible" width="50%">
      <video v-if="dialogVisible" controls="" width="100%" autoplay="" name="media">
        <source :src="videoUrl" type="video/mp4">
      </video>
    </el-dialog>
    <el-dialog :visible.sync="classIdDialogVisible" center custom-class="class-id-dialog" width="600px">
      <div>{{$t('lesson.curentClassId')}}
        <span class="class-id">C{{classroomId}}</span>
      </div>
      <div v-html="$t('lesson.studentEnterClassId',{studentsPerformance:`<span class='performance'>${$t('lesson.studentsPerformance')}</span>`})">
      </div>
      <div class="tips" v-html="$t('lesson.studentAttention',{Attention:`<span class='attention'>${$t('lesson.attention')}</span>`})">
      </div>
      <span slot="footer">
        <el-button @click="classIdDialogVisible = false" class="lesson-confirm-button" type="primary">{{$t('common.Sure')}}</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="classIdFullScreen" :fullscreen="true" custom-class="class-id-full-page" top="0">
      <div class="full-font">C {{classroomId | idPretty}}</div>
    </el-dialog>
    <el-row>
      <el-col :sm="14" :xm="24" class="lesson-cover" :style="loadCover()" @click.native="openAnimations">
        <img v-if="isHasVideo" src="@/assets/lessonImg/play2.png" alt="">
      </el-col>
      <el-col :sm="10" :xm="24" class="lesson-desc">
        <div v-if="isTeacher && isBeInClass && isInCurrentClass && !isClassIsOver" class="class-id-sign-wrap">
          <el-tooltip placement="bottom">
            <div slot="content">{{$t('lesson.fullPage')}}</div>
            <div class="class-id-sign" @click="classIdToFullScreen"> {{$t('lesson.class')}} ID: C{{classroomId}}</div>
          </el-tooltip>
          <el-tooltip placement="bottom">
            <div slot="content" style="max-width: 400px; font-size: 14px; line-height: 18px; padding:10px 20px;">
              <div v-html="$t('lesson.classIdExplain',{ classId: `<span style='color:red'> ${$t('lesson.class')} ID</span>` })"></div>
            </div>
            <span class="question-mark-icon"></span>
          </el-tooltip>
        </div>
        <div v-if="isSelfLearning" class="class-id-sign-wrap">
          <div class="class-id-sign"> {{$t('lesson.lessonId')}} {{haqiCode}}</div>
          <el-tooltip placement="bottom">
            <div slot="content" style="max-width: 400px; font-size: 14px; line-height: 18px; padding:10px 20px;">
              <div v-html="$t('lesson.haqiIdExplain')"></div>
            </div>
            <span @click="handleExplanHaqiCode" class="question-mark-icon"></span>
          </el-tooltip>
        </div>

        <div class="lesson-info title">
          {{$t('card.lesson')}} {{lessonNo}}: {{lessonName}}
        </div>
        <div class="lesson-info intro">
          <div class="intro-title">
            {{$t('lesson.intro')}}:
          </div>
          <el-scrollbar class="intro-list" :native="false">
            {{lessonGoals}}
          </el-scrollbar>
        </div>
        <div class="lesson-info duration">{{$t('lesson.duration')}}: 45 {{$t('lesson.mins')}}</div>
        <div class="lesson-info skills">
          <div class="skills-title">
            {{$t('lesson.skillPoints')}}:
          </div>
          <el-scrollbar :class="['skills-list',{'reset-height': isTeacher}]" :native="false">
            <div v-for="(item, index) in lessonSkills" :key="index">{{item}}</div>
          </el-scrollbar>
        </div>
        <div v-if="isTeacher" class="lesson-button-wrap">
          <el-button v-if="isBeInClass && isInCurrentClass" @click="handleDismissTheClass" :disabled="isClassIsOver" type="primary" :class="['lesson-button',{'class-is-over': isClassIsOver}]" size="medium">{{$t('lesson.dismiss')}}</el-button>
          <el-button v-if="(!isBeInClass || !isInCurrentClass) && userIsTeacher" @click="handleBeginTheClass" :disabled="isBeInClass && !isInCurrentClass" type="primary" class="lesson-button" size="medium">{{$t('lesson.begin')}}</el-button>
          <span v-if="isBeInClass && isInCurrentClass" class="lesson-button-tips">{{$t('lesson.dismissTips')}}</span>
          <span v-if="(!isBeInClass || !isInCurrentClass) && userIsTeacher" class="lesson-button-tips">{{$t('lesson.beginTips')}}</span>
        </div>
      </el-col>
    </el-row>
    <keep-work-sticky>
      <el-row v-if="isTeacher" :gutter="20" class="lesson-progress-wrap">
        <el-col :span="20" :sm="20">
          <lesson-teacher-progress :reset="!isInCurrentClass" />
        </el-col>
        <el-col :span="4" :sm="4" class="lesson-references">
          <lesson-referencse />
        </el-col>
      </el-row>
      <el-row v-else :gutter="20" class="lesson-progress-wrap">
        <el-col :span="2" :sm="2" class="lesson-award">
          <lesson-jewel-box v-if="!isVisitor" />
        </el-col>
        <el-col :span="18" :sm="18">
          <lesson-student-progress :isVisitor="isVisitor" />
        </el-col>
        <el-col :span="4" :sm="4" class="lesson-references">
          <lesson-referencse />
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
import colI18n from '@/lib/utils/i18n/column'
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
    },
    isVisitor: {
      type: Boolean,
      default: false
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
      copyClassroomQuiz: 'lesson/teacher/copyClassroomQuiz',
      dismissTheClass: 'lesson/teacher/dismissTheClass',
      updateLearnRecords: 'lesson/teacher/updateLearnRecords'
    }),
    generateStyleString(style) {
      let string = ''
      _.forEach(style, (value, key) => {
        string = string + key + ':' + value + ';'
      })
      return string
    },
    loadCover() {
      return this.generateStyleString({
        background: 'url(' + this.coverUrl + ')',
        'background-position': 'center',
        'background-size': 'cover',
        'background-color': '#eee',
        opacity: '0.8',
        'border-radius': '8px'
      })
    },
    openAnimations() {
      this.isHasVideo && (this.dialogVisible = true)
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
            type: 'warning',
            customClass: 'teach-function-style'
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
          this.copyClassroomQuiz()
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
          cancelButtonText: this.$t('common.Cancel'),
          customClass: 'dismiss-class'
        }
      )
        .then(async () => {
          await this.dismissTheClass()
            .then(res => {
              this.$emit('clearUpdateLearnRecords')
              const { lessonId, id } = this.classroom
              this.$router.push({
                name: 'LessonTeacherSummary',
                params: {
                  classId: id,
                  lessonId: Number(lessonId)
                }
              })
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
    },
    handleExplanHaqiCode() {
      let helpUrl = 'https://keepwork.com/lesson9527/lessons/help_lessonID '
      window.open(helpUrl)
    }
  },
  computed: {
    ...mapGetters({
      isBeInClass: 'lesson/teacher/isBeInClass',
      classroomId: 'lesson/teacher/classroomId',
      isClassIsOver: 'lesson/teacher/isClassIsOver',
      classroom: 'lesson/teacher/classroom',
      isBeInClassroom: 'lesson/student/isBeInClassroom',
      userInfo: 'lesson/userinfo',
      userIsTeacher: 'lesson/isTeacher'
    }),
    lesson() {
      return this.data
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
    lessonName() {
      return _.get(this.lesson, 'lessonName', '')
    },
    lessonNo() {
      return _.get(this.lesson, 'packageIndex', '')
    },
    lessonSkills() {
      return _.map(
        _.get(this.lesson, 'skills', []),
        skill => `${colI18n.getLangValue(skill, 'skillName')} +${skill.score}`
      )
    },
    lessonGoals() {
      return _.get(this.lesson, 'goals', '')
    },
    title() {
      return _.get(this.lesson, 'Title', '')
    },
    coverUrl() {
      return _.get(this.lesson, 'extra.coverUrl', '')
    },
    isHasVideo() {
      return Boolean(this.videoUrl)
    },
    videoUrl() {
      return _.get(this.lesson, 'extra.videoUrl', '')
    },
    isSelfLearning() {
      return !this.isTeacher && !this.isBeInClassroom
    },
    haqiCode() {
      const { packageId, lessonId } = this.$route.params
      return `${packageId}x${lessonId}`
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
    max-width: 600px;
    cursor: pointer;
    background: #eee;
    opacity: 0.8;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
      opacity: 1 !important;
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

    .lesson-info {
      margin-top: 10px;
      &.title {
        font-size: 20px;
        color: #4c4c4c;
        width: 90%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      &.intro {
        color: #606266;
        display: flex;
        flex-direction: row;
        .intro-list {
          font-size: 16px;
          height: 80px;
          width: 80%;
          white-space: normal;
          line-height: 30px;
          margin-left: 18px;
          .el-scrollbar__wrap {
            overflow-x: hidden;
          }
        }
      }

      &.duration {
        color: #909399;
        font-size: 16px;
      }

      &.skills {
        color: #909399;
        display: flex;
        flex-direction: row;
        .skills-list {
          font-size: 16px;
          height: 180px;
          width: 80%;
          white-space: pre-line;
          line-height: 30px;
          margin-left: 18px;
          &.reset-height {
            height: 125px;
          }
          .el-scrollbar__wrap {
            overflow-x: hidden;
          }
        }
      }
    }
  }
  .lesson-button-wrap {
    margin: 10px 0;
    .lesson-button {
      height: 36px;
      width: 190px;
      position: static;
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
    padding: 26px 20px;
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
@media screen and (max-width: 768px) {
  .lesson-header-container {
    .lesson-cover {
      height: 200px;
      width: 80%;
      margin: 0 10px;
    }
    &-video {
      .el-dialog {
        width: 90% !important;
      }
    }
    .lesson-progress-wrap {
      &.el-row {
        padding: 16px;
      }
    }
  }
  .teach-function-style {
    max-width: 86%;
  }
  .class-id-dialog {
    max-width: 90%;
  }
  .dismiss-class {
    max-width: 90%;
  }
}
</style>




<template>
  <el-row class="lesson-header-container">
    <el-dialog class="lesson-header-container-video" :visible.sync="dialogVisible" width="50%">
      <video v-if="dialogVisible" controls="" width="100%" autoplay="" name="media">
        <source :src="videoUrl" type="video/mp4">
      </video>
    </el-dialog>
    <el-dialog :visible.sync="classIdDialogVisible" center custom-class="class-id-dialog" width="600px">
      <div>{{$t('lesson.curentClassId')}}
        <span class="class-id">C{{classroomKey}}</span>
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
      <div class="full-font">C {{classroomKey | idPretty}}</div>
    </el-dialog>
    <el-row>
      <el-col :sm="12" :xm="24" class="lesson-cover" :style="loadCover()" @click.native="openAnimations">
        <img v-if="isHasVideo" src="@/assets/lessonImg/play2.png" alt="">
      </el-col>
      <el-col :sm="12" :xm="24" class="lesson-desc">
        <div v-if="isTeacher && isTeaching && isInCurrentClass && !isClassIsOver" class="class-id-sign-wrap">
          <el-tooltip placement="bottom">
            <div slot="content">{{$t('lesson.fullPage')}}</div>
            <div class="class-id-sign" @click="classIdToFullScreen"> {{$t('lesson.class')}} ID: C{{classroomKey}}</div>
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
          <div class="intro-list">
            {{lessonGoals}}
          </div>
        </div>
        <div class="lesson-info duration">
          <div class="duration-title">{{$t('lesson.duration')}}: </div>
          <div>45 {{$t('lesson.mins')}}</div>
        </div>
        <div class="lesson-info skills">
          <div class="skills-title">
            {{$t('lesson.skillPoints')}}:
          </div>
          <el-scrollbar :class="['skills-list',{'reset-height': isTeacher}]" :native="false">
            <div v-for="(item, index) in lessonSkills" :key="index">{{item}}</div>
          </el-scrollbar>
        </div>
        <div v-if="isTeacher" class="lesson-button-wrap">
          <el-button v-if="isTeaching && isInCurrentClass" @click="handleDismissTheClass" :disabled="isClassIsOver" type="primary" :class="['lesson-button',{'class-is-over': isClassIsOver}]" size="medium">{{$t('lesson.dismiss')}}</el-button>
          <el-button v-if="(!isTeaching || !isInCurrentClass) && userIsTeacher" @click="handleBeginTheClass" :disabled="!isInCurrentClass" type="primary" class="lesson-button" size="medium">{{$t('lesson.begin')}}</el-button>
          <span v-if="isTeaching && isInCurrentClass" class="lesson-button-tips">{{$t('lesson.dismissTips')}}</span>
          <span v-if="(!isTeaching || !isInCurrentClass) && userIsTeacher" class="lesson-button-tips">{{$t('lesson.beginTips')}}</span>
        </div>
      </el-col>
    </el-row>
    <keep-work-sticky>
      <el-row v-if="isTeacher" :gutter="20" class="lesson-progress-wrap">
        <el-col :span="20" :sm="20">
          <lesson-teacher-progress :reset="!isInCurrentClass" />
        </el-col>
        <el-col :span="4" :sm="4" class="lesson-references">
          <lesson-references />
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
          <lesson-references />
        </el-col>
      </el-row>
    </keep-work-sticky>

  </el-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import _ from 'lodash'
import colI18n from '@/lib/utils/i18n/column'
import LessonJewelBox from './LessonJewelBox'
import LessonStudentProgress from './LessonStudentProgress'
import LessonTeacherProgress from './LessonTeacherProgress'
import LessonReferences from './LessonReferences'
import KeepWorkSticky from './KeepWorkSticky'
export default {
  name: 'LessonHeader',
  components: {
    LessonJewelBox,
    LessonStudentProgress,
    LessonTeacherProgress,
    KeepWorkSticky,
    LessonReferences
  },
  filters: {
    idPretty(value) {
      return _.map(_.chunk(value.toString().split(''), 3), i =>
        i.join('')
      ).join(' ')
    }
  },
  props: {
    lesson: {
      type: Object,
      default() {
        return {}
      }
    },
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
      beginTheClass: 'org/teacher/beginTheClass',
      copyClassroomQuiz: 'org/teacher/copyClassroomQuiz',
      dismissTheClass: 'org/teacher/dismissTheClass',
      updateLearnRecords: 'org/teacher/updateLearnRecords'
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
    async handleBeginTheClass() {
      if (!this.isInCurrentClass) return
      const {
        name,
        params: { classId, packageId, lessonId }
      } = this.$route
      await this.beginTheClass({
        classId: Number(classId),
        packageId: Number(packageId),
        lessonId: Number(lessonId)
      })
        .then(res => {
          if (name !== 'OrgTeacherLessonPlan') {
            this.$router.push({ name: 'OrgTeacherLessonPlan' })
          }
          this.classIdDialogVisible = true
          this.copyClassroomQuiz()
          this.$emit('intervalUpdateLearnRecords')
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
                name: 'OrgTeacherLessonSummary',
                params: {
                  classroomId: id,
                  lessonId: Number(lessonId)
                }
              })
            })
            .catch(e => {
              this.$message.error(this.$t('common.failure'))
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
      isTeaching: 'org/teacher/isTeaching',
      // isBeInClass: 'org/teacher/isBeInClass',
      classroomKey: 'org/teacher/classroomKey',
      isClassIsOver: 'org/teacher/isClassIsOver',
      classroom: 'org/teacher/classroom',
      isBeInClassroom: 'org/student/isBeInClassroom',
      userInfo: 'org/userinfo',
      userIsTeacher: 'org/isTeacher'
    }),
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
      const { packageId = 0, lessonId = 0 } = this.$route.params
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
    padding-left: 28px;
    box-sizing: border-box;
    position: relative;
    height: 340px;
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
      display: flex;
      margin-top: 10px;
      &.title {
        font-size: 20px;
        color: #111;
        width: 90%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-family: 'MicrosoftYaHei';
      }
      &.intro {
        color: #4c4c4c;
        font-size: 18px;
        .intro-title {
          margin-right: 10px;
        }
        .intro-list {
          flex: 1;
          line-height: 26px;
          max-height: 78px;
          word-break: break-all;
          overflow-x: none;
          overflow-y: auto;
        }
      }

      &.duration {
        color: #4c4c4c;
        font-size: 16px;
        .duration-title {
          margin-right: 10px;
        }
      }

      &.skills {
        color: #4c4c4c;
        display: flex;
        flex-direction: row;
        .skills-list {
          font-size: 16px;
          height: 90px;
          width: 70%;
          white-space: pre-line;
          line-height: 26px;
          margin-left: 12px;
          &.reset-height {
            height: 100px;
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
    position: absolute;
    bottom: 0;
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
    // background: #f8f8f8;
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




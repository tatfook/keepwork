<template>
  <div class="teacher-summary-container">
    <div class="org-breadcrumb">
      <div class="org-breadcrumb-main">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ name: 'OrgTeacherStatistics' }">数据统计</el-breadcrumb-item>
          <el-breadcrumb-item>{{currenClassInfo.extra.lessonName}}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
    </div>
    <div class="teacher-summary" v-loading="loading" ref="print">
      <div class="teacher-summary-print-and-email">
        <div class="teacher-summary-print-and-email-wrap">
          <el-button type="primary" @click="gotoPrint">{{$t('lesson.print')}}</el-button>
          <el-button type="primary" @click="sendEmail">{{$t('lesson.sendToMailbox')}}</el-button>
        </div>
      </div>
      <div class="teacher-summary-print-header">
        <div class="profile">
          <img :src='userProfile.portrait' alt="portrait">
        </div>
        <div class="nickname">{{username}}</div>
      </div>
      <div class="teacher-summary-brief" ref="lessonIntro">
        <p class="date">
          <span class="week">{{$t(`common.weekday${getWeekDay}`)}}</span><span class="week">{{creationDate}}</span><span class="print-show">{{$t('lesson.totalStudents')}}: {{totalStudent}}</span></p>
        <p class="package-text">
          <span class="brief-title">{{$t('modList.lesson')}} {{currenClassInfo.extra.lessonNo || 0}}:</span> {{currenClassInfo.extra.lessonName}}</p>
        <p class="package-text">
          <span class="brief-title">{{$t('lesson.intro')}}:</span> {{currenClassInfo.extra.lessonGoals}}</p>
        <p>
          <span class="brief-title">{{$t('lesson.duration')}}:</span> 45{{$t('lesson.mins')}}</p>
        <div class="skillpoints package-text">
          <div class="brief-title skill">{{$t('lesson.skillPoints')}}:</div>
          <div class="points">
            <ul class="points-list">
              <li v-for="(skill,index) in skillsList" :key="index">{{index + 1}}.{{skillName(skill)}} + {{skill.score}}</li>
            </ul>
          </div>
        </div>
      </div>
      <div class="teacher-summary-chart" ref="lessonChart">
        <h4>{{$t('lesson.accuracyAnalysis')}}:</h4>
        <div class="teacher-summary-chart-box">
          <div class="teacher-summary-chart-box-accuracy-rate">
            <accuracy-rate-chart :quizChartData="quizChartData"></accuracy-rate-chart>
          </div>
          <div class="teacher-summary-chart-box-student-number">
            <number-of-students-chart :studentChartData="studentChartData" :totalStudent.sync="totalStudent"></number-of-students-chart>
          </div>
        </div>
      </div>
      <div class="teacher-summary-chart-copy">
      </div>
      <div class="teacher-summary-detailed" ref="lessonSummary">
        <h4>{{$t('lesson.detailed')}}:</h4>
        <div class="teacher-summary-detailed-change hidden web-page-show">
          <span class="chang-button">
            <el-button :disabled="newCurrentRecord.length === 0" type="primary" size="mini" @click="change('changeAll')">{{$t('lesson.changeAll')}}</el-button> ({{$t('lesson.fullAllStudents')}})
          </span>
          <span class="chang-button">
            <el-button :disabled="newCurrentRecord.length === 0" type="primary" size="mini" @click="change('change')">{{$t('lesson.change')}}</el-button> ({{$t('lesson.fullSelectedStudents')}})
          </span>
        </div>
        <div class="teacher-summary-detailed-table">
          <el-table ref='gradeMultipleTable' :data="newCurrentRecord" border style="width: 100%" class="email-text-center" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55">
            </el-table-column>
            <el-table-column prop="portrait" label="NO." width="80px">
              <template slot-scope="props">
                <div class="portrait"><img style="width:100%;object-fit:cover" :src="props.row.portrait || avatar" alt=""></div>
              </template>
            </el-table-column>
            <el-table-column prop="name" sortable :label='$t("lesson.name")'>
            </el-table-column>
            <el-table-column prop="username" sortable :label='$t("lesson.username")'>
            </el-table-column>
            <el-table-column prop="accuracyRate" sortable width="180" :label='$t("lesson.accuracyRate")'>
            </el-table-column>
            <el-table-column prop="right" sortable :label='$t("lesson.rightNumber")'>
            </el-table-column>
            <el-table-column prop="wrong" sortable :label='$t("lesson.wrongNumber")'>
            </el-table-column>
            <el-table-column prop="empty" sortable :label='$t("lesson.emptyNumber")'>
            </el-table-column>
            <el-table-column>
              <template slot-scope="scope">
                <el-button class="hidden web-page-show" size="mini" type="primary" @click="singleStudentRecord(scope.$index, scope.row)">{{$t('lesson.viewDetail')}}</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="teacher-summary-print-lesson-plan">
        <lesson-wrap v-for="(item,index) in modListFilter" :key="index" :mod="item" :isPreview="true" :isPrint="true"></lesson-wrap>
      </div>
      <el-dialog class="teacher-summary-change" :visible.sync="changeDialogVisible" width="30%" center>
        <div class="tip">
          <div class="tip-img"><img src="@/assets/lessonImg/reminder.png" alt=""></div>
          <div class="tip-text">{{changeSelected == 'changeAll' ? $t('lesson.confirmFullAll') : $t('lesson.confirmFullSelected')}}</div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="cancelChangeStudentMarks">{{$t('common.Cancel')}}</el-button>
          <el-button type="primary" @click="toChangeStudentMarks">{{$t('common.Sure')}}</el-button>
        </span>
      </el-dialog>
      <el-dialog class="teacher-summary-success-send-email" :visible.sync="successSendEmailDialogVisible" width="30%" center>
        <div class="success">
          <img src="@/assets/lessonImg/email.png" alt="">
          <p>{{$t('lesson.successSendToEmail')}}(<span class="email-address">{{emailAddress}}</span>).</p>
        </div>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import AccuracyRateChart from '@/components/lesson/teacher/AccuracyRateChart'
import NumberOfStudentsChart from '@/components/lesson/teacher/NumberOfStudentsChart'
import html2canvas from 'html2canvas'
import { lesson } from '@/api'
import dayjs from 'dayjs'
import _ from 'lodash'
import { locale } from '@/lib/utils/i18n'
import { mapActions, mapGetters } from 'vuex'
import Vue from 'vue'
import LessonWrap from '@/components/lesson/common/LessonWrap'
import Parser from '@/lib/mod/parser'
import colI18n from '@/lib/utils/i18n/column'
import avatar from '@/assets/lessonImg/default_avatar.png'

export default {
  name: 'OrgTeacherLessonSummary',
  data() {
    return {
      avatar,
      modList: [],
      emailAddress: '',
      isEn: locale === 'en-US',
      currenClassInfo: { extra: {} },
      classid: this.$route.params.classroomId,
      loading: true,
      lessonName: null,
      lessonGoals: null,
      lessonNo: null,
      createdAt: null,
      skillsList: [],
      successSendEmailDialogVisible: false,
      changeDialogVisible: false,
      changeSelected: '',
      multipleSelection: [],
      studentNumberRate: [],
      quizChartData: {
        columns: ['questionNumber', `${this.$t('lesson.accuracy')}`],
        rows: [
          {
            questionNumber: this.$t('lesson.noData'),
            [`${this.$t('lesson.accuracy')}`]: 0
          }
        ]
      },
      studentChartData: {
        columns: ['accuracyRate', `${this.$t('lesson.student')}`],
        rows: [
          {
            accuracyRate: this.$t('lesson.noData'),
            [`${this.$t('lesson.student')}`]: 0
          }
        ]
      },
      totalStudent: 0
    }
  },
  async mounted() {
    await lesson.classrooms
      .getClassroomById(this.$route.params.classroomId)
      .then(res => {
        this.currenClassInfo = res
        this.lessonNo = res.extra.lessonNo || 0
        this.lessonName = res.extra.lessonName
      })
      .catch(err => console.log(err))
    await this.getClassLearnRecords({ id: this.$route.params.classroomId })
    let res = await lesson.lessons.lessonContent({
      lessonId: this.$route.params.lessonId
    })
    this.modList = Parser.buildBlockList(res.content)
    if (this.classroomLearnRecord.length === 0) {
      this.loading = false
      return
    }
    this.totalStudent = this.classroomLearnRecord.length
    await Promise.all([
      this.getLessonSkill(this.$route.params.lessonId),
      this.getQuizChartData(this.newCurrentRecord),
      this.getStudentChartData(this.newCurrentRecord),
      this.getProfile()
    ])
    this.loading = false
  },
  computed: {
    ...mapGetters({
      userProfile: 'org/userinfo',
      username: 'user/username',
      classroomLearnRecord: 'lesson/teacher/classroomLearnRecord',
      currentOrg: 'org/currentOrg'
    }),
    getWeekDay() {
      let time = dayjs(this.currenClassInfo.createdAt).format('YYYY-MM-DD')
      let day = time.split('-')
      let Day = new Date(day[0], parseInt(day[1] - 1), day[2])
      return String(Day.getDay())
    },
    creationDate() {
      let year = dayjs(this.currenClassInfo.createdAt).year()
      let monthNum = dayjs(this.currenClassInfo.createdAt).month()
      let monthArr = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        '',
        'Nov',
        'Dec'
      ]
      let month = monthArr[monthNum]
      let todayDate = dayjs(this.currenClassInfo.createdAt).date()
      let hours = dayjs(this.currenClassInfo.createdAt)
        .format('YYYY-MM-DD HH:mm:ss')
        .split(' ')[1]
      let suffix = ['st', 'nd', 'rd', 'th']
      if (todayDate % 10 < 1 || todayDate % 10 > 3) {
        todayDate = todayDate + suffix[3]
      } else if (todayDate % 10 == 1) {
        todayDate = todayDate + suffix[0]
      } else if (todayDate % 10 == 2) {
        todayDate = todayDate + suffix[1]
      } else {
        todayDate = todayDate + suffix[2]
      }
      return this.isEn
        ? todayDate + ' ' + month + ' ' + year
        : dayjs(this.currenClassInfo.createdAt).format('YYYY-MM-DD')
    },
    newCurrentRecord() {
      let currentRecord = _.map(
        this.classroomLearnRecord,
        ({
          extra: {
            portrait,
            name = 'visitor',
            username = 'visitor',
            quiz = []
          },
          createdAt,
          lessonId,
          userId
        }) => ({
          portrait,
          name,
          username,
          quiz,
          createdAt,
          lessonId,
          userId
        })
      )
      return _.map(
        currentRecord,
        ({
          portrait,
          name,
          username,
          quiz = [],
          createdAt,
          lessonId,
          userId
        }) => {
          let accuracyRate = this.singleStudentRightRate(quiz)
          let right = _.filter(quiz, { result: true }).length
          let wrong = _.filter(quiz, { result: false }).length
          let empty = quiz.length - right - wrong
          return {
            portrait,
            name,
            username,
            accuracyRate,
            right,
            wrong,
            empty,
            quiz,
            createdAt,
            lessonId,
            userId,
            lessonName: this.lessonName,
            lessonNo: this.lessonNo
          }
        }
      )
    },
    tableDataFaker() {
      // 为了造假数据使用
      return this.newCurrentRecord
        .map(item => Array.from({ length: 100 }, () => item))
        .reduce((arr, cur) => [...arr, ...cur], [])
    },
    modListFilter() {
      return this.modList.filter(
        item => item.cmd !== 'Lesson' && item.cmd !== 'BigFile'
      )
    }
  },
  methods: {
    ...mapActions({
      getProfile: 'user/getProfile',
      getClassLearnRecords: 'lesson/teacher/getClassLearnRecords',
      modifyClassLearnRecords: 'lesson/teacher/modifyClassLearnRecords'
    }),
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.gradeMultipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.gradeMultipleTable.clearSelection()
      }
    },
    async change(type) {
      this.changeSelected = type
      if (type === 'changeAll') {
        if (this.multipleSelection.length < this.newCurrentRecord.length) {
          this.$refs.gradeMultipleTable.clearSelection()
          this.toggleSelection(this.newCurrentRecord)
        }
        this.changeDialogVisible = true
        return
      }
      if (this.multipleSelection.length == 0) {
        this.changeDialogVisible = false
        this.$alert(this.$t('lesson.reviseGrades'), '', {
          confirmButtonText: this.$t('common.Sure'),
          center: true,
          customClass: 'change-mark',
          callback: action => {}
        })
        return
      } else {
        this.changeDialogVisible = true
      }
    },
    cancelChangeStudentMarks() {
      this.toggleSelection()
      this.changeDialogVisible = false
    },
    async toChangeStudentMarks() {
      if (this.changeSelected === 'changeAll') {
        this.handleSelectionChange(this.newCurrentRecord)
        let learnRecordsArr = this.modifiedGrades(this.classroomLearnRecord)
        await this.modifyClassLearnRecords({
          id: this.classid,
          learnRecordsArr
        })
      } else {
        if (this.multipleSelection.length == 0) {
          this.changeDialogVisible = false
          this.$alert(this.$t('lesson.reviseGrades'), '', {
            confirmButtonText: this.$t('common.Sure'),
            center: true,
            callback: action => {}
          })
          return
        }
        let updataRecordsArr = null
        for (let i = 0; i < this.multipleSelection.length; i++) {
          updataRecordsArr = this.classroomLearnRecord.filter(
            item => item.extra.username === this.multipleSelection[i].username
          )
        }
        let learnRecordsArr = this.modifiedGrades(updataRecordsArr)
        await this.modifyClassLearnRecords({
          id: this.classid,
          learnRecordsArr
        })
      }
      this.getQuizChartData(this.newCurrentRecord)
      this.getStudentChartData(this.newCurrentRecord)
      this.changeDialogVisible = false
    },
    modifiedGrades(record) {
      let learnRecordsArr = _.map(record, student => {
        if (student.extra.quiz) {
          for (let i = 0; i < student.extra.quiz.length; i++) {
            let standardAnswer =
              student.extra.quiz[i].data.answer.toString() || ''
            Vue.set(student.extra.quiz[i], `answer`, standardAnswer)
            Vue.set(student.extra.quiz[i], `result`, true)
          }
        }
        return student
      })
      return learnRecordsArr
    },
    async gotoPrint() {
      window.print()
    },
    async sendEmail() {
      let lessonIntroHtml = this.$refs.lessonIntro.innerHTML
      let lessonChartHtml = this.$refs.lessonChart.innerHTML
      let lessonSummaryHtml = this.$refs.lessonSummary.innerHTML
      lessonSummaryHtml =
        `<style>.hidden{display:none}.el-checkbox__input{display:none}.portrait{width: 34px;height: 34px;border-radius: 50%;overflow: hidden;margin:5px auto;}.email-text-center{text-align:center;}</style>` +
        lessonSummaryHtml
      let _lessonChart = this.$refs.lessonChart
      let chart = await html2canvas(_lessonChart)
      chart = chart.toDataURL()
      this.$prompt(this.$t('lesson.inputEmail'), this.$t('editor.hint'), {
        confirmButtonText: this.$t('common.Sure'),
        cancelButtonText: this.$t('common.Cancel'),
        inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        inputErrorMessage: this.$t('lesson.wrongEmail'),
        customClass: 'email-style'
      })
        .then(async ({ value }) => {
          this.emailAddress = value
          let to = value
          let subject =
            this.$t('modList.lesson') +
            (this.currenClassInfo.extra.lessonNo || 0) +
            ':' +
            this.currenClassInfo.extra.lessonName
          let html =
            lessonIntroHtml + `<img src="${chart}" />` + lessonSummaryHtml
          await lesson.emails
            .sendEmails({ to, subject, html })
            .then(res => {
              this.successSendEmailDialogVisible = true
            })
            .catch(err => {
              this.$message.error(this.$t('lesson.failSend'))
            })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: this.$t('lesson.cancelSend')
          })
        })
    },
    getLessonSkill(lessonId) {
      lesson.lessons
        .getSkills({ lessonId })
        .then(res => {
          this.skillsList = res
        })
        .catch(err => {
          console.log(err)
        })
    },
    singleStudentRecord(index, student) {
      let _page = this.$router.resolve({
        path: `/${this.currentOrg.loginUrl}/teacher/student/${
          student.userId
        }/classId/${this.classid}/lessonNo/${this.lessonNo}/lessonName/${
          this.lessonName
        }/record`
      })
      window.open(_page.href)
    },
    singleStudentRightRate(quiz = []) {
      let rightAnswer = _.filter(quiz, {
        result: true
      }).length
      let allQuiz = quiz.length
      return allQuiz == 0 ? 0 + '%' : (rightAnswer / allQuiz) * 100 + '%'
    },
    getQuizChartData(newCurrentRecord) {
      let accuracyRateArr = Array.apply(
        null,
        Array(newCurrentRecord[0].quiz.length)
      ).map(() => 0)
      for (let j = 0; j < newCurrentRecord[0].quiz.length; j++) {
        for (let i = 0; i < newCurrentRecord.length; i++) {
          if (
            newCurrentRecord[i].quiz[j] &&
            newCurrentRecord[i].quiz[j].result
          ) {
            accuracyRateArr[j] += 1
          }
        }
      }
      _.forEach(accuracyRateArr, (i, n) => {
        Vue.set(this.quizChartData.rows, n, {
          questionNumber: `Q${++n}`,
          [`${this.$t('lesson.accuracy')}`]: i / newCurrentRecord.length
        })
      })
    },
    getStudentChartData(newCurrentRecord) {
      let PassRateArr = Array.apply(null, Array(3)).map(() => 0)
      _.forEach(newCurrentRecord, i => {
        if (parseInt(i.accuracyRate) > 80) {
          PassRateArr[2] += 1
        } else if (
          60 <= parseInt(i.accuracyRate) &&
          parseInt(i.accuracyRate) <= 80
        ) {
          PassRateArr[1] += 1
        } else {
          PassRateArr[0] += 1
        }
      })
      _.forEach(PassRateArr, (i, n) => {
        let rate = ''
        if (n === 2) {
          rate = '>80%'
        } else if (n === 1) {
          rate = '60%-80%'
        } else {
          rate = '<60%'
        }
        Vue.set(this.studentChartData.rows, n, {
          accuracyRate: rate,
          [`${this.$t('lesson.student')}`]: i
        })
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    skillName(skill) {
      return colI18n.getLangValue(skill, 'skillName')
    }
  },
  filters: {
    formatTime(time) {
      return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  components: {
    LessonWrap,
    AccuracyRateChart,
    NumberOfStudentsChart
  }
}
</script>
<style lang="scss">
.teacher-summary-container {
  .org-breadcrumb {
    background: #fff;
    color: #999;
    border-bottom: solid 1px #e6e6e6;
    &-main {
      max-width: 1200px;
      margin: 0 auto;
      box-sizing: border-box;
      padding-left: 20px;
      .el-breadcrumb {
        height: 58px;
        line-height: 58px;
      }
      .el-dropdown-link {
        cursor: pointer;
      }
    }
  }
  .teacher-summary {
    max-width: 1150px;
    margin: 0 auto;
    padding: 0 40px 40px;
    background: #fff;
    .web-page-show {
      display: block;
    }
    &-print-and-email {
      display: flex;
      flex-direction: row-reverse;
      padding: 22px 10px 10px;
    }
    &-print-header {
      display: none;
    }
    &-print-lesson-plan {
      display: none;
    }
    &-brief {
      margin-bottom: 40px;
      .date {
        font-size: 18px;
        line-height: 30px;
        letter-spacing: 0px;
        color: #111111;
        .week {
          margin-right: 25px;
        }
        .print-show {
          display: none;
        }
      }
      .package-text {
        word-break: break-all;
        word-wrap: break-word;
      }
      .brief-title {
        font-size: 16px;
        color: #111111;
        font-weight: bold;
      }
      .skillpoints {
        display: flex;
        .skill {
          width: 100px;
          display: inline-block;
        }
        .points {
          flex: 1;
          .points-list {
            margin: 0;
            list-style: none;
            li {
              margin-bottom: 5px;
            }
          }
        }
      }
    }
    &-chart {
      padding: 12px;
      background: #f8f8ff;
      &-box {
        display: flex;
        &-accuracy-rate {
          flex: 1;
        }
        &-student-number {
          flex: 1;
        }
      }
    }
    &-detailed {
      margin-top: 59px;
      &-change {
        margin-bottom: 22px;
        .chang-button {
          margin-right: 40px;
        }
      }
      &-table {
        border: 1px solid #a4a4a4;
        .portrait {
          width: 34px;
          height: 34px;
          border-radius: 50%;
          overflow: hidden;
          img {
            width: 100%;
            object-fit: cover;
          }
        }
      }
    }
    &-change {
      text-align: center;
      .tip {
        display: flex;
        &-text {
          font-size: 18px;
          line-height: 49px;
          color: #f75858;
          text-align: center;
          text-indent: 16px;
        }
      }
    }
    &-success-send-email {
      .success {
        text-align: center;
        margin: 0 auto;
      }
      .email-address {
        color: #409eff;
      }
    }
  }
}
@media screen and (max-width: 768px) {
  .email-style {
    width: 70%;
  }
  .teacher-summary {
    &-change {
      .el-dialog {
        width: 90% !important;
      }
    }
    &-success-send-email {
      .el-dialog {
        width: 75% !important;
      }
    }
  }
  .change-mark {
    max-width: 90%;
  }
}
@media print {
  .teacher-summary-container {
    .org-breadcrumb {
      display: none;
    }
    .teacher-summary {
      &-detailed {
        .web-page-show {
          display: none;
        }
      }
      &-print-and-email {
        display: none;
      }
      &-print-header {
        display: block;
        width: 1150px;
        margin: 0 auto;
        padding: 40px;
        background: #fff;
        text-align: center;
        .profile {
          margin: 0 auto;
          height: 100px;
          width: 100px;
          border-radius: 50%;
          overflow: hidden;
          img {
            width: 100%;
            object-fit: cover;
          }
        }
        .nickname {
          font-size: 24px;
          line-height: 34px;
          letter-spacing: 1px;
          color: #333333;
        }
      }
      &-print-lesson-plan {
        display: block;
      }
      &-brief {
        .date {
          .print-show {
            display: inline-block;
          }
        }
      }
    }
  }
}
</style>

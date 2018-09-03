<template>
  <div class="teacher-summary" v-loading="loading">
    <div class="teacher-summary-print-and-email">
      <el-button type="primary" @click="gotoPrint" v-show="!isPrintPage">Print</el-button>
      <el-button type="primary" @click="sendEmail" v-show="!isPrintPage">Send to Mailbox</el-button>
    </div>
    <div class="teacher-summary-brief">
      <p class="date">
        <span class="week">{{$t(`common.weekday${getWeekDay}`)}}</span><span class="week">{{creationDate}}</span><span v-show="isPrintPage">Number Of Student: 50</span></p>
      <p>
        <span class="brief-title">{{$t('modList.lesson')}} {{currenClassInfo.extra.lessonNo || 0}}:</span> {{currenClassInfo.extra.lessonName}}</p>
      <p>
        <span class="brief-title">{{$t('lesson.intro')}}:</span> {{currenClassInfo.extra.lessonGoals}}</p>
      <p>
        <span class="brief-title">{{$t('lesson.duration')}}:</span> 45mins</p>
      <div class="skillpoints">
        <div class="brief-title skill">{{$t('lesson.skillsPoints')}}:</div>
        <div class="points">
          <ul class="points-list">
            <li v-for="(skill,index) in skillsList" :key="index">{{index + 1}}.{{skill.skillName}}</li>
          </ul>
        </div>
      </div>
      <!-- <p v-show="isPrintPage">
        <span class="brief-title">{{$t('lesson.StuentsPerformance')}}:</span> 学生总数50</p> -->
    </div>
    <div class="teacher-summary-chart">
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
    <div class="teacher-summary-detailed">
      <h4>{{$t('lesson.detailed')}}:</h4>
      <div class="teacher-summary-detailed-change" v-show="!isPrintPage">
        <span class="chang-button"><el-button :disabled="newCurrentRecord.length === 0" type="primary" size="mini" @click="change('changeAll')">{{$t('lesson.changeAll')}}</el-button> ({{$t('lesson.fullAllStudents')}})</span>
        <span class="chang-button"><el-button :disabled="newCurrentRecord.length === 0" type="primary" size="mini" @click="change('change')">{{$t('lesson.change')}}</el-button> ({{$t('lesson.fullSelectedStudents')}})</span>
      </div>
      <div class="teacher-summary-detailed-table">
        <el-table :data="newCurrentRecord" border style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="portrait" label="NO." width="80px">
            <template slot-scope="props">
              <div class="portrait"><img :src="props.row.portrait" alt=""></div>
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
          <el-table-column label=" " v-if="!isPrintPage">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="singleStudentRecord(scope.$index, scope.row)">{{$t('lesson.viewDetail')}}</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog class="teacher-summary-change" :visible.sync="changeDialogVisible" width="30%" center>
      <div class="tip">
        <div class="tip-img"><img src="@/assets/lessonImg/reminder.png" alt=""></div>
        <div class="tip-text">{{changeSelected == 'changeAll' ? $t('lesson.confirmFullAll') : $t('lesson.confirmFullSelected')}}</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeDialogVisible = false">{{$t('common.Cancel')}}</el-button>
        <el-button type="primary" @click="toChangeStudentMarks">{{$t('common.Sure')}}</el-button>
      </span>
    </el-dialog>
    <el-dialog class="teacher-summary-success-send-email" :visible.sync="successSendEmailDialogVisible" width="30%" center>
      <div class="success">
        <img src="@/assets/lessonImg/email.png" alt="">
        <p>The summary has been successfully sent to your mailbox</p>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import AccuracyRateChart from './AccuracyRateChart'
import NumberOfStudentsChart from './NumberOfStudentsChart'
import { lesson } from '@/api'
import dayjs from 'dayjs'
import _ from 'lodash'
import { locale } from '@/lib/utils/i18n'
import { mapActions, mapGetters } from 'vuex'
import Vue from 'vue'

export default {
  name: 'LessonTeacherSummary',
  data() {
    return {
      isPrintPage: this.$route.name === 'Print',
      isEn: locale === 'en-US',
      currenClassInfo: { extra: {}},
      classid: this.$route.params.classId,
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
            {questionNumber: `Q1`,
            [`${this.$t('lesson.accuracy')}`]: 0},
        ]
      },
      studentChartData: {
        columns: ['accuracyRate', `${this.$t('lesson.student')}`],
        rows: [
          {accuracyRate: '<60%',
          [`${this.$t('lesson.student')}`]: 0},
          {accuracyRate: '60%-80%',
          [`${this.$t('lesson.student')}`]: 0},
          {accuracyRate: '>80%',
          [`${this.$t('lesson.student')}`]: 0},
        ]
      },
      totalStudent: 0
    }
  },
  async mounted() {
    await lesson.classrooms.getClassroomById( this.$route.params.classId ).then(res => {
      console.log('getClassroomById11',res)
      this.currenClassInfo = res
      this.lessonNo = res.extra.lessonNo || 0
      this.lessonName = res.extra.lessonName
    }).catch(err => console.log(err))
    await this.getClassLearnRecords({ id: this.$route.params.classId })
    if (this.classroomLearnRecord.length === 0) {
      this.loading = false
      return
    }
    this.totalStudent = this.classroomLearnRecord.length
    await Promise.all([this.getLessonSkill(this.$route.params.lessonId),this.getQuizChartData(this.newCurrentRecord),this.getStudentChartData(this.newCurrentRecord)])
    this.loading = false
    console.log('classroomLearnRecord',this.classroomLearnRecord)
  },
  computed: {
    ...mapGetters({
      classroomLearnRecord: 'lesson/teacher/classroomLearnRecord'
    }),
    getWeekDay() {
      let time = dayjs(this.currenClassInfo.createdAt).format('YYYY-MM-DD')
      let day = time.split('-')
      let Day = new Date(day[0], parseInt(day[1] - 1), day[2])
      return String(Day.getDay())
    },
    creationDate(){
      let year = dayjs(this.currenClassInfo.createdAt).year()
      let monthNum = dayjs(this.currenClassInfo.createdAt).month()
      let monthArr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','','Nov','Dec']
      let month = monthArr[monthNum]
      let todayDate = dayjs(this.currenClassInfo.createdAt).date()
      let hours = dayjs(this.currenClassInfo.createdAt).format('YYYY-MM-DD HH:mm:ss').split(' ')[1]
      let suffix = ['st','nd','rd','th']
      if(todayDate % 10 < 1 || todayDate % 10 > 3){
        todayDate = todayDate + suffix[3]
      }else if(todayDate % 10 == 1){
        todayDate = todayDate + suffix[0]
      }else if(todayDate % 10 == 2){
        todayDate = todayDate + suffix[1]
      }else{
        todayDate = todayDate + suffix[2]
      }
      return this.isEn ? (month + ' ' + todayDate + ' ' + year + '  ' +  hours) : dayjs(this.currenClassInfo.createdAt).format('YYYY-MM-DD HH:mm:ss')
    },
    newCurrentRecord() {
      let currentRecord = _.map(
        this.classroomLearnRecord,
        ({
          extra: { portrait, name, username, quiz },
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
    }
  },
  methods: {
    ...mapActions({
      getClassLearnRecords: 'lesson/teacher/getClassLearnRecords',
      modifyClassLearnRecords: 'lesson/teacher/modifyClassLearnRecords'
    }),
    async change(type) {
      this.changeSelected = type
      this.changeDialogVisible = true
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
        for (let i = 0; i < student.extra.quiz.length; i++) {
          Vue.set(student.extra.quiz[i], `result`, true)
        }
        return student
      })
      return learnRecordsArr
    },
    gotoPrint(){
      this.$router.push({
        // path: `package/${lessonPackage.packageId}/lesson/${lessonPackage.lessonId}/class/${lessonPackage.id}/summary/print`
        path: `summary/print`
      })
    },
    async sendEmail() {
      this.$prompt('请输入邮箱', '提示', {
        confirmButtonText: this.$t('common.Sure'),
        cancelButtonText: this.$t('common.Cancel'),
        inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        inputErrorMessage: '邮箱格式不正确'
      })
        .then(async ({ value }) => {
          this.$message({
            type: 'success',
            message: '你的邮箱是: ' + value
          })
          let to = value
          let subject = '课程 1：老铁稳'
          let html = '<h1>这里是邮箱内容</h1>'
          await lesson.emails.sendEmails({to, subject, html}).then(res => {console.log(res)}).catch(err => {console.log(err)})
          this.successSendEmailDialogVisible = true
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消发送'
          })
        })
    },
    getLessonSkill(lessonId) {
      lesson.lessons
        .getSkills({ lessonId })
        .then(res => {
          console.log('skill', res)
          this.skillsList = res
        })
        .catch(err => {
          console.log(err)
        })
    },
    singleStudentRecord(index, student) {
      this.$router.push({
        path: `/teacher/student/${student.userId}/classId/${
          this.classid
        }/lessonNo/${this.lessonNo}/lessonName/${this.lessonName}/record`
      })
    },
    singleStudentRightRate(quiz = []) {
      let rightAnswer = _.filter(quiz, {
        result: true
      }).length
      let allQuiz = quiz.length
      return allQuiz == 0 ? 0 + '%' :  rightAnswer / allQuiz * 100 + '%'
    },
    getQuizChartData(newCurrentRecord) {
        let accuracyRateArr = Array.apply(null, Array(newCurrentRecord[0].quiz.length)).map(() => 0)
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
            [`${this.$t('lesson.accuracy')}`]: (i / newCurrentRecord.length)
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
    }
  },
  filters: {
    formatTime(time) {
      return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  components: {
    AccuracyRateChart,
    NumberOfStudentsChart
  }
}
</script>
<style lang="scss">
.teacher-summary {
  width: 1149px;
  margin: 0 auto;
  padding: 0 40px 40px;
  background: #fff;
  &-print-and-email {
    padding: 29px 0 0 816px;
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
      .chang-button{
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
        }
      }
      &-title {
        padding: 14px;
        border-bottom: 1px solid #a4a4a4;
        .title {
          width: 140px;
          display: inline-block;
          text-align: center;
          font-size: 14px;
          font-weight: 700;
        }
      }
      &-content {
        .student-record {
          padding: 0;
          margin: 0;
          .every-student {
            list-style: none;
            padding: 4px 14px;
            border-bottom: 1px solid #a4a4a4;
            display: flex;
            align-items: center;
            &-checkbox {
              margin-right: 7px;
            }
            .desc {
              width: 140px;
              display: inline-block;
              font-size: 14px;
              text-align: center;
              margin-right: 5px;
            }
            .portraits {
              width: 34px;
              height: 34px;
              border-radius: 50%;
              object-fit: cover;
            }
          }
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
      // width: 199px;
      margin: 0 auto;
    }
  }
}
</style>

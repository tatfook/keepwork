<template>
  <div class="teacher-summary" v-loading="loading">
    <div class="teacher-summary-print-and-email">
      <el-button type="primary">Print</el-button>
      <el-button type="primary" @click="sendEmail">Send to Mailbox</el-button>
    </div>
    <div class="teacher-summary-brief">
      <p class="date">{{createdAt | formatTime}}</p>
      <p>
        <span class="brief-title">{{$t('modList.lesson')}} {{lessonNo}}:</span> {{lessonName}}</p>
      <p>
        <span class="brief-title">{{$t('lesson.intro')}}:</span> {{lessonGoals}}</p>
      <p>
        <span class="brief-title">{{$t('lesson.duration')}}:</span> 45mins</p>
      <div class="skillpoints">
        <div class="brief-title skill">{{$t('lesson.skillsPoints')}}:</div>
        <div class="points">
          <ul class="points-list">
            <li v-for="(skill,index) in skillsList" :key="index">{{index + 1}}.{{skill}}</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="teacher-summary-chart">
      <div class="teacher-summary-chart-accuracy-rate">
        <accuracy-rate-chart :quizChartData="quizChartData"></accuracy-rate-chart>
      </div>
      <div class="teacher-summary-chart-student-number">
        <number-of-students-chart :studentChartData="studentChartData" :totalStudent.sync="totalStudent"></number-of-students-chart>
      </div>
    </div>
    <div class="teacher-summary-detailed">
      <h4>{{$t('lesson.detailed')}}:</h4>
      <div class="teacher-summary-detailed-change">
        <span>
          <el-button type="primary" size="mini" @click="change('changeAll')">{{$t('lesson.changeAll')}}</el-button> ({{$t('lesson.fullAllStudents')}})</span>
        <span>
          <el-button type="primary" size="mini" @click="change('change')">{{$t('lesson.change')}}</el-button> ({{$t('lesson.fullSelectedStudents')}})</span>
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
          <el-table-column prop="name" :label='$t("lesson.name")'>
          </el-table-column>
          <el-table-column prop="username" :label='$t("lesson.username")'>
          </el-table-column>
          <el-table-column prop="accuracyRate" sortable width="180" :label='$t("lesson.accuracyRate")'>
          </el-table-column>
          <el-table-column prop="right" sortable :label='$t("lesson.rightNumber")'>
          </el-table-column>
          <el-table-column prop="wrong" sortable :label='$t("lesson.wrongNumber")'>
          </el-table-column>
          <el-table-column prop="empty" sortable :label='$t("lesson.emptyNumber")'>
          </el-table-column>
          <el-table-column label=" ">
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
import { mapActions, mapGetters } from 'vuex'
import Vue from 'vue'

export default {
  name: 'LessonTeacherSummary',
  data() {
    return {
      classid: null,
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
        rows: []
      },
      studentChartData: {
        columns: ['accuracyRate', `${this.$t('lesson.student')}`],
        rows: []
      },
      totalStudent: 0
    }
  },
  // props: {
  //   classData: {
  //     type: Object,
  //     default() {
  //       return {}
  //     }
  //   }
  // },
  async mounted() {
    console.log('params', this.$route.params)
    // if (JSON.stringify(this.classData) == '{}') {
      this.classid = this.$route.params.classId
    // } else {
    //   this.classid = this.classData.id //Please ask Kevin to add.
    // }
    await this.getClassLearnRecords({ id:this.classid })
    if (this.classroomLearnRecord.length === 0) {
      this.loading = false
      return
    }
    this.totalStudent = this.classroomLearnRecord.length
    this.getSingleLessonDetail(this.$route.params.classId)
    this.getLessonSkill(this.$route.params.lessonId)
    this.getQuizChartData(this.newCurrentRecord)
    this.getStudentChartData(this.newCurrentRecord)
    this.loading = false
  },
  computed: {
    ...mapGetters({
      classroomLearnRecord: 'lesson/teacher/classroomLearnRecord'
    }),
    newCurrentRecord() {
      let currentRecord = _.map(
      this.classroomLearnRecord,
      ({ extra: { portrait, name, username, quiz }, createdAt,lessonId, userId}) => ({
        portrait,
        name,
        username,
        quiz,
        createdAt,
        lessonId,
        userId
      })
      )
      console.log('currentrecord',currentRecord)
      return _.map(
      currentRecord,
      ({ portrait, name, username, quiz = [], createdAt,lessonId,userId }) => {
        let accuracyRate = this.singleStudentRightRate(quiz)
        let right = _.filter(quiz, { result: true }).length
        let wrong = _.filter(quiz, { result: false }).length
        let empty = quiz.length - right - wrong
        return {
          portrait,
          name,
          username,
          quiz,
          createdAt,
          lessonId,
          userId,
          lessonName: this.lessonName,
          lessonNo: this.lessonNo
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
          this.$alert('请选择需要修改成绩的学生！', '', {
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
    sendEmail() {
      this.$prompt('请输入邮箱', '提示', {
        confirmButtonText: this.$t('common.Sure'),
        cancelButtonText: this.$t('common.Cancel'),
        inputPattern: /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
        inputErrorMessage: '邮箱格式不正确'
      })
        .then(({ value }) => {
          // this.$message({
          //   type: 'success',
          //   message: '你的邮箱是: ' + value
          // })
          this.successSendEmailDialogVisible = true
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消发送'
          })
        })
    },
    getSingleLessonDetail(classId){
      lesson.classrooms.getClassroomById(classId).then(res => {
        console.log('getClassroomById',res)
        this.createdAt = res.createdAt
        this.lessonNo = res.extra.lessonNo
        this.lessonName = res.extra.lessonName
        this.lessonGoals = res.extra.lessonGoals
      }).catch( err => {console.log(err)})
    },
    getLessonSkill(lessonId){
      lesson.lessons.getSkills({lessonId}).then(res => {
        this.skillsList = res
      }).catch( err => {console.log(err)})
    },
    singleStudentRecord(index, student) {
      this.$router.push({
        path: `/teacher/student/${student.userId}/lessonNo/${this.lessonNo}/lessonName/${this.lessonName}/record`,
        // query: { student }
      })
    },
    singleStudentRightRate(quiz = []) {
      let rightAnswer = _.filter(quiz, {
        result: true
      }).length
      let allQuiz = quiz.length
      return rightAnswer / allQuiz * 100 + '%'
    },
    getQuizChartData(newCurrentRecord) {
      let accuracyRateArr = Array.apply(null, Array(10)).map(() => 0)
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
          [`${this.$t('lesson.accuracy')}`]: i
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
      // console.log('multipleSelection', this.multipleSelection)
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
  width: 1069px;
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
    }
    .brief-title {
      font-size: 16px;
      color: #111111;
      font-weight: bold;
    }
    .skill {
      display: inline-block;
    }
    .skillpoints {
      display: flex;
      .points-list {
        margin: 0;
        list-style: none;
        li {
          margin: 5px;
        }
      }
    }
  }
  &-chart {
    padding: 12px;
    background: #f8f8ff;
    display: flex;
    &-accuracy-rate {
      width: 50%;
    }
    &-student-number {
      width: 50%;
    }
  }
  &-detailed {
    margin-top: 59px;
    &-change {
      margin-bottom: 22px;
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

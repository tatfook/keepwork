<template>
  <div class="teacher-summary" v-loading="loading">
    <div class="teacher-summary-print-and-email">
      <el-button type="primary">Print</el-button>
      <el-button type="primary" @click="sendEmail">Send to Mailbox</el-button>
    </div>
    <div class="teacher-summary-brief">
      <p class="date">{{currentRecord.createdAt | formatTime}}</p>
      <p>
        <span class="brief-title">{{$t('modList.lesson')}} 1:</span> Tutorial: Installation,Movement and Edit Mode</p>
      <p>
        <span class="brief-title">{{$t('lesson.intro')}}:</span> ********</p>
      <p>
        <span class="brief-title">{{$t('lesson.duration')}}:</span> 45mins</p>
      <div class="skillpoints">
        <div class="brief-title skill">{{$t('lesson.skillsPoints')}}:</div>
        <div class="points">
          <ul class="points-list">
            <li>1.learning installation</li>
            <li>2.learning movement</li>
            <li>3.learning edit mode</li>
            <li>4.learning Animation production process</li>
            <li>5.learning any problem</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="teacher-summary-chart">
      <div class="teacher-summary-chart-accuracy-rate">
        <accuracy-rate-chart :quizChartData="quizChartData"></accuracy-rate-chart>
      </div>
      <div class="teacher-summary-chart-student-number">
        <number-of-students-chart :studentChartData="studentChartData"></number-of-students-chart>
      </div>
    </div>
    <div class="teacher-summary-detailed">
      <h4>Detailed:</h4>
      <div class="teacher-summary-detailed-change">
        <span>
          <el-button type="primary" size="mini" @click="change('changeAll')">Change All</el-button> (Give full marks to all students)</span>
        <span>
          <el-button type="primary" size="mini" @click="change('change')">Change</el-button> (Give full marks to selected students)</span>
      </div>
      <div class="teacher-summary-detailed-table">
        <el-table :data="newRecord" border style="width: 100%" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55">
          </el-table-column>
          <el-table-column prop="portrait" label="NO." width="80px">
            <template slot-scope="props">
              <div class="portrait"><img :src="props.row.portrait" alt=""></div>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="Name">
          </el-table-column>
          <el-table-column prop="username" label="Username">
          </el-table-column>
          <el-table-column prop="accuracyRate" sortable width="180" label="Accuracy Rate">
          </el-table-column>
          <el-table-column prop="right" sortable label="Right">
          </el-table-column>
          <el-table-column prop="wrong" sortable label="Wrong">
          </el-table-column>
          <el-table-column prop="empty" sortable label="Empty">
          </el-table-column>
          <el-table-column label=" ">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" @click="singleStudentRecord(scope.$index, scope.row)">View Detail</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog class="teacher-summary-change" :visible.sync="changeDialogVisible" width="30%" center>
      <div class="tip">
        <div class="tip-img"><img src="@/assets/lessonImg/reminder.png" alt=""></div>
        <div class="tip-text">{{changeSelected === 'changeAll' ? ' you sure you want to give full marks to all students?' : 'Are you sure you want to give full marks to selected students?'}}</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changeDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="toChangeStudentMarks">确 定</el-button>
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
      loading: true,
      successSendEmailDialogVisible: false,
      changeDialogVisible: false,
      changeSelected: '',
      currentRecord: [],
      newRecord: [],
      multipleSelection: [],
      studentNumberRate: [],
      quizChartData: {
        columns: ['questionNumber', 'accuracy'],
        rows: []
      },
      studentChartData: {
        columns: ['accuracyRate', 'students'],
        rows: []
      }
    }
  },
  props: {
    classData: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  async mounted() {
    let id
    if (JSON.stringify(this.classData) == '{}') {
      id = this.$route.params.classId
    } else {
      id = this.classData.id //Please ask Kevin to add.
    }
    await this.getClassLearnRecords({ id })
    this.currentRecord = _.map(
      this.classroomLearnRecord,
      ({ extra: { portrait, name, username, quiz }, createdAt }) => ({
        portrait,
        name,
        username,
        quiz,
        createdAt
      })
    )
    //Answer questions for each student
    let newCurrentRecord = _.map(
      this.currentRecord,
      ({ portrait, name, username, quiz }) => {
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
          quiz
        }
      }
    )
    //The accuracy rate of each question
    this.getQuizChartData(newCurrentRecord)
    //Pass the number of
    this.getStudentChartData(newCurrentRecord)
    this.newRecord = newCurrentRecord
    this.loading = false
  },
  computed: {
    ...mapGetters({
      classroomLearnRecord: 'lesson/teacher/classroomLearnRecord'
    })
  },
  methods: {
    ...mapActions({
      getClassLearnRecords: 'lesson/teacher/getClassLearnRecords'
    }),
    change(type) {
      this.changeSelected = type
      this.changeDialogVisible = true
    },
    toChangeStudentMarks() {
      alert('改变分数')
      this.changeDialogVisible = false
    },
    sendEmail() {
      this.$prompt('请输入邮箱', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
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
    singleStudentRecord(index, student) {
      console.log('index', index)
      console.log('student', student)
      this.$router.push({
        path: `/teacher/student/${student.username}/record`,
        query: { student }
      })
    },
    singleStudentRightRate(quiz) {
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
          if (newCurrentRecord[i].quiz[j].result) {
            accuracyRateArr[j] += 1
          }
        }
      }
      _.forEach(accuracyRateArr, (i, n) => {
        Vue.set(this.quizChartData.rows, n, {
          questionNumber: `Q${++n}`,
          accuracy: i
        })
      })
    },
    getStudentChartData(newCurrentRecord) {
      let PassRateArr = Array.apply(null, Array(3)).map(() => 0)
      _.forEach(newCurrentRecord, i => {
        if (parseInt(i.accuracyRate) < 60) {
          PassRateArr[0] += 1
        } else if (parseInt(i.accuracyRate) > 80) {
          PassRateArr[2] += 1
        } else {
          PassRateArr[1] += 1
        }
      })
      _.forEach(PassRateArr, (i, n) => {
        let rate = ''
        if (n === 0) {
          rate = '<60%'
        } else if (n === 1) {
          rate = '60%-80%'
        } else {
          rate = '>80%'
        }
        Vue.set(this.studentChartData.rows, n, {
          accuracyRate: rate,
          students: i
        })
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
      console.log('multipleSelection', this.multipleSelection)
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

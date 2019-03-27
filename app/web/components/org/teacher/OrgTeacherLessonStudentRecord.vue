<template>
  <div class="lesson-student-record-wrap">
    <div class="lesson-student-record">
      <div class="lesson-student-record-title">
        <p>
          <span class="brief-title">{{$t('modList.lesson')}} {{lessonNo}}:</span> {{lessonName}}</p>
        <p>
          <span class="brief-title">{{$t('lesson.duration')}}:</span> 45mins
          <span class="date">{{createdAt | formatTime}}</span>
        </p>
      </div>
      <div class="lesson-student-record-content">
        <p class="name-info"><span class="name-info-name">{{$t('lesson.name')}}: <span class="name">{{name}}</span></span> <span class="name-info-username">{{$t('lesson.username')}}: <span class="name">{{username}}</span></span></p>
        <p class="accuracy-rate">{{$t('lesson.accuracyRate')}}: {{accuracyRate}}</p>
        <p class="right-wrong">
          <span class="sign"><i class="i right"></i> {{$t('lesson.right')}}</span>
          <span class="sign"><i class="i wrong"></i> {{$t('lesson.wrong')}}</span>
        </p>
        <div class="lesson-student-record-content-table">
          <ul class="table">
            <li class="table-cell" v-for="(quiz,index) in records" :key="index">
              <div class="question-number">quiz{{index + 1}}</div>
              <div :title="formatTRF(quiz.answer)" v-if="quiz.data.type == 2" :class="['answer',quiz.result ? 'right-answer':'wrong-answer']">{{ formatTRF(quiz.answer)}}</div>
              <div :title="quiz.answer | formatQuiz" v-else :class="['answer',quiz.result ? 'right-answer':'wrong-answer']">{{quiz.answer | formatQuiz}}</div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import dayjs from 'dayjs'
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'LessonStudentRecord',
  data() {
    return {
      lessonNo: this.$route.params.lessonNo,
      lessonName: this.$route.params.lessonName,
      userId: this.$route.params.userId,
      createdAt: '',
      name: '',
      username: '',
      student: {},
      records: [],
      accuracyRate: ''
    }
  },
  async mounted() {
    await this.getClassLearnRecords({ id: this.$route.params.classId })
    let studentId = this.$route.params.userId
    let currentStudent = _.filter(this.classroomLearnRecord, {
      userId: Number(studentId)
    })
    this.createdAt = _.get(currentStudent[0], 'createdAt', '')
    this.name = _.get(currentStudent[0].extra, 'name', '')
    this.username = _.get(currentStudent[0].extra, 'username', '')
    this.records = _.get(currentStudent[0].extra, 'quiz', [])
    this.accuracyRate = this.singleStudentRightRate(this.records)
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
    formatTRF(value) {
      if (value === 'A') {
        return this.$t('lesson.right')
      }
      if (value === 'B') {
        return this.$t('lesson.wrong')
      }
      return ''
    },
    singleStudentRightRate(quiz = []) {
      let rightAnswer = _.filter(quiz, {
        result: true
      }).length
      let allQuiz = quiz.length
      return allQuiz == 0 ? 0 + '%' : (rightAnswer / allQuiz) * 100 + '%'
    }
  },
  filters: {
    formatTime(time) {
      return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    },
    formatQuiz(value) {
      return value ? value.toString() : ''
    }
  }
}
</script>

<style lang="scss">
.lesson-student-record-wrap {
  width: 100%;
  background: rgb(250, 250, 250);
  .lesson-student-record {
    max-width: 1149px;
    margin: 12px auto;
    padding: 93px;
    background: #fff;
    &-title {
      border-bottom: 1px solid #d2d2d2;
      line-height: 30px;
      .brief-title {
        font-size: 16px;
        color: #111111;
        font-weight: bold;
      }
      .date {
        display: inline-block;
        width: 300px;
        text-align: right;
      }
    }
    &-content {
      padding-top: 100px;
      .name-info {
        font-size: 16px;
        line-height: 30px;
        color: #414141;
        &-name {
          display: inline-block;
          width: 220px;
        }
        .name {
          color: #409dff;
        }
      }
      .accuracy-rate {
        font-size: 16px;
        font-weight: 700;
      }
      .right-wrong {
        .sign {
          display: inline-flex;
          flex-direction: row;
          align-items: center;
          margin-right: 30px;
          line-height: 30px;
        }
        .i {
          display: inline-block;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          margin-right: 12px;
        }
        .right {
          background: #27ce2f;
        }
        .wrong {
          background: #f53838;
        }
      }
      &-table {
        display: flex;
        .table {
          width: 100%;
          margin: 0;
          padding: 0;
          list-style: none;
          text-align: center;
          zoom: 1;
          margin-bottom: -1px;
          .table-cell {
            float: left;
            width: 20%;
            .question-number {
              height: 65px;
              line-height: 65px;
              border: 1px solid #d2d2d2;
              margin-top: -1px;
              margin-left: -1px;
            }
            .answer {
              border: 1px solid #d2d2d2;
              height: 50px;
              line-height: 50px;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
              margin-top: -1px;
              margin-left: -1px;
            }
            .right-answer {
              color: #27ce2f;
            }
            .wrong-answer {
              color: #f53838;
            }
          }
          &:after {
            content: '';
            visibility: hidden;
            display: block;
            width: 100%;
            height: 0;
            clear: both;
          }
        }
      }
    }
  }
}
@media screen and (max-width: 769px) {
  .lesson-student-record-wrap {
    .lesson-student-record {
      padding: 12px;
      &-title {
        .date {
          display: inline-block;
          text-align: right;
          margin-left: 20px;
          width: auto;
        }
      }
    }
  }
}
</style>
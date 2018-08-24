<template>
<div class="lesson-student-record-wrap">
  <div class="lesson-student-record">
    <div class="lesson-student-record-title">
      <p>
        <span class="brief-title">{{$t('modList.lesson')}} 1:</span> {{student.lessonName}}</p>
      <p>
        <span class="brief-title">{{$t('lesson.duration')}}:</span> 45mins
        <span class="date">{{student.createdAt | formatTime}}</span>
      </p>
    </div>
    <div class="lesson-student-record-content">
      <p class="nameInfo"><span class="nameInfo-name">{{$t('editor.name')}}: <span class="name">{{student.name}}</span></span> <span class="nameInfo-username">{{$t('lesson.username')}}: <span class="name">{{student.username}}</span></span></p>
      <p class="accuracy-rate">{{$t('lesson.accuracyRate')}}: {{student.accuracyRate}}</p>
      <p class="right-wrong">
        <span class="sign"><i class="i right"></i> {{$t('lesson.right')}}</span> 
        <span class="sign"><i class="i wrong"></i> {{$t('lesson.wrong')}}</span>
      </p>
      <div class="lesson-student-record-content-table">
        <ul class="table">
          <li class="table-cell" v-for="(quiz,index) in records" :key="index">
            <div class="question-number">quiz{{index + 1}}</div>
            <div v-if="quiz.data.type == 2" :class="['answer',quiz.result ? 'right-answer':'wrong-answer']">{{ formatTRF(quiz.answer)}}</div>
            <div v-else :class="['answer',quiz.result ? 'right-answer':'wrong-answer']">{{quiz.answer | formatQuiz}}</div>
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

export default {
  name: "LessonStudentRecord",
  data(){
    return{
      student:{},
      records:[]
    }
  },
  mounted(){
    this.student = this.$route.query.student
    this.records = _.get(this.$route.query.student,'quiz',[])
    console.log('qui',this.records)
    console.log('student',this.student)
  },
  methods: {
    formatTRF(value) {
      if (value === 'A') {
        return this.$t('lesson.right')
      }
      if (value === 'B') {
        return this.$t('lesson.wrong')
      }
      return ''
    },
  },
  filters: {
    formatTime(time) {
      return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
    },
    formatQuiz(value) {
      return value ? value.toString() : ''
    }
  },
}
</script>

<style lang="scss">
.lesson-student-record-wrap{
width: 100%;
background: rgb(250, 250, 250);
.lesson-student-record {
  width: 1149px;
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
    .date{
      display: inline-block;
      width: 300px;
      text-align: right;
    }
  }
  &-content{
    padding-top: 100px;
    .nameInfo{
      font-size: 16px;
      line-height: 30px;
      color: #414141;
      &-name{
        display: inline-block;
        width: 220px;

      }
      &-username{

      }
      .name{
        color: #409dff;
      }
    }
    .accuracy-rate{
      font-size: 16px;
      font-weight: 700;
    }
    .right-wrong{
      .sign{
        display: inline-flex;
        flex-direction: row;
        align-items: center;
        margin-right: 30px;
        line-height: 30px;
      }
      .i{
        display: inline-block;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        margin-right: 12px;
      }
      .right{
        background: #27ce2f;
      }
      .wrong{
        background: #f53838;
      }
    }
    &-table{
      border: 1px solid #d2d2d2;
      display: flex;
      .table{
        width: 100%;
        margin: 0;
        padding: 0;
        list-style: none;
        text-align: center;
        zoom: 1;
        .table-cell{
          float: left;
          width: 20%;
          .question-number{
            height: 65px;
            line-height: 65px;
            border-bottom:  1px solid #d2d2d2;
          }
          .answer{
            border-bottom:  1px solid #d2d2d2;
            height: 50px;
            line-height: 50px;
          }
          .right-answer{
            color: #27ce2f;
          }
          .wrong-answer{
            color: #f53838;
          }
        }
        &:after{
          content:"";
          visibility:hidden;
          display:block;
          width:100%;
          height:0;
          clear:both;
        }
      }
    }
  }
}
}
</style>
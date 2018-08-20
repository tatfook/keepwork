<template>
<div class="lesson-student-record-wrap">
  <div class="lesson-student-record">
    <div class="lesson-student-record-title">
      <p>
        <span class="brief-title">lesson 1:</span> Tutorial: Installation,Movement and Edit Mode</p>
      <p>
        <span class="brief-title">Duration:</span> 45mins
        <span class="date">Monday 20th,April,2018</span>
      </p>
    </div>
    <div class="lesson-student-record-content">
      <p class="nameInfo"><span class="nameInfo-name">Name: <span class="name">William Smith</span></span> <span class="nameInfo-username">UserName: <span class="name">Keepgo1230</span></span></p>
      <p class="accuracy-rate">Accuracy Rate: 40%</p>
      <p class="right-wrong">
        <span class="sign"><i class="i right"></i> right</span> 
        <span class="sign"><i class="i wrong"></i> Wrong</span>
      </p>
      <div class="lesson-student-record-content-table">
        <ul class="table">
          <li class="table-cell">
            <div class="question-number">quiz1</div>
            <div class="answer right-answer">A</div>
          </li>
          <li class="table-cell">
            <div class="question-number">quiz1</div>
            <div class="answer right-answer">A</div>
          </li>
          <li class="table-cell">
            <div class="question-number">quiz1</div>
            <div class="answer wrong-answer">A</div>
          </li>
          <li class="table-cell">
            <div class="question-number">quiz1</div>
            <div class="answer wrong-answer">A</div>
          </li>
          <li class="table-cell">
            <div class="question-number">quiz1</div>
            <div class="answer wrong-answer">A</div>
          </li>
        </ul>
      </div>
    </div>>>
  </div>
</div>
</template>

<script>
export default {
  name: "LessonStudentRecord",
  data(){
    return{}
  }
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
<template>
  <div class="teacher-summary">
    <div class="teacher-summary-print-and-email">
      <el-button type="primary">Print</el-button>
      <el-button type="primary">Send to Mailbox</el-button>
    </div>
    <div class="teacher-summary-brief">
      <p class="date">Mondat 20th,April,2018</p>
      <p>
        <span class="brief-title">Lesson 1:</span> Tutorial: Installation,Movement and Edit Mode</p>
      <p>
        <span class="brief-title">Intro:</span> ********</p>
      <p>
        <span class="brief-title">Durations:</span> 45mins</p>
      <div class="skillpoints">
        <div class="brief-title skill">Skillpoints:</div>
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
        <!-- <schart :canvasId="canvasId" :type="type" :width="width" :height="height" :data="data" :options="options"></schart> -->
      </div>
      <div class="teacher-summary-chart-student-number">
        <!-- <schart :canvasId="canvasId" :type="type" :width="width" :height="height" :data="data" :options="options"></schart> -->
      </div>
    </div>
    <div class="teacher-summary-detailed">
      <h4>Detailed:</h4>
      <div class="teacher-summary-detailed-change">
        <span>
          <el-button type="primary" size="mini">Change All</el-button> (Give full marks to all students)</span>
        <span>
          <el-button type="primary" size="mini">Change</el-button> (Give full marks to selected students)</span>
      </div>
      <div class="teacher-summary-detailed-table">
        <div class="teacher-summary-detailed-table-title">
          <el-checkbox label="NO."></el-checkbox>
          <span class="title">Name <img width="14" src="@/assets/lessonImg/summary/sort.png" alt=""></span>
          <span class="title">Username <img width="14" src="@/assets/lessonImg/summary/sort.png" alt=""></span>
          <span class="title">Accuracy Rate <img width="14" src="@/assets/lessonImg/summary/sort.png" alt=""></span>
          <span class="title">Right <img width="14" src="@/assets/lessonImg/summary/sort.png" alt=""></span>
          <span class="title">Wrong <img width="14" src="@/assets/lessonImg/summary/sort.png" alt=""></span>
          <span class="title">Empty <img width="14" src="@/assets/lessonImg/summary/sort.png" alt=""></span>
        </div>
        <div class="teacher-summary-detailed-table-content">
          <ul class="student-record">
            <li class="every-student">
              <el-checkbox class="every-student-checkbox"></el-checkbox>
              <span><img class="portraits" src="@/assets/lessonImg/cover1.png" alt=""> </span>
              <span class="desc">William Smith</span>
              <span class="desc">keepgo1230</span>
              <span class="desc">40%</span>
              <span class="desc">4</span>
              <span class="desc">2</span>
              <span class="desc">0</span>
              <span class="">
                <el-button type="primary" size="mini">View Details</el-button>
              </span>
            </li>
            <li class="every-student">
              <el-checkbox class="every-student-checkbox"></el-checkbox>
              <span><img class="portraits" src="@/assets/lessonImg/cover1.png" alt=""> </span>
              <span class="desc">William Smith</span>
              <span class="desc">keepgo1230</span>
              <span class="desc">40%</span>
              <span class="desc">4</span>
              <span class="desc">2</span>
              <span class="desc">0</span>
              <span class="">
                <el-button type="primary" size="mini">View Details</el-button>
              </span>
            </li>
            <li class="every-student">
              <el-checkbox class="every-student-checkbox"></el-checkbox>
              <img class="portraits" src="@/assets/lessonImg/cover1.png" alt="">
              <span class="desc">William Smith</span>
              <span class="desc">keepgo1230</span>
              <span class="desc">40%</span>
              <span class="desc">4</span>
              <span class="desc">2</span>
              <span class="desc">0</span>
              <span class="">
                <el-button type="primary" size="mini">View Details</el-button>
              </span>
            </li>

          </ul>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {}
  }
}
</script>
<style lang="scss">
.teacher-summary {
  width: 1069px;
  margin: 0 auto;
  padding: 0 40px 40px;
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
      .points-list{
        margin: 0;
        list-style: none;
        li{
          margin: 5px;
        }
      }
    }
  }
  &-chart {
    width: 100%;
    background: #f8f8ff;
    display: flex;
    height: 422px;
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
}
</style>

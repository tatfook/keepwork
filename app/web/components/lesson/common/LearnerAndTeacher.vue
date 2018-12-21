<template>
  <div class="learner-and-teacher">
    <h4 class="learner-and-teacher-title">{{$t('lesson.whatYouWillGet')}}</h4>
    <div class="learner-and-teacher-box">
      <div class="acquire-item" :class="{'learner-and-teacher-teacher': n=== 3}" v-for="n in 3" :key="n">
        <div class="role">
          <div class="role-text">{{getRoleTitle(n)}}</div>
          <span class="role-cost">{{getRolePrice(n)}}</span>
        </div>
        <div class="access">
          <p class="caption">
            <span class="img-wrap"><img src="@/assets/lessonImg/legal_privilege.png" alt=""></span>{{$t('lesson.selfLearning')}}</p>
          <div class="teaching-function">
            <p>
              <span class="img-wrap"><img src="@/assets/lessonImg/legal_privilege.png" alt=""></span>{{$t('lesson.learnAmazingLessons')}}<span class="learner-and-teacher-light">({{n==1 ? $t('lesson.partiallyFree') : $t('lesson.allFree')}})</span></p>
            <p>
              <span class="img-wrap"><img src="@/assets/lessonImg/legal_privilege.png" alt=""></span>{{$t('lesson.realTimeFeedback')}}</p>
          </div>
          <p class="caption">
            <span class="img-wrap"><img src="@/assets/lessonImg/legal_privilege.png" alt=""></span>{{$t('lesson.lessonDevelopment')}}</p>
          <div class="teaching-function">
            <p>
              <span class="img-wrap"><img src="@/assets/lessonImg/legal_privilege.png" alt=""></span>{{$t('lesson.createLesson')}}</p>
            <p :class="{'not-student-privilege-text': n === 1}">
              <span class="img-wrap"><img :class="{'not-student-privilege': n === 1}" src="@/assets/lessonImg/legal_privilege.png" alt=""></span>{{$t('lesson.submitLessons')}}</p>
            <p :class="{'not-student-privilege-text': n === 1}">
              <span class="img-wrap"><img :class="{'not-student-privilege': n === 1}" src="@/assets/lessonImg/legal_privilege.png" alt=""></span>{{$t("lesson.getBenefit")}}</p>
          </div>
          <p :class="[{'not-student-privilege-text': n <= 2},'caption']">
            <span class="img-wrap"><img :class="{'not-student-privilege': n <= 2}" src="@/assets/lessonImg/legal_privilege.png" alt=""></span>{{$t('lesson.classroomTeaching')}}</p>
          <div class="teaching-function">
            <p :class="{'not-student-privilege-text': n <= 2}">
              <span class="img-wrap"><img :class="{'not-student-privilege': n <= 2}" src="@/assets/lessonImg/legal_privilege.png" alt=""></span>{{$t('lesson.freeForClassroomTeaching')}}</p>
            <p :class="{'not-student-privilege-text': n <= 2}">
              <span class="img-wrap"><img :class="{'not-student-privilege': n <= 2}" src="@/assets/lessonImg/legal_privilege.png" alt=""></span>{{$t('lesson.freeForClassroomLearning')}}</p>
            <p :class="{'not-student-privilege-text': n <= 2}">
              <span class="img-wrap"><img :class="{'not-student-privilege': n <= 2}" src="@/assets/lessonImg/legal_privilege.png" alt=""></span>{{$t('lesson.trackStudentsPerformance')}}</p>
            <p :class="{'not-student-privilege-text': n <= 2}">
              <span class="img-wrap"><img :class="{'not-student-privilege': n <= 2}" src="@/assets/lessonImg/legal_privilege.png" alt=""></span>{{$t('lesson.beShownReport')}}</p>
            <p :class="{'not-student-privilege-text': n <= 2}">
              <span class="img-wrap"><img :class="{'not-student-privilege': n <= 2}" src="@/assets/lessonImg/legal_privilege.png" alt=""></span>{{$t('lesson.trackTeachingProgress')}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LearnerAndTeacher',
  methods: {
    getRoleTitle(index) {
      return index === 1 ? this.$t('lesson.learners') : (index === 2 ? this.$t('lesson.lessonDevelopers') : this.$t('lesson.instructors'))
    },
    getRolePrice(index) {
      return index === 1 ? this.$t('lesson.free') : (index === 2 ? `￥100${this.$t('lesson.perYearPerPerson')}` : `￥5000${this.$t('lesson.perYearPerPerson')}`)
    }
  }
}
</script>
<style lang="scss">
.learner-and-teacher {
  padding-bottom: 40px;
  background: #fff;
  &-teacher {
    margin-top: 40px;
  }
  &-light {
    color: #ff742e;
  }
  &-title {
    text-align: center;
    font-size: 24px;
    padding-top: 30px;
  }
  &-box {
    display: flex;
    justify-content: space-around;
    margin: 30px 0;
    .acquire-item {
      max-width: 570px;
      font-size: 14px;
      line-height: 30px;
      // box-shadow: 1px 1px 5px #ddd9d9, -1px -1px 5px #ddd9d9;
      border: 1px solid #eee;
      .role {
        height: 100px;
        text-align: center;
        font-size: 24px;
        color: #333333;
        background: #f7f7f7;
        &-text {
          font-weight: bold;
          color: #333;
          padding-top: 20px;
        }
        &-cost {
          font-size: 18px;
          color: #10c55b;
        }
      }
      .access {
        padding: 44px 25px;
        background: #fff;
        .caption {
          margin-bottom: 2px;
        }
        p {
          padding-left: 24px;
          position: relative;
          .img-wrap {
            margin-right: 8px;
            display: inline-block;
            width: 20px;
            height: 20px;
            top: 6px;
            position: absolute;
            left: 0;
            .not-student-privilege {
              visibility: hidden;
            }
          }
        }
        .not-student-privilege-text {
          color: rgb(179, 177, 177);
        }
        .teaching-function {
          margin-left: 20px;
          p {
            margin: 2px;
          }
        }
      }
    }
  }
}
@media (max-width: 768px) {
  .learner-and-teacher {
    &-box {
      display: block;
      .acquire-item {
        margin-bottom: 20px;
      }
    }
  }
}
</style>

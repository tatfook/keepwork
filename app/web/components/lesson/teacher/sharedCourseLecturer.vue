<template>
  <div class="shared-course-lecturer">
    <div class="shared-course-lecturer-title">您已成为<span class="extrude">共享课程讲师</span></div>
    <div class="shared-course-lecturer-contact">如需咨询，请联系：程老师 13267059950 （电话/微信）、846704851（QQ）</div>
    <div class="teacher-acquire">
      <h4 class="teacher-acquire-title">具体服务如下</h4>
      <div class="teacher-acquire-box">
        <div class="acquire-item" v-for="n in 2" :key="n">
          <div :class="['role',n === 2 ? 'role-teacher':'']">
            <div class="role-text">{{n === 1 ? '自主学习用户' : "共享课程讲师"}}</div>
            <span class="role-cost">{{n === 1 ? '免费' : "￥5000/年/人"}}</span>
          </div>
          <div class="access">
            <p>
              <span class="img-wrap"><img src="@/assets/lessonImg/legal_privilege.png" alt=""></span>自主学习</p>
            <div class="teaching-function">
              <p>
                <span class="img-wrap"><img src="@/assets/lessonImg/legal_privilege.png" alt=""></span>学习优质课程<span>(部分课程课程)</span></p>
              <p>
                <span class="img-wrap"><img src="@/assets/lessonImg/legal_privilege.png" alt=""></span>实时反馈学习情况、技能增长情况</p>
            </div>
            <p :class="{'not-student-privilege-text': n === 1}">
              <span class="img-wrap"><img :class="{'not-student-privilege': n === 1}" src="@/assets/lessonImg/legal_privilege.png" alt=""></span>课程开发</p>
            <div class="teaching-function">
              <p :class="{'not-student-privilege-text': n === 1}">
                <span class="img-wrap"><img :class="{'not-student-privilege': n === 1}" src="@/assets/lessonImg/legal_privilege.png" alt=""></span>创建课程</p>
              <p :class="{'not-student-privilege-text': n === 1}">
                <span class="img-wrap"><img :class="{'not-student-privilege': n === 1}" src="@/assets/lessonImg/legal_privilege.png" alt=""></span>发表课程，可供平台用户教学</p>
              <p :class="{'not-student-privilege-text': n === 1}">
                <span class="img-wrap"><img :class="{'not-student-privilege': n === 1}" src="@/assets/lessonImg/legal_privilege.png" alt=""></span>获得收藏</p>
            </div>
            <p :class="{'not-student-privilege-text': n === 1}">
              <span class="img-wrap"><img :class="{'not-student-privilege': n === 1}" src="@/assets/lessonImg/legal_privilege.png" alt=""></span>课堂教学</p>
            <div class="teaching-function">
              <p :class="{'not-student-privilege-text': n === 1}">
                <span class="img-wrap"><img :class="{'not-student-privilege': n === 1}" src="@/assets/lessonImg/legal_privilege.png" alt=""></span>平台所有课程可免费用于课堂教学</p>
              <p :class="{'not-student-privilege-text': n === 1}">
                <span class="img-wrap"><img :class="{'not-student-privilege': n === 1}" src="@/assets/lessonImg/legal_privilege.png" alt=""></span>班级学生可免费在课堂中学习平台所有课程</p>
              <p :class="{'not-student-privilege-text': n === 1}">
                <span class="img-wrap"><img :class="{'not-student-privilege': n === 1}" src="@/assets/lessonImg/legal_privilege.png" alt=""></span>实时反馈学生的课堂表现和作答情况</p>
              <p :class="{'not-student-privilege-text': n === 1}">
                <span class="img-wrap"><img :class="{'not-student-privilege': n === 1}" src="@/assets/lessonImg/legal_privilege.png" alt=""></span>自动生成课堂总结报告，支持打印、发送到邮箱</p>
              <p :class="{'not-student-privilege-text': n === 1}">
                <span class="img-wrap"><img :class="{'not-student-privilege': n === 1}" src="@/assets/lessonImg/legal_privilege.png" alt=""></span>跟踪授课进度，追溯授课轨迹</p>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>
<style lang="scss">
.shared-course-lecturer {
  &-title {
    text-align: center;
    font-size: 24px;
    line-height: 40px;
    margin: 14px;
    .extrude {
      color: #2397f3;
    }
  }
  &-contact {
    color: #2397f3;
    line-height: 50px;
    text-align: center;
    border: 1px solid #2397f3;
    background-color: rgb(238, 247, 255);
  }
  .teacher-acquire {
    padding-bottom: 40px;
    background: #fff;
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
          p {
            display: flex;
            align-items: center;
            .img-wrap {
              margin-right: 8px;
              display: inline-block;
              width: 20px;
              height: 20px;
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
          }
        }
      }
    }
  }
}
@media (max-width: 768px) {
  .shared-course-lecturer {
    .teacher-acquire {
      &-box {
        display: block;
        .acquire-item {
          margin-bottom: 20px;
        }
      }
    }
  }
}
</style>


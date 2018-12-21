<template>
  <div class="mentor-invite">
    <h1 class="mentor-invite-title">{{$t('lesson.mentorServiceToBeReleased')}}</h1>
    <div class="mentor-invite-content">
      <p>{{$t('lesson.selfDirectedLearning')}}</p>
      <p>{{$t('lesson.mentorServiceIsInNeed')}}</p>
    </div>
    <div class="mentor-invite-contact">{{$t('lesson.toBeMentorContact')}}</div>
  </div>
</template>
<script>
export default {
  name: 'MentorInvite'
}
</script>
<style lang="scss">
.mentor-invite {
  padding: 30px 40px 80px;
  &-title {
    margin: 0 0 24px 0;
    padding-bottom: 12px;
    border-bottom: 1px solid #d2d2d2;
    text-align: center;
    font-size: 20px;
    color: #333;
  }
  &-content {
    font-size: 14px;
    color: #818181;
    p {
      margin: 0;
      line-height: 28px;
    }
  }
  &-contact {
    font-size: 14px;
    color: #409efe;
    margin-top: 20px;
  }
}
</style>

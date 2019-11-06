<template>
  <div class="apply-way">
    <h3 class="apply-way-title"><img src="@/assets/contests/报名须知.png" alt=""></h3>
    <div class="apply-way-notice">
      <p class="apply-way-notice-step"><span class="step-num">1.</span>打开keepwork网站<a class="apply-way-notice-step-link" @click="showRegisterDialog">注册</a>账号并进行登录；</p>
      <p class="apply-way-notice-step"><span class="step-num">2.</span>仔细阅读汉字大赛官网信息并在规定时间内完成报名；</p>
      <p class="apply-way-notice-step"><span class="step-num">3.</span>仔细填写报名页面的信息，一经提交无法修改；</p>
      <p class="apply-way-notice-step"><span class="step-num">4.</span>报名完成后，请加入QQ交流群方便创作沟通，群号1016421059，有任何疑问也可发送邮件至3487844868@qq.com，我们将在12小时内给出解答；</p>
      <p class="apply-way-notice-step"><span class="step-num">5.</span>忘记账号密码，请点此<a class="apply-way-notice-step-link" @click="resetPwd">重置</a>。</p>
    </div>
    <h3 class="apply-way-title"><img src="@/assets/contests/大赛时间.png" alt=""></h3>
    <div class="apply-way-time">
      <p class="apply-way-time-part"><span class="apply-way-time-part-name">大赛时间</span><span class="apply-way-time-part-time">2019年4月-12月</span></p>
      <p class="apply-way-time-part"><span class="apply-way-time-part-name">作品提交截止时间</span><span class="apply-way-time-part-time">2019年12月20日</span></p>
      <!-- <p class="apply-way-time-hint">◆请各位参赛者务必注意报名时间，要是不小心错过了一网乾坤可是会为你伤心的哦！</p> -->
    </div>
    <img class="apply-way-bgpic element_text_1" src="@/assets/contests/element_text_1.png" alt="">
    <!-- <img class="apply-way-bgpic element_text_2" src="@/assets/contests/element_text_2.png" alt=""> -->
    <!-- <img class="apply-way-bgpic element_text_3" src="@/assets/contests/element_text_3.png" alt=""> -->
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'ApplyWay',
  methods: {
    ...mapActions({
      toggleLoginDialog: 'pbl/toggleLoginDialog'
    }),
    showRegisterDialog() {
      this.toggleLoginDialog(true)
    },
    resetPwd() {
      window.open(`${window.location.origin}/u/set`)
    }
  }
}
</script>

<style lang="scss" scoped>
.apply-way {
  color: #212121;
  position: relative;
  max-width: 1920px;
  margin: 0 auto;
  &-bgpic {
    position: absolute;
    z-index: -999;
    &.element_text_1 {
      right: 100px;
      top: 10px;
    }
    // &.element_text_2 {
    //   left: 0;
    //   top: 120px;
    // }
    // &.element_text_3 {
    //   left:  400px;
    //   bottom: 0px;
    // }
  }
  &-title {
    text-align: center;
    margin: 70px 0 0;
  }
  &-notice {
    max-width: 900px;
    margin: 0 auto;
    padding: 0 12px 0 100px;
    font-size: 18px;
    box-sizing: border-box;
    &-step {
      padding-left: 20px;
      position: relative;
      .step-num {
        position: absolute;
        top: 0;
        left: 0;
      }
      &-link {
        color: #0d73e4;
        text-decoration: none;
        cursor: pointer;
      }
    }
  }
  &-time {
    max-width: 740px;
    margin: 0 auto 100px;
    font-size: 20px;
    &-part {
      display: flex;
      justify-content: center;
      text-align: center;
      &-name {
        width: 188px;
      }
      &-time {
        width: 164px;
      }
    }
    &-hint {
      text-align: center;
      font-size: 18px;
      color: #657d96;
      padding: 0 12px;
    }
  }
}
@media screen and (max-width: 768px) {
  .apply-way {
    &-bgpic {
      display: none;
    }
    &-title {
      img {
        max-width: 84%;
      }
    }
    &-notice {
      font-size: 14px;
      padding-left: 20px;
    }
    &-time {
      font-size: 14px;
      &-hint {
        font-size: 12px;
      }
    }
  }
}
</style>


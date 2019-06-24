<template>
  <div class="apply-way">
    <h3 class="apply-way-title"><img src="@/assets/contests/报名须知.png" alt=""></h3>
    <div class="apply-way-notice">
      <p class="apply-way-notice-step">1、请先keepwork<a class="apply-way-notice-step-link" @click="showRegisterDialog">注册</a> 账号并进行登录，再继续报名参加“用计算机程序让汉字活起来走向世界”内容创作大赛”；</p>
      <p class="apply-way-notice-step">2、完成注册后，请参考<a class="apply-way-notice-step-link">http://...</a>或下方的赛事时间，在相应的时间进行比赛报名；</p>
      <p class="apply-way-notice-step">3、请您完善报名参赛信息，以便我们对您进行赛事通知；</p>
      <p class="apply-way-notice-step">4、审核通过后将无法修改报名信息，请各位在报名时认真填写个人信息；</p>
      <p class="apply-way-notice-step">5、完成报名后，点击<a class="apply-way-notice-step-link" href="http://paracraft.keepwork.com/download?lang=zh" target="_blank">下载</a>指定创作软件《Paracraft创意空间》，可进行自由创作并提交作品；</p>
      <p class="apply-way-notice-step">6、报名阶段，如果有任何疑问，请发邮件到我们的答疑邮箱 3487844868@qq.com，我们将及时为您解答；</p>
      <p class="apply-way-notice-step red-step">7、如果忘记账号密码，请点此<a class="apply-way-notice-step-link" @click="resetPwd">重置</a>。</p>
      <p class="apply-way-notice-step red-step">8、资格赛需要注册该场比赛后才能参加。</p>
    </div>
    <h3 class="apply-way-title"><img src="@/assets/contests/大赛时间.png" alt=""></h3>
    <div class="apply-way-time">
      <p class="apply-way-time-part"><span class="apply-way-time-part-name">大赛时间</span><span class="apply-way-time-part-time">2019年4月-12月</span></p>
      <p class="apply-way-time-part"><span class="apply-way-time-part-name">作品提交截止时间</span><span class="apply-way-time-part-time">2019年11月30日</span></p>
      <p class="apply-way-time-hint">◆请各位参赛者务必注意报名时间，要是不小心错过了一网乾坤可是会为你伤心的哦！</p>
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
    max-width: 930px;
    margin: 0 auto;
    padding: 0 12px;
    font-size: 18px;
    &-step {
      &.red-step {
        color: #d90948;
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
      &-name {
        width: 168px;
      }
      &-time {
        width: 144px;
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


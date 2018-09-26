<template>
  <span v-if="isShowJewel" @mouseover="showTips" @mouseout="closeTips" @click="handleClick" class="jewel-box" :class="{ opened: isJewelOpen  }">
    <div v-if="isJewelOpen" class="jewel-box-coin-wrap">
      <div class="tips">{{$t('lesson.receiveSuccess')}}</div>
      <div class="coin">+{{coin}}</div>
    </div>
    <div v-show="isShowTips" @click.stop class="tips-wrap">
      <span class="tips">
        <div class="tips-row">{{$t('lesson.jewelTipsTitleBean')}}</div>
        <div class="tips-row">{{$t('lesson.jewelTips1')}}
          <span class="tips-time">{{time | toMinute}}</span>
        </div>
        <div class="tips-row">{{$t('lesson.jewelTips2')}}</div>
        <!-- <div class="tips-row" v-html="$t('lesson.jewelTips3', {reward: `<sapn class='tips-coin'>${reward}</sapn>`, lockCoin: `<span class='tips-coin'>${lockCoin}</span>`})"></div> -->
      </span>
    </div>
    <audio :src="sound" style="display:none" id="coin-sound"></audio>
    <!-- <el-button @click="showBeanDialog">sound</el-button> -->
    <el-dialog :visible.sync="isShowDialog" custom-class="bean-dialog" :before-close="animateBean" width="300px" top="500px">
      <div class="bean" @click="animateBean">
        <img class="bean-icon" :src="beanIcon">
        <span class="bean-count">+{{bean}} {{$t('lesson.beans')}}</span>
      </div>
    </el-dialog>
  </span>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import anime from 'animejs'
import { lesson } from '@/api'
import sound from '@/assets/lessonImg/bean.mp3'
import beanIcon from '@/assets/lessonImg/bean.png'
import _ from 'lodash'
export default {
  name: 'JewelBox',
  props: {
    data: Object
  },
  filters: {
    toMinute(time) {
      let minute = Math.floor(time / 60)
        .toString()
        .padStart(2, '0')
      let second = (time % 60).toString().padStart(2, '0')
      return `${minute}:${second}`
    }
  },
  data() {
    return {
      isShowTips: false,
      isShowDialog: false,
      needTime: 300,
      time: 0,
      reward: 10,
      _timer: null,
      isReward: true,
      coin: 0,
      bean: 10,
      sound: sound,
      beanIcon: beanIcon
    }
  },
  watch: {
    isConditions(flag) {
      if (flag) {
        lesson.lessons
          .rewardCoin({ id: this._learnRecordId })
          .then(({ coin = 0, bean = 10 }) => {
            this.coin = coin
            this.bean = bean
            this.showBeanDialog()
          })
          .catch(e => console.error(e))
      }
    }
  },
  async mounted() {
    const { packageId, lessonId } = this.$route.params
    let { coin, bean } = await lesson.lessons.isReward({ packageId, lessonId })
    console.warn(`coin: ${coin}, bean: ${bean}`)
    if (coin > 0 || bean > 0) {
      this.isReward = false
      this.startTimer()
    }
  },
  computed: {
    ...mapGetters({
      lockCoin: 'lesson/lockCoin',
      lessonUserId: 'lesson/student/lessonUserId',
      userinfo: 'lesson/userinfo',
      isQuizAllRight: 'lesson/student/isQuizAllRight',
      isBeInClassroom: 'lesson/student/isBeInClassroom',
      enterClassInfo: 'lesson/student/enterClassInfo',
      learnRecordsId: 'lesson/student/learnRecordsId'
    }),
    _learnRecordId() {
      return this.isBeInClassroom
        ? this.enterClassInfo.learnRecordId
        : this.learnRecordsId
    },
    userId() {
      return this.userinfo.id
    },
    isJewelOpen() {
      return false
      // return this.coin > 0
    },
    isConditions() {
      return !!(
        this.time >= this.needTime &&
        // this.lockCoin >= this.reward &&
        this.isQuizAllRight &&
        this._learnRecordId
      )
    },
    isShowJewel() {
      return this.lessonUserId !== this.userId && !this.isReward
    }
  },
  methods: {
    playSound() {
      document.getElementById('coin-sound').play()
    },
    async showBeanDialog() {
      this.playSound()
      this.isShowDialog = true
    },
    animateBean() {
      let el = document.querySelector('.bean-icon')
      let domNode = anime({
        targets: el,
        opacity: 0,
        duration: 800,
        translateX: 250,
        translateY: -500,
        easing: 'linear'
      })
      setTimeout(() => (this.isShowDialog = false), 800)
    },
    handleClick() {
      this.isClicked = !this.isClicked
    },
    startTimer() {
      this.time++
      clearTimeout(this._timer)
      this._timer = setTimeout(() => {
        this.startTimer()
      }, 1000)
    },
    showTips() {
      this.isShowTips = true
    },
    closeTips() {
      this.isShowTips = false
    }
  }
}
</script>

<style lang="scss">
@keyframes fade-in {
  0% {
    opacity: 0;
  }
  40% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.jewel-box {
  display: inline-block;
  height: 38px;
  width: 66px;
  cursor: pointer;
  position: relative;
  background: url('../../../assets/lessonImg/jewelbox.png') no-repeat center
    #fff;
  &.opened {
    background: url('../../../assets/lessonImg/jewelbox2.png') no-repeat center
      #fff;
  }
  &-coin-wrap {
    position: absolute;
    top: -52px;
    left: 0;
    right: -7px;
    font-size: 14px;
    .tips {
      text-align: center;
      margin: 0 auto;
      color: #818181;
    }
    .coin {
      background: #ec761a;
      text-align: center;
      color: white;
      width: 70%;
      margin: 5px auto;
    }
    // width: 46px;
    // font-size: 14px;
    // line-height: 16px;
    // text-align: center;
    // margin: 0 auto;
    // color: white;
  }
  .tips-wrap {
    $shadow: 1px 10px 40px rgb(170, 170, 170);
    display: block;
    position: absolute;
    animation: fade-in;
    animation-duration: 0.5s;
    top: 110px;
    left: -26px;
    z-index: 998;
    min-height: 60px;
    width: 800px;
    background: white;
    border: #cacaca;
    box-shadow: $shadow;
    .tips {
      z-index: 34;
      padding: 40px;
      font-size: 16px;
      display: inline-block;
      background-color: #fff;
      word-wrap: break-word;
      .tips-time,
      .tips-coin {
        color: #ec761a;
        font-weight: bold;
      }
      .tips-row {
        line-height: 30px;
      }
    }
    &::before {
      content: '';
      display: inline-block;
      position: absolute;
      top: -14px;
      left: 60px;
      z-index: -1;
      transform: rotate(45deg);
      height: 40px;
      width: 40px;
      background: white;
      box-shadow: $shadow;
    }
  }
}
.bean-dialog {
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    // box-shadow: 0 0 200px #ddd;
    animation: flicker 4000ms ease infinite;
  }
  .bean {
    display: flex;
    justify-content: center;
    align-items: center;
    &-icon {
      width: 50px;
      height: 50px;
    }
    &-count {
      margin-left: 30px;
      font-weight: bold;
      font-size: 20px;
    }
  }
}


@keyframes flicker {
  0%,
  100% {
    box-shadow: 0 0 1rem #fefa01;
  }
  30%,
  70% {
    box-shadow: 0 0 8rem 1rem #fefa01;
  }
  50% {
    box-shadow: 0 0 8rem 1rem rgba(254, 250, 1, 0.8);
  }
}
</style>



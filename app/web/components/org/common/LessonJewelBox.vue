<template>
  <span v-if="isShowJewel" @mouseover="showTips" @click="handleClick" class="jewel-box" :class="{ opened: isJewelOpen  }">
    <div v-if="isJewelOpen" class="jewel-box-coin-wrap">
      <!-- <div class="tips">{{$t('lesson.receiveSuccess')}}</div>
      <div class="coin">+{{coin}}</div> -->
    </div>
    <div v-show="isShowTips" @click.stop class="tips-wrap">
      <span class="tips">
        <div class="tips-row">{{$t('lesson.jewelTipsTitleBean')}}</div>
        <div class="tips-row">{{$t('lesson.jewelTips1')}}
          <span class="tips-time">{{time | toMinute}}</span>
        </div>
        <div class="tips-row">{{$t('lesson.jewelTips2')}}</div>
        <div class="tips-button">
          <el-button type="primary" @click="hideTips">{{$t('lesson.jewelButton')}}</el-button>
        </div>
        <!-- <div class="tips-row" v-html="$t('lesson.jewelTips3', {reward: `<sapn class='tips-coin'>${reward}</sapn>`, lockCoin: `<span class='tips-coin'>${lockCoin}</span>`})"></div> -->
      </span>
    </div>
    <audio :src="sound" style="display:none" id="coin-sound"></audio>
    <!-- <el-button @click="showBeanDialog">show bean</el-button> -->
    <el-dialog :visible.sync="isShowDialog" custom-class="bean-dialog" width="300px" :before-close="animateBean" center top="500px">
      <div class="bean" @click="animateBean">
        <div class="bean-light">
          <img class="bean-icon" :src="beanIcon">
        </div>
        <div class="bean-count">+{{bean}} {{$t('lesson.beans')}}</div>
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
      needTime: 900,
      time: 0,
      reward: 10,
      _timer: null,
      isReward: true,
      coin: 0,
      bean: 0,
      sound: sound,
      beanIcon: beanIcon
    }
  },
  watch: {
    async isConditions(flag) {
      if (flag) {
        const { packageId, lessonId } = this.$route.params
        this.isBeInClassroom
          ? await this.uploadLearnRecords(1).catch(e => console.error(e))
          : await this.uploadSelfLearnRecords({
              packageId: Number(packageId),
              lessonId: Number(lessonId),
              state: 1
            }).catch(e => console.error(e))
        await lesson.lessons
          .rewardCoin({ id: this._learnRecordId })
          .then(({ coin, bean }) => {
            this.coin = coin
            this.bean = bean
            bean > 0 && this.showBeanDialog()
            this.getUserDetail().catch(err => console.error(err))
          })
          .catch(e => {
            console.error(e)
            this.$message.error(this.$t('common.failure'))
          })
      }
    },
    isQuizAllRight(value) {
      value && this.showTips()
    }
  },
  async mounted() {
    const { packageId, lessonId } = this.$route.params
    let { coin, bean } = await lesson.lessons.isReward({ packageId, lessonId })
    if (bean === 0) {
      this.isReward = false
      this.isShowJewel && this.startTimer()
    }
  },
  destroyed() {
    clearTimeout(this._timer)
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
      return this.bean > 0
    },
    isConditions() {
      return !!(
        this.isShowJewel &&
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
    ...mapActions({
      uploadSelfLearnRecords: 'lesson/student/uploadSelfLearnRecords',
      uploadLearnRecords: 'lesson/student/uploadLearnRecords',
      getUserDetail: 'lesson/getUserDetail'
    }),
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
        translateX: 200,
        translateY: -500,
        easing: 'linear'
      })
      setTimeout(() => (this.isShowDialog = false), 800)
    },
    handleClick() {
      this.isClicked = !this.isClicked
    },
    async startTimer() {
      this.time++
      if (this.time > 29 && this.time % 30 === 0) {
        let lastLearnRecords = await lesson.lessons
          .getLastLearnRecords()
          .catch(e => console.error(e))
        lastLearnRecords = _.get(lastLearnRecords, 'rows', [])
        if (lastLearnRecords.length > 0 && lastLearnRecords[0].state === 0) {
          if (
            this.isBeInClassroom &&
            this.enterClassInfo.id !== lastLearnRecords[0].id
          ) {
            return this.$router.push({ name: 'StudentCenter' })
          }
          if (
            !this.isBeInClassroom &&
            this.learnRecordsId !== lastLearnRecords[0].id
          ) {
            return this.$router.push({ name: 'StudentCenter' })
          }
        }
      }
      clearTimeout(this._timer)
      if (this.isShowJewel) {
        this._timer = setTimeout(() => {
          this.startTimer()
        }, 1000)
      }
    },
    showTips() {
      this.isShowTips = true
    },
    hideTips() {
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
  background: url('../../../assets/lessonImg/jewelbox.png') no-repeat center;
  &.opened {
    background: url('../../../assets/lessonImg/jewelbox2.png') no-repeat center;
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
    top: 70px;
    left: -26px;
    z-index: 998;
    min-height: 60px;
    width: 800px;
    background: white;
    border: #cacaca;
    box-shadow: $shadow;
    .tips {
      z-index: 34;
      padding: 20px 40px;
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
      .tips-button {
        margin-top: 20px;
      }
    }
    &::before {
      content: '';
      display: inline-block;
      position: absolute;
      top: -14px;
      left: 39px;
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
  border-radius: 20px;
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    background: #2c283f;
    animation: flicker 4000ms ease infinite;
    border-radius: 20px;
  }
  .bean {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    &-light {
      background: url('../../../assets/lessonImg/light.png') no-repeat center;
      width: 260px;
      height: 200px;
      background-size: 75%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    &-icon {
      width: 50px;
      height: 50px;
    }
    &-count {
      text-align: center;
      width: 200px;
      height: 54px;
      line-height: 43px;
      font-weight: bold;
      font-size: 18px;
      color: white;
      background: url('../../../assets/lessonImg/button.png') no-repeat center;
      background-size: 100%;
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
@media screen and (max-width: 768px) {
  .jewel-box {
    .tips-wrap {
      width: 350px;
      .tips {
        font-size: 12px;
        &-button {
          .el-button {
            padding: 7px;
          }
        }
      }
    }
  }
}
</style>
<style lang="scss">
@media (max-width: 768px) {
  .jewel-box {
    width: 33px;
    height: 19px;
    background-size: contain;
    left: -16px;
  }
}
</style>


